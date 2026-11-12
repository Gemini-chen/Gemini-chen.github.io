/* =========================================================
   陈靖明 / Portfolio 2026 — 交互脚本
   原生 JS，无第三方依赖
   V1.4：4 段并列实机演示、MoveIt2 项目边界修正（仅 ROS2 侧）、五关节图文统一
   ========================================================= */
(function () {
  'use strict';

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  /* ---------- 项目详情数据（后续替换真实内容只改这里） ---------- */
  const PROJECTS = [
    {
      index: '01 / PROJECT',
      date: '2025.01 — 2025.04',
      title: '四旋翼无人机飞控协同系统',
      en: 'STM32F103 · REMOTE + FLIGHT CONTROL',
      arch: '本项目基于 STM32F103C8T6 的无人机遥控手柄及飞控协同控制系统。手柄端通过 ADC 采集霍尔摇杆的模拟电压信号，经数字滤波后，通过 SPI 驱动 nRF24L01 模块，将控制指令以 2.4GHz 无线方式发送至无人机飞控主控。飞控端接收指令后，融合 IMU 数据解算当前姿态与速度，构建串级 PID 控制（位置外环 + 速度内环）实现闭环稳定控制。系统支持通过板载按键实时切换悬浮模式（定高定点悬停）与普通模式，满足不同飞行场景需求。',
      highlights: [
        'ADC 采集霍尔摇杆 + 数字滤波，抑制模拟噪声与摇杆抖动',
        'SPI 驱动 nRF24L01，建立 2.4GHz 低延迟遥控链路',
        'IMU 姿态解算配合串级 PID（位置外环 + 速度内环）闭环稳定',
        '板载按键实时切换「定高定点悬停 / 普通」双模式'
      ],
      stack: ['C 语言', 'Keil 5', '立创 EDA', '串口调试助手', 'nRF24L01', 'GPIO', 'PWM', 'UART', 'SPI', 'IIC', 'ADC', 'PID']
    },
    {
      index: '02 / PROJECT',
      date: '2025.05 — 2025.10',
      title: '麦克纳姆轮全向移动小车',
      en: 'STM32F407 · FREERTOS + CAN BUS',
      arch: '本项目采用模块化硬件架构，分别设计四层控制板与专用电源板，实现电源的集中管理与智能分配。控制板遵循「外层走信号、内层走电源」的布局策略，在优化信号完整性的同时有效抑制电源噪声。远程遥控依托富斯 i6 接收机，通过 SBUS 协议实现低延迟的无线指令传输。软件层面引入 FreeRTOS 实时操作系统，支撑多任务并发调度，保证控制逻辑的实时响应。电机驱动选用 Robot Master 系列电机，通过 CAN 总线完成指令下发与状态反馈，并嵌入 PID 算法构建闭环控制回路，显著提升系统的动态响应与稳态精度。',
      highlights: [
        '四层控制板 + 独立电源板，信号层 / 电源层分离布局',
        'SBUS 解析富斯 i6 遥控指令，实现低延迟无线控制',
        'FreeRTOS 多任务划分：遥控解析 / 运动学解算 / CAN 收发 / 状态反馈',
        'CAN 总线闭环 + PID 调参，优化动态响应与稳态精度'
      ],
      stack: ['C 语言', 'CubeMX', 'Keil 5', '立创 EDA', 'STM32F407', 'FreeRTOS', 'CAN', 'UART', 'SBUS', 'PID', '四层 PCB']
    },
    {
      index: '03 / PROJECT',
      date: '2025.11 — 2026.05',
      title: 'ROS 自主移动机器人平台',
      en: 'ROS2 / NAV2 / SLAM · FULL STACK',
      arch: '搭建「STM32F4 下位机 — 树莓派中位机 — PC 上位机」三级架构。下位机完成三轮全向轮与两轮差速两种底盘的运动学逆解、编码器正解与直流编码电机驱动，并上传里程计、ADC 电池电压与 MPU6050 姿态数据。定位采用两级 EKF：下位机融合编码器 + IMU 输出本体里程计，上位机以 robot_localization（50Hz EKF）二次融合轮速与陀螺仪抗漂移，再由激光 SLAM 提供 map→odom 全局校正。迁移至 ROS2 后重写全向运动学，集成 slam_toolbox 异步建图、Nav2（NavFn + DWB）与多层 Costmap，以行为树驱动 Spin / BackUp 恢复行为。',
      highlights: [
        '两级融合架构：下位机 EKF 输出本体里程计；上位机 robot_localization（50Hz EKF）二次融合抗漂移',
        '激光 SLAM 提供 map→odom 全局校正，消除长期累积误差',
        'ROS2 全栈导航：重写全向运动学、slam_toolbox 异步建图、Nav2（NavFn 全局 + DWB 局部）、多层 Costmap',
        '行为树驱动 Spin / BackUp 恢复行为，支持无先验地图动态避障与在线重规划',
        '自研 N10 激光雷达驱动包，完成协议解析与坐标变换，封装为标准 /scan 话题'
      ],
      stack: ['C', 'Python', 'CubeIDE', '立创 EDA', 'ROS2', 'Nav2', 'SLAM', 'EKF', 'slam_toolbox', 'PWM', 'UART', 'IIC'],
      demo: { href: '#demo-ros', label: '▶ 观看 ROS2 避障实机演示' }
    },
    {
      index: '04 / PROJECT',
      date: '2026.06 — 2026.07',
      title: '远程 IO 模块（Modbus TCP/RTU）',
      en: 'STM32F103 · MODBUS TCP / RTU + RS485',
      arch: '设计并实现一款支持 Modbus TCP/RTU 双协议的远程 IO 模块，具备 8 路隔离数字输入、6 路隔离数字输出和模拟量采集能力，支持拨码配置与 10ms 周期 IO 扫描。硬件基于立创 EDA 完成原理图与 PCB 设计：数字输入采用双向光耦隔离、数字输出经光耦隔离，通过 I2C 读取 ADS1115 实现 16 位模拟量采样；板上集成 RS485、以太网、TTL 串口及预留 I2C 接口，拨码开关可配置站号、波特率及 120Ω 终端电阻使能。固件基于 FreeRTOS 创建三个任务，并设计统一寄存器映射让 TCP 与 RTU 通道共享 IO 数据。',
      highlights: [
        '8DI / 6DO 全光耦隔离 + ADS1115（I2C）模拟量采集，原理图与 PCB 独立完成',
        'RS485 / 以太网 / TTL 三通道接入，拨码配置站号、波特率与 120Ω 终端电阻',
        'FreeRTOS 三任务：Modbus RTU/TCP 双模式协议栈、10ms 周期 IO 扫描与执行、系统监控与看门狗喂狗',
        '统一寄存器映射实现 TCP 与 RTU 通道间的 IO 数据共享',
        '完成 RS485 / 以太网 / TTL 联调与 IO 读写验证（Modbus Poll 实测）'
      ],
      stack: ['C', 'FreeRTOS', 'STM32F103', 'Modbus TCP/RTU', 'RS485', 'UART', 'I2C', 'SPI', 'ADS1115', '立创 EDA', '光耦隔离']
    },
    {
      index: '05 / PROJECT',
      date: '2026.09 — 2026.11',
      title: 'STM32 机械臂无线遥控系统',
      en: 'STM32 · BT24W + APP TELEOP',
      arch: '以 STM32 作为机械臂下位机控制核心，BT24W 无线串口负责 APP 指令下发与状态回传，构成「APP 双摇杆遥控 — BT24W 透明串口 — STM32 协议解析 — 五关节串口总线舵机」链路。STM32 完成指令帧校验、J1–J5 关节 ID 映射，并通过 UART 按众灵协议封装角度设置、角度回读与力矩释放指令，按舵机 ID 驱动五个关节；舵机角度回包后经 BT24W 上报 APP 实时显示。',
      highlights: [
        'BT24W 无线串口双向链路：APP 指令下行 / 舵机角度与运行状态上行',
        'STM32 完成帧头、长度与校验和解析，按 J1–J5 五个舵机 ID 完成关节映射',
        'UART 封装众灵串口总线舵机协议：角度设置 / 角度回读 / 力矩释放三类指令',
        'APP 多模式控制：五关节单独点动、双摇杆分组控制、力矩释放便于示教',
        '角度回读闭环：舵机回包 → STM32 解析 → BT24W 上报 → APP 实时显示'
      ],
      stack: ['C', 'STM32', 'FreeRTOS / 裸机', 'UART', 'BT24W', '众灵串口总线舵机协议', '5 自由度', 'APP 遥控', 'Keil 5', '串口调试助手'],
      demo: { href: '#demo-teleop', label: '▶ 观看 BT24W 摇杆遥控实机演示' }
    },
    {
      index: '06 / PROJECT',
      date: '2026.09 — 2026.11',
      title: 'MoveIt2 机械臂运动学逆解与轨迹规划',
      en: 'ROS2 / MOVEIT2 · IK + URDF / SRDF',
      arch: '本项目只在 ROS2 侧完成：按 SolidWorks 五关节模型建立 URDF 连杆 / 关节树、SRDF 规划组 arm 与末端执行器配置，由目标位姿求解运动学逆解，完成关节空间与笛卡尔空间轨迹规划、碰撞检测及 RViz 可视化验证。规划结果通过 ROS2 动作通信（FollowJointTrajectory / Goal · Feedback · Result）下发，再由众灵自定义消息包完成关节指令发布与 /joint_states 状态订阅，驱动串口总线舵机；实物机械臂运动位姿与 RViz 中的规划位姿一致。链路不涉及 STM32 与 BT24W。',
      highlights: [
        'SolidWorks 五自由度实体模型 → URDF 连杆 / 关节树 → SRDF 规划组 arm 与末端配置',
        '由目标位姿求解逆运动学解出 J1–J5 关节角，关节空间 / 笛卡尔空间轨迹规划 + 碰撞检测',
        'ROS2 动作通信：FollowJointTrajectory 的 Goal / Feedback / Result 承载轨迹点',
        '众灵自定义消息包收发：关节指令发布、/joint_states 反馈订阅，rqt_graph 可验证节点链路',
        'RViz Plan & Execute 返回 SUCCEEDED，实物机械臂位姿与 RViz 规划位姿一致'
      ],
      stack: ['C++', 'Python', 'ROS2', 'MoveIt2', 'URDF / SRDF', '逆运动学 / IK', 'OMPL', 'ROS2 Action', '众灵自定义消息包', 'RViz', 'rqt_graph', 'SolidWorks'],
      demo: { href: '#demo-arm', label: '▶ 观看 MoveIt2 实物运动演示' },
      demo2: { href: '#demo-rviz', label: '▶ 对照 RViz 规划录屏' }
    }
  ];

  /* ---------- DOM ---------- */
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  const navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  const sections = ['home', 'about', 'work', 'edge', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  /* ---------- 滚动：进度条 / 导航状态 / 当前章节 ---------- */
  let ticking = false;
  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    nav.classList.toggle('is-scrolled', y > 24);

    const probe = y + window.innerHeight * 0.42;
    let current = 'home';
    sections.forEach(function (sec) {
      if (sec.offsetTop <= probe) current = sec.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-nav') === current);
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- 滚动进场 ---------- */
  const revealItems = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 项目详情弹层 ---------- */
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalIndex = document.getElementById('modalIndex');
  const modalDate = document.getElementById('modalDate');
  const modalEn = document.getElementById('modalEn');
  const modalArch = document.getElementById('modalArch');
  const modalHighlights = document.getElementById('modalHighlights');
  const modalStack = document.getElementById('modalStack');
  const modalDemoLink = document.getElementById('modalDemoLink');
  const modalDemoLink2 = document.getElementById('modalDemoLink2');
  const modalGalleryLink = document.getElementById('modalGalleryLink');
  const closeBtn = modal.querySelector('.modal__close');
  let lastFocused = null;

  function fillModal(i) {
    const p = PROJECTS[i];
    if (!p) return;
    modalIndex.textContent = p.index;
    modalDate.textContent = p.date;
    modalTitle.textContent = p.title;
    modalEn.textContent = p.en;
    modalArch.textContent = p.arch;

    modalHighlights.replaceChildren();
    p.highlights.forEach(function (text) {
      const li = document.createElement('li');
      li.textContent = text;
      modalHighlights.appendChild(li);
    });

    modalStack.replaceChildren();
    p.stack.forEach(function (text) {
      const li = document.createElement('li');
      li.textContent = text;
      modalStack.appendChild(li);
    });
    if (p.demo) {
      modalDemoLink.hidden = false;
      modalDemoLink.href = p.demo.href;
      modalDemoLink.innerHTML = p.demo.label + ' <span aria-hidden="true">↗</span>';
    } else {
      modalDemoLink.hidden = true;
      modalDemoLink.removeAttribute('href');
    }
    if (p.demo2) {
      modalDemoLink2.hidden = false;
      modalDemoLink2.href = p.demo2.href;
      modalDemoLink2.innerHTML = p.demo2.label + ' <span aria-hidden="true">↗</span>';
    } else {
      modalDemoLink2.hidden = true;
      modalDemoLink2.removeAttribute('href');
    }
    modalGalleryLink.hidden = false;                               // 6 个项目都有图集组
    modalGalleryLink.setAttribute('data-gallery-jump', String(i));
    modal.querySelector('.modal__panel').scrollTop = 0;
  }

  function openModal(i) {
    if (!PROJECTS[i]) return;
    lastFocused = document.activeElement;
    fillModal(i);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    closeBtn.focus();
  }

  function closeModal(skipFocus) {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    // 跳转到 #demo / #gallery 时不回焦，避免焦点滚动打断锚点定位
    if (!skipFocus && lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  document.querySelectorAll('[data-open]').forEach(function (btn) {
    btn.addEventListener('click', function () { openModal(Number(btn.getAttribute('data-open'))); });
  });

  // 点击示意图也可展开详情
  document.querySelectorAll('.project__visual').forEach(function (visual) {
    const card = visual.closest('[data-project]');
    if (!card) return;
    visual.style.cursor = 'pointer';
    visual.addEventListener('click', function () {
      openModal(Number(card.getAttribute('data-project')));
    });
  });

  modal.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', function () { closeModal(); });
  });
  modalDemoLink.addEventListener('click', function () { closeModal(true); });
  modalDemoLink2.addEventListener('click', function () { closeModal(true); });

  /* ---------- 实机演示视频：四段 2×2 并列，点击后才加载，避免拖慢首屏 ---------- */
  const players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
  players.forEach(function (player) {
    const video = player.querySelector('video');
    const playBtn = player.querySelector('[data-play]');
    if (!video || !playBtn) return;
    playBtn.addEventListener('click', function () {
      // 同一时间只播放一段，避免两段录像同时出声
      players.forEach(function (other) {
        if (other === player) return;
        const ov = other.querySelector('video');
        if (ov && !ov.paused) ov.pause();
      });
      player.classList.add('is-playing');
      video.preload = 'auto';
      try { video.load(); } catch (e) { /* 部分浏览器无需显式 load */ }
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () { player.classList.remove('is-playing'); });
      }
    });
    video.addEventListener('play', function () {
      player.classList.add('is-playing');
      players.forEach(function (other) {
        if (other === player) return;
        const ov = other.querySelector('video');
        if (ov && !ov.paused) ov.pause();
      });
    });
    video.addEventListener('error', function () { player.classList.remove('is-playing'); });
  });

  /* =========================================================
     按项目分组的图片轮播
     每个 .gset 独立维护 index；数据全部来自 slide 的 data-* 属性
     ========================================================= */
  function initSet(root) {
    const slides = Array.prototype.slice.call(root.querySelectorAll('.gslide'));
    const count = slides.length;
    const currentEl = root.querySelector('[data-gset-current]');
    const totalEl = root.querySelector('[data-gset-total]');
    const idxEl = root.querySelector('[data-gset-idx]');
    const titleEl = root.querySelector('[data-gset-title]');
    const descEl = root.querySelector('[data-gset-desc]');
    const dotsEl = root.querySelector('[data-gset-dots]');
    const prevBtn = root.querySelector('[data-gset-prev]');
    const nextBtn = root.querySelector('[data-gset-next]');
    const stage = root.querySelector('.gset__stage');
    let index = 0;

    const dots = [];
    for (let n = 0; n < count; n++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'gset__dot';
      b.setAttribute('aria-label', '跳到第 ' + (n + 1) + ' 张');
      b.addEventListener('click', function () { goTo(n); });
      dotsEl.appendChild(b);
      dots.push(b);
    }

    function render() {
      slides.forEach(function (slide, n) {
        const on = n === index;
        slide.classList.toggle('is-active', on);
        slide.setAttribute('aria-hidden', on ? 'false' : 'true');
        const btn = slide.querySelector('.gslide__view');
        if (btn) btn.tabIndex = on ? 0 : -1;
      });
      dots.forEach(function (d, n) {
        d.classList.toggle('is-active', n === index);
        if (n === index) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
      const s = slides[index];
      currentEl.textContent = pad(index + 1);
      idxEl.textContent = s.getAttribute('data-no') || pad(index + 1);
      titleEl.textContent = s.getAttribute('data-title') || '';
      descEl.textContent = s.getAttribute('data-desc') || '';
    }

    function goTo(n) { index = ((n % count) + count) % count; render(); }
    function step(d) { goTo(index + d); }

    prevBtn.addEventListener('click', function () { step(-1); });
    nextBtn.addEventListener('click', function () { step(1); });

    if (count < 2) {
      root.classList.add('is-single');
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      dotsEl.hidden = true;
    }

    // 键盘左右键（stage 或其内部按钮获得焦点时）
    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    });

    // 触摸滑动（移动端降级体验）
    let touchX = null;
    stage.addEventListener('touchstart', function (e) {
      touchX = e.changedTouches[0].clientX;
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
      touchX = null;
    }, { passive: true });

    totalEl.textContent = pad(count);
    render();

    return {
      root: root, slides: slides, count: count,
      step: step, goTo: goTo,
      current: function () { return slides[index]; },
      getIndex: function () { return index; }
    };
  }

  const sets = Array.prototype.slice.call(document.querySelectorAll('.gset')).map(initSet);

  /* ---------- 项目卡片 / 弹层 → 跳到对应图集组 ---------- */
  document.addEventListener('click', function (e) {
    const a = e.target && e.target.closest ? e.target.closest('[data-gallery-jump]') : null;
    if (!a) return;
    const set = sets[Number(a.getAttribute('data-gallery-jump'))];
    if (!set) return;
    e.preventDefault();
    if (modal.classList.contains('is-open')) closeModal(true);
    set.root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    set.root.classList.add('is-targeted');
    window.setTimeout(function () { set.root.classList.remove('is-targeted'); }, 1800);
  });

  /* =========================================================
     灯箱：复用当前轮播 slide 的原图 URL，不重复下载
     ========================================================= */
  const lightbox = document.getElementById('figureLightbox');
  const lbImage = document.getElementById('lbImage');
  const lbIndex = document.getElementById('lbIndex');
  const lbTitle = document.getElementById('lbTitle');
  const lbNote = document.getElementById('lbNote');
  const lbOpen = document.getElementById('lbOpen');
  const lbClose = lightbox.querySelector('.lightbox__close');
  const lbPrev = lightbox.querySelector('[data-lb-prev]');
  const lbNext = lightbox.querySelector('[data-lb-next]');
  let lbLastFocused = null;
  let lbSet = null;

  function fillLightbox(slide, set) {
    const img = slide.querySelector('img');
    if (!img) return;
    const src = img.currentSrc || img.src;
    lbImage.src = src;
    lbImage.alt = img.alt;
    lbOpen.href = src;
    lbIndex.textContent = slide.getAttribute('data-no') || 'FIG. 01';
    lbTitle.textContent = slide.getAttribute('data-title') || '项目图集';
    lbNote.textContent = (slide.getAttribute('data-note') || '') +
      ' · ' + pad(set.getIndex() + 1) + ' / ' + pad(set.count) + ' · ESC 关闭';
    const single = set.count < 2;
    lbPrev.hidden = single;
    lbNext.hidden = single;
  }

  function openLightbox(btn) {
    const slide = btn.closest('.gslide');
    const root = btn.closest('.gset');
    if (!slide || !root) return;
    const set = sets.filter(function (s) { return s.root === root; })[0];
    if (!set) return;
    lbSet = set;
    lbLastFocused = document.activeElement;
    fillLightbox(slide, set);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    lbImage.removeAttribute('src');
    lbSet = null;
    if (lbLastFocused && typeof lbLastFocused.focus === 'function') lbLastFocused.focus();
  }

  function lbStep(d) {
    if (!lbSet || lbSet.count < 2) return;
    lbSet.step(d);
    fillLightbox(lbSet.current(), lbSet);
  }

  document.querySelectorAll('[data-figure]').forEach(function (btn) {
    btn.addEventListener('click', function () { openLightbox(btn); });
  });
  lightbox.querySelectorAll('[data-lb-close]').forEach(function (el) {
    el.addEventListener('click', closeLightbox);
  });
  lbPrev.addEventListener('click', function () { lbStep(-1); });
  lbNext.addEventListener('click', function () { lbStep(1); });

  /* ---------- 全局键盘：Esc 关闭 / 灯箱内左右翻页 ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); closeLightbox(); return; }
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); lbStep(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); lbStep(1); }
  });
})();
