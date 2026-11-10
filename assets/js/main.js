/* =========================================================
   陈靖明 / Portfolio 2026 — 交互脚本
   原生 JS，无第三方依赖
   ========================================================= */
(function () {
  'use strict';

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
      stack: ['C 语言', 'Keil5', '立创 EDA', '串口调试助手', 'nRF24L01', 'GPIO', 'PWM', 'UART', 'SPI', 'IIC', 'ADC', 'PID']
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
      stack: ['C 语言', 'CubeMX', 'Keil5', '立创 EDA', 'STM32F407', 'FreeRTOS', 'CAN', 'UART', 'SBUS', 'PID', '四层 PCB']
    },
    {
      index: '03 / PROJECT',
      date: '2025.11 — 2026',
      title: 'ROS2 自主导航无人车平台',
      en: 'ROS2 / NAV2 / SLAM · FULL STACK',
      arch: '本项目面向移动机器人平台，分别实现三轮全向轮与两轮差速两种底盘构型。下位机采用 STM32F4，负责实时运动学逆解，将期望速度指令解算为各直流编码电机的转速并驱动电机运转；同时采集编码器反馈，经运动学正解得到实际车体速度，结合 ADC 采样的电池电压以及 MPU6050 姿态数据，通过串口一并上传至中位机（树莓派）。树莓派作为上层决策核心，接收来自远端 PC 的控制指令并向下转发或执行高级任务；PC 端实现仿真环境下的算法验证、SLAM 建图及远程监控，形成「下位机执行—中位机调度—上位机规划」的完整闭环系统。',
      highlights: [
        '两级融合架构：下位机 EKF 融合编码器 + IMU 输出本体里程计；上位机 robot_localization（50Hz EKF）二次融合抗漂移',
        '激光 SLAM 提供 map→odom 全局校正，消除长期累积误差',
        'ROS2 全栈导航：重写全向运动学、slam_toolbox 异步建图、Nav2（NavFn 全局 + DWB 局部）、多层 Costmap',
        '行为树驱动 Spin / BackUp 恢复行为，支持无先验地图动态避障与在线重规划',
        '自研 N10 激光雷达驱动包，完成协议解析与坐标变换，封装为标准 /scan 话题'
      ],
      stack: ['CubeIDE', '立创 EDA', 'C', 'Python', 'ROS2', 'Nav2', 'SLAM', 'EKF', 'slam_toolbox', 'PWM', 'UART', 'IIC']
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
    modalDemoLink.hidden = (i !== 2); // 仅项目 03 有实机演示视频
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
    // 跳转到 #demo 时不回焦，避免焦点滚动打断锚点定位
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
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- 实机演示视频：点击后才加载，避免拖慢首屏 ---------- */
  const player = document.getElementById('demoPlayer');
  const video = document.getElementById('demoVideo');
  const playBtn = document.getElementById('demoPlay');
  if (player && video && playBtn) {
    playBtn.addEventListener('click', function () {
      player.classList.add('is-playing');
      video.preload = 'auto';
      try { video.load(); } catch (e) { /* 部分浏览器无需显式 load */ }
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () { player.classList.remove('is-playing'); });
      }
    });
    video.addEventListener('play', function () { player.classList.add('is-playing'); });
    video.addEventListener('error', function () { player.classList.remove('is-playing'); });
  }
})();
