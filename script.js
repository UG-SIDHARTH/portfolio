document.addEventListener('DOMContentLoaded', () => {
    // Global API URL Redirection Mapping for decoupled frontend/backend deployment
    const API_BASE = (window.location.port === '3500' || window.location.port === '8601') ? '' : 'http://localhost:3500';

    // Ensure page opens at top Hero section (unless hash anchor specified)
    if (!window.location.hash) {
        window.scrollTo(0, 0);
    }

    // Typewriter effect for Hero section
    const typewriterEl = document.getElementById('hero-typewriter');
    if (typewriterEl) {
        const phrases = [
            "IoT & AI/ML Engineer",
            "ESP32 Hardware Specialist",
            "Cameraman & Media Specialist"
        ];
        let pIdx = 0;
        let cIdx = 0;
        let isDeleting = false;

        function typeLoop() {
            const currentPhrase = phrases[pIdx];
            if (isDeleting) {
                typewriterEl.textContent = currentPhrase.substring(0, cIdx - 1);
                cIdx--;
            } else {
                typewriterEl.textContent = currentPhrase.substring(0, cIdx + 1);
                cIdx++;
            }

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && cIdx === currentPhrase.length) {
                typeSpeed = 1800;
                isDeleting = true;
            } else if (isDeleting && cIdx === 0) {
                isDeleting = false;
                pIdx = (pIdx + 1) % phrases.length;
                typeSpeed = 400;
            }

            setTimeout(typeLoop, typeSpeed);
        }
        typeLoop();
    }

    // BIOS Boot Up Simulation sequence
    const bootScreen = document.getElementById('boot-screen');
    const bootLog = document.getElementById('boot-log');
    const bootProgress = document.getElementById('boot-progress');

    const bootMessages = [
        { text: "ALLOCATING PROCESS MEMORY MEM_BASE=0x7FFF...", type: "default" },
        { text: "ESTABLISHING PERSISTENT DATA DRIVERS... OK", type: "success" },
        { text: "CHECKING FRONTEND PORT LISTEN METRICS... PORT_8500", type: "default" },
        { text: "CHECKING SECURE MESSAGE LOG CONNECTIONS... PORT_3500", type: "default" },
        { text: "MOUNTING CYBERPUNK PARTICLE LAYERS... OK", type: "success" },
        { text: "DECRYPTING PORTFOLIO DATA ARTIFACTS...", type: "info" },
        { text: "DECRYPTING GRABSTER / MEDIAHUB MODULES... SUCCESS", type: "success" },
        { text: "DECRYPTING QR LINKTREE & BIO STUDIO MODULES... SUCCESS", type: "success" },
        { text: "DECRYPTING OS DESKTOP INTERFACES... SUCCESS", type: "success" },
        { text: "SYSTEM DIAGNOSTICS: STATUS_OK (0)", type: "success" },
        { text: "BOOT SEQUENCE FINISHED. STARTING GUI CLIENT...", type: "info" }
    ];

    let bootTimeoutId = null;
    let currentMsgIdx = 0;

    function skipBoot() {
        if (!bootScreen || bootScreen.classList.contains('fade-out')) return;

        if (bootTimeoutId) {
            clearTimeout(bootTimeoutId);
            bootTimeoutId = null;
        }

        if (bootProgress) {
            bootProgress.style.width = '100%';
        }

        if (bootLog && currentMsgIdx < bootMessages.length) {
            while (currentMsgIdx < bootMessages.length) {
                const msg = bootMessages[currentMsgIdx];
                const line = document.createElement('div');
                line.className = `boot-terminal-line ${msg.type || ''}`;
                line.textContent = `> ${msg.text}`;
                bootLog.appendChild(line);
                currentMsgIdx++;
            }
            bootLog.scrollTop = bootLog.scrollHeight;
        }

        setTimeout(() => {
            if (bootScreen) bootScreen.classList.add('fade-out');
            setTimeout(() => {
                openApp('profile');
            }, 300);
        }, 150);
    }

    function runBootloader() {
        if (!bootScreen || !bootLog || !bootProgress) return;

        bootScreen.classList.remove('fade-out');
        bootProgress.style.width = '0%';
        bootLog.innerHTML = '';
        currentMsgIdx = 0;

        if (bootTimeoutId) {
            clearTimeout(bootTimeoutId);
        }

        function logNextLine() {
            if (currentMsgIdx < bootMessages.length) {
                const msg = bootMessages[currentMsgIdx];
                const line = document.createElement('div');
                line.className = `boot-terminal-line ${msg.type || ''}`;
                line.textContent = `> ${msg.text}`;
                bootLog.appendChild(line);
                bootLog.scrollTop = bootLog.scrollHeight;

                currentMsgIdx++;
                const progressVal = Math.floor((currentMsgIdx / bootMessages.length) * 100);
                bootProgress.style.width = `${progressVal}%`;

                const delay = Math.random() * 140 + 80;
                bootTimeoutId = setTimeout(logNextLine, delay);
            } else {
                bootTimeoutId = setTimeout(() => {
                    bootScreen.classList.add('fade-out');
                    setTimeout(() => {
                        openApp('profile');
                    }, 500);
                }, 500);
            }
        }

        bootTimeoutId = setTimeout(logNextLine, 200);
    }

    if (bootScreen) {
        bootScreen.addEventListener('click', skipBoot);
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                skipBoot();
            }
        });
    }

    // Global Window Z-Index Tracker
    let activeZIndex = 100;

    // 1. Interactive Clock & Telemetry stats
    const clockEl = document.getElementById('tray-clock');
    const statsEl = document.getElementById('tray-stats');

    function updateClock() {
        const now = new Date();
        if (clockEl) {
            clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
    }
    
    function updateTelemetry() {
        if (statsEl) {
            const cpu = (Math.random() * 2 + 1).toFixed(1);
            statsEl.textContent = `CPU: ${cpu}% | ONLINE`;
        }
    }

    setInterval(updateClock, 1000);
    setInterval(updateTelemetry, 4000);
    updateClock();
    updateTelemetry();

    // 2. Desktop Window Manager
    const windows = document.querySelectorAll('.window');
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    const dockItems = document.querySelectorAll('.dock-item[data-app]');
    const startItems = document.querySelectorAll('.start-shortcut-item[data-app]');

    // Bring window to focus front
    function focusWindow(windowEl) {
        // Remove focus class from all windows
        windows.forEach(w => w.classList.remove('focused-window'));
        
        // Bring to front
        activeZIndex++;
        windowEl.style.zIndex = activeZIndex;
        windowEl.classList.add('focused-window');
        windowEl.classList.add('active-window');
        windowEl.classList.remove('minimized');
        
        // Mark dock app icon active dot
        const appId = windowEl.getAttribute('data-window');
        const dockBtn = document.querySelector(`.dock-item[data-app="${appId}"]`);
        if (dockBtn) {
            dockBtn.classList.add('app-open');
        }
    }

    // Close window
    function closeWindow(windowEl) {
        windowEl.classList.remove('active-window');
        windowEl.classList.remove('focused-window');
        
        // Remove dot from dock
        const appId = windowEl.getAttribute('data-window');
        const dockBtn = document.querySelector(`.dock-item[data-app="${appId}"]`);
        if (dockBtn) {
            dockBtn.classList.remove('app-open');
        }
    }

    // Toggle minimize
    function minimizeWindow(windowEl) {
        windowEl.classList.add('minimized');
        windowEl.classList.remove('focused-window');
    }

    // Toggle maximize
    function toggleMaximizeWindow(windowEl) {
        windowEl.classList.toggle('maximized');
    }

    // Setup window controls
    windows.forEach(win => {
        // Focus on click
        win.addEventListener('mousedown', () => {
            focusWindow(win);
        });

        // Controls action
        const closeBtn = win.querySelector('.close-btn');
        const minBtn = win.querySelector('.minimize-btn');
        const maxBtn = win.querySelector('.maximize-btn');

        if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeWindow(win); });
        if (minBtn) minBtn.addEventListener('click', (e) => { e.stopPropagation(); minimizeWindow(win); });
        if (maxBtn) maxBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMaximizeWindow(win); });
    });

    // Launch Application
    function openApp(appId) {
        if (appId === 'game' || appId === 'fight') {
            startFullWebsiteGame();
            return;
        }
        const targetWin = document.getElementById(`window-${appId}`);
        if (targetWin) {
            focusWindow(targetWin);
            if (appId === 'browser') {
                initBrowserApp();
            }
        }
    }

    // Double-click desktop icons to open apps (supporting single click for mobile)
    desktopIcons.forEach(icon => {
        const appId = icon.getAttribute('data-app');
        icon.addEventListener('dblclick', () => openApp(appId));
        
        // Mobile tap/single click fallback
        let lastTap = 0;
        icon.addEventListener('click', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 300 && tapLength > 0) {
                openApp(appId);
            } else if (window.innerWidth <= 768) {
                // Direct launch on mobile
                openApp(appId);
            }
            lastTap = currentTime;
        });
    });

    // Dock shortcuts toggle
    dockItems.forEach(item => {
        const appId = item.getAttribute('data-app');
        item.addEventListener('click', () => {
            const targetWin = document.getElementById(`window-${appId}`);
            if (targetWin) {
                if (targetWin.classList.contains('active-window') && !targetWin.classList.contains('minimized') && targetWin.classList.contains('focused-window')) {
                    // If open and focused, minimize it
                    minimizeWindow(targetWin);
                } else {
                    // Else open it/restore it
                    focusWindow(targetWin);
                }
            }
        });
    });

    // Start Menu shortcuts toggle
    startItems.forEach(item => {
        const appId = item.getAttribute('data-app');
        item.addEventListener('click', () => {
            openApp(appId);
            toggleStartMenu(false);
        });
    });

    // 3. Draggable Title Bar Script
    windows.forEach(win => {
        const header = win.querySelector('.window-header');
        if (!header) return;

        let isDragging = false;
        let startX, startY, origX, origY;

        header.addEventListener('mousedown', (e) => {
            if (win.classList.contains('maximized')) return; // No dragging in full screen
            
            isDragging = true;
            win.style.transition = 'none'; // Disable animations while dragging
            
            // Get coordinates
            startX = e.clientX;
            startY = e.clientY;
            origX = win.offsetLeft;
            origY = win.offsetTop;
            
            focusWindow(win);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // Touch support
        header.addEventListener('touchstart', (e) => {
            if (win.classList.contains('maximized')) return;
            isDragging = true;
            win.style.transition = 'none';
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            origX = win.offsetLeft;
            origY = win.offsetTop;
            focusWindow(win);
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd);
        }, { passive: true });

        function onMouseMove(e) {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            // Constrain within desktop boundaries
            let newX = origX + dx;
            let newY = Math.max(0, origY + dy); // Don't drag above menu boundary
            
            win.style.left = `${newX}px`;
            win.style.top = `${newY}px`;
        }

        function onTouchMove(e) {
            if (!isDragging) return;
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            let newX = origX + dx;
            let newY = Math.max(0, origY + dy);
            win.style.left = `${newX}px`;
            win.style.top = `${newY}px`;
        }

        function onMouseUp() {
            isDragging = false;
            win.style.transition = ''; // Restore transitions
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        function onTouchEnd() {
            isDragging = false;
            win.style.transition = '';
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        }
    });

    // 4. Start Menu Popover Toggle
    const startBtn = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu');

    function toggleStartMenu(forceState) {
        if (startMenu) {
            const isOpen = forceState !== undefined ? forceState : !startMenu.classList.contains('open');
            if (isOpen) {
                startMenu.classList.add('open');
            } else {
                startMenu.classList.remove('open');
            }
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleStartMenu();
        });
    }

    // Close start menu when clicking outside
    document.addEventListener('click', (e) => {
        if (startMenu && !startMenu.contains(e.target) && e.target !== startBtn && !startBtn.contains(e.target)) {
            toggleStartMenu(false);
        }
    });

    // Start Menu Actions
    const rebootBtn = document.getElementById('sys-reboot');
    if (rebootBtn) {
        rebootBtn.addEventListener('click', () => {
            toggleStartMenu(false);
            showToast("Rebooting OS...", "info");
            
            // Close all windows
            windows.forEach(win => {
                closeWindow(win);
            });
            
            // Trigger boot loader sequence
            runBootloader();
            
            // Reinitialize wallpaper canvas particles
            if (window.initParticles) {
                window.initParticles();
            }
        });
    }

    // 5. Skills Tab Interactivity
    const tabBtns = document.querySelectorAll('.skill-tab-btn');
    const skillItems = document.querySelectorAll('.skill-os-item');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-tab');

            skillItems.forEach(item => {
                const cat = item.getAttribute('data-category');
                if (filter === 'all' || cat === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 6. Interactive Command Terminal logic
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value.trim().toLowerCase();
                processTerminalCommand(cmd);
                terminalInput.value = '';
            }
        });
    }

    function appendTermLine(htmlContent) {
        if (terminalOutput) {
            const line = document.createElement('div');
            line.innerHTML = htmlContent;
            terminalOutput.appendChild(line);
            
            // Auto scroll to bottom
            const winBody = terminalOutput.closest('.window-body');
            if (winBody) {
                winBody.scrollTop = winBody.scrollHeight;
            }
        }
    }

    function triggerResumeDownload() {
        appendTermLine(`<div>Initiating download for <span class="term-highlight">Sidharth_Resume.pdf</span>...</div>`);
        const link = document.createElement('a');
        link.href = 'Sidharth_Resume.pdf';
        link.download = 'Sidharth_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Downloading Resume PDF...", "success");
    }

    // ==========================================================================
    // Light Theme System Logic
    // ==========================================================================
    const savedTheme = localStorage.getItem('theme') || 'dark';

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const iconEl = document.getElementById('tray-theme-icon');
        if (iconEl) {
            iconEl.textContent = theme === 'light' ? '☀️' : '🌙';
        }
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const nextTheme = current === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
        showToast(`Switched to ${nextTheme.toUpperCase()} theme`, 'info');
    }

    setTheme(savedTheme);

    const themeToggleBtn = document.getElementById('tray-theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // ==========================================================================
    // In-Terminal Canvas Easter Egg Space Shooter Game Engine
    // ==========================================================================
    const termGameContainer = document.getElementById('terminal-game-container');
    const termGameCanvas = document.getElementById('terminal-game-canvas');
    const termScoreVal = document.getElementById('term-game-score');
    const termWaveVal = document.getElementById('term-game-wave');
    const termLivesVal = document.getElementById('term-game-lives');

    let termCtx = termGameCanvas ? termGameCanvas.getContext('2d') : null;
    let termGameRunning = false;
    let termGameAnimId = null;

    let termPlayer = { x: 300, y: 270, width: 28, height: 18, speed: 7 };
    let termLasers = [];
    let termEnemies = [];
    let termParticles = [];
    let termScore = 0;
    let termWave = 1;
    let termLives = 3;
    let termKeys = {};
    let termLastFire = 0;

    function initTerminalGameCanvas() {
        if (!termGameCanvas || !termGameContainer) return;
        termGameCanvas.width = termGameContainer.clientWidth || 650;
        termGameCanvas.height = Math.max(260, (termGameContainer.clientHeight || 360) - 32);
        termPlayer.y = termGameCanvas.height - 30;
        termPlayer.x = termGameCanvas.width / 2 - termPlayer.width / 2;
    }

    function startTerminalGame() {
        if (!termGameContainer || !termGameCanvas) return;

        termGameRunning = true;
        termScore = 0;
        termWave = 1;
        termLives = 3;
        termLasers = [];
        termEnemies = [];
        termParticles = [];
        termKeys = {};

        if (termScoreVal) termScoreVal.textContent = termScore;
        if (termWaveVal) termWaveVal.textContent = termWave;
        if (termLivesVal) termLivesVal.textContent = '❤️❤️❤️';

        termGameContainer.style.display = 'flex';
        initTerminalGameCanvas();
        spawnEnemyWave(termWave);

        if (termGameAnimId) cancelAnimationFrame(termGameAnimId);
        termGameAnimId = requestAnimationFrame(updateTerminalGameLoop);

        showToast("Terminal Game Launched! WASD/Mouse to move, Space/Click to fire", "success");
    }

    function exitTerminalGame() {
        if (!termGameRunning) return;
        termGameRunning = false;
        if (termGameAnimId) {
            cancelAnimationFrame(termGameAnimId);
            termGameAnimId = null;
        }
        if (termGameContainer) {
            termGameContainer.style.display = 'none';
        }
        appendTermLine(`<div>[<span class="term-highlight">Terminal Space Invaders</span> closed. Returned to shell]</div>`);
        if (terminalInput) terminalInput.focus();
    }

    function spawnEnemyWave(wave) {
        termEnemies = [];
        const rows = Math.min(5, 2 + Math.floor(wave / 2));
        const cols = Math.min(10, 5 + wave);
        const startX = 35;
        const startY = 30;
        const spacingX = Math.min(48, (termGameCanvas.width - 70) / cols);
        const spacingY = 26;

        const colors = ['#ff5f56', '#00f2fe', '#ffbd2e', '#7f00ff', '#27c93f'];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                termEnemies.push({
                    x: startX + c * spacingX,
                    y: startY + r * spacingY,
                    width: 22,
                    height: 16,
                    color: colors[r % colors.length],
                    vx: (1 + wave * 0.25),
                    row: r
                });
            }
        }
    }

    function fireTerminalLaser() {
        const now = Date.now();
        if (now - termLastFire < 180) return;
        termLastFire = now;
        termLasers.push({
            x: termPlayer.x + termPlayer.width / 2 - 2,
            y: termPlayer.y,
            width: 4,
            height: 12,
            vy: 7
        });
    }

    function createTermExplosion(x, y, color) {
        for (let i = 0; i < 8; i++) {
            termParticles.push({
                x, y,
                vx: (Math.random() - 0.5) * 4.5,
                vy: (Math.random() - 0.5) * 4.5,
                life: 22,
                color: color || '#00f2fe'
            });
        }
    }

    function updateTerminalGameLoop() {
        if (!termGameRunning || !termCtx || !termGameCanvas) return;

        termCtx.fillStyle = '#07090e';
        termCtx.fillRect(0, 0, termGameCanvas.width, termGameCanvas.height);

        termCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = 0; i < 20; i++) {
            const rx = (Math.sin(Date.now() * 0.001 + i * 17) * 0.5 + 0.5) * termGameCanvas.width;
            const ry = (Math.cos(Date.now() * 0.0008 + i * 13) * 0.5 + 0.5) * termGameCanvas.height;
            termCtx.fillRect(rx, ry, 1.5, 1.5);
        }

        if (termKeys['ArrowLeft'] || termKeys['a'] || termKeys['A']) {
            termPlayer.x = Math.max(0, termPlayer.x - termPlayer.speed);
        }
        if (termKeys['ArrowRight'] || termKeys['d'] || termKeys['D']) {
            termPlayer.x = Math.min(termGameCanvas.width - termPlayer.width, termPlayer.x + termPlayer.speed);
        }

        termCtx.shadowBlur = 10;
        termCtx.shadowColor = '#00f2fe';
        termCtx.fillStyle = '#00f2fe';
        termCtx.beginPath();
        termCtx.moveTo(termPlayer.x + termPlayer.width / 2, termPlayer.y);
        termCtx.lineTo(termPlayer.x, termPlayer.y + termPlayer.height);
        termCtx.lineTo(termPlayer.x + termPlayer.width / 2, termPlayer.y + termPlayer.height - 4);
        termCtx.lineTo(termPlayer.x + termPlayer.width, termPlayer.y + termPlayer.height);
        termCtx.closePath();
        termCtx.fill();

        termCtx.fillStyle = '#00f2fe';
        for (let i = termLasers.length - 1; i >= 0; i--) {
            termLasers[i].y -= termLasers[i].vy;
            termCtx.fillRect(termLasers[i].x, termLasers[i].y, termLasers[i].width, termLasers[i].height);

            if (termLasers[i].y < -10) {
                termLasers.splice(i, 1);
            }
        }

        let hitEdge = false;
        termEnemies.forEach(e => {
            e.x += e.vx;
            if (e.x <= 10 || e.x + e.width >= termGameCanvas.width - 10) {
                hitEdge = true;
            }
        });

        if (hitEdge) {
            termEnemies.forEach(e => {
                e.vx = -e.vx;
                e.y += 12;
            });
        }

        const initialEnemyCount = termEnemies.length;

        for (let i = termEnemies.length - 1; i >= 0; i--) {
            const enemy = termEnemies[i];

            termCtx.shadowBlur = 8;
            termCtx.shadowColor = enemy.color;
            termCtx.fillStyle = enemy.color;

            termCtx.fillRect(enemy.x, enemy.y + 4, enemy.width, enemy.height - 8);
            termCtx.fillRect(enemy.x + 4, enemy.y, enemy.width - 8, enemy.height);

            termCtx.fillStyle = '#000';
            termCtx.fillRect(enemy.x + 5, enemy.y + 5, 3, 3);
            termCtx.fillRect(enemy.x + enemy.width - 8, enemy.y + 5, 3, 3);

            for (let j = termLasers.length - 1; j >= 0; j--) {
                const l = termLasers[j];
                if (l.x >= enemy.x && l.x <= enemy.x + enemy.width &&
                    l.y >= enemy.y && l.y <= enemy.y + enemy.height) {

                    createTermExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color);
                    termEnemies.splice(i, 1);
                    termLasers.splice(j, 1);

                    termScore += 10 * termWave;
                    if (termScoreVal) termScoreVal.textContent = termScore;
                    break;
                }
            }

            if (enemy) {
                const hitsPlayer = (
                    enemy.x + enemy.width >= termPlayer.x &&
                    enemy.x <= termPlayer.x + termPlayer.width &&
                    enemy.y + enemy.height >= termPlayer.y &&
                    enemy.y <= termPlayer.y + termPlayer.height
                );

                if (enemy.y + enemy.height >= termGameCanvas.height - 10 || hitsPlayer) {
                    termLives--;
                    updateTermLivesDisplay();
                    createTermExplosion(termPlayer.x + termPlayer.width / 2, termPlayer.y + termPlayer.height / 2, '#ff5f56');

                    if (termLives <= 0) {
                        endTerminalGame();
                        return;
                    } else {
                        spawnEnemyWave(termWave);
                        break;
                    }
                }
            }
        }

        if (initialEnemyCount > 0 && termEnemies.length === 0) {
            termWave++;
            if (termWaveVal) termWaveVal.textContent = termWave;
            showToast(`WAVE ${termWave} ENGAGED!`, 'success');
            spawnEnemyWave(termWave);
        }

        for (let i = termParticles.length - 1; i >= 0; i--) {
            const p = termParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            termCtx.shadowColor = p.color;
            termCtx.fillStyle = p.color;
            termCtx.fillRect(p.x, p.y, 2.5, 2.5);

            if (p.life <= 0) {
                termParticles.splice(i, 1);
            }
        }

        termCtx.shadowBlur = 0;
        termGameAnimId = requestAnimationFrame(updateTerminalGameLoop);
    }

    function updateTermLivesDisplay() {
        if (!termLivesVal) return;
        if (termLives === 3) termLivesVal.textContent = '❤️❤️❤️';
        else if (termLives === 2) termLivesVal.textContent = '❤️❤️';
        else if (termLives === 1) termLivesVal.textContent = '❤️';
        else termLivesVal.textContent = '💀';
    }

    function endTerminalGame() {
        termGameRunning = false;
        if (termCtx && termGameCanvas) {
            termCtx.fillStyle = 'rgba(7, 9, 14, 0.9)';
            termCtx.fillRect(0, 0, termGameCanvas.width, termGameCanvas.height);
            termCtx.font = 'bold 22px "Space Grotesk", sans-serif';
            termCtx.fillStyle = '#ff5f56';
            termCtx.textAlign = 'center';
            termCtx.fillText('GAME OVER', termGameCanvas.width / 2, termGameCanvas.height / 2 - 15);
            termCtx.font = '13px "Fira Code", monospace';
            termCtx.fillStyle = '#00f2fe';
            termCtx.fillText(`FINAL SCORE: ${termScore} | WAVE REACHED: ${termWave}`, termGameCanvas.width / 2, termGameCanvas.height / 2 + 15);
            termCtx.fillStyle = '#94a3b8';
            termCtx.fillText("Press [ESC] or type 'quit' to return to terminal", termGameCanvas.width / 2, termGameCanvas.height / 2 + 45);
        }
    }

    if (termGameCanvas) {
        termGameCanvas.addEventListener('mousemove', (e) => {
            if (!termGameRunning) return;
            const rect = termGameCanvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            termPlayer.x = Math.max(0, Math.min(termGameCanvas.width - termPlayer.width, mouseX - termPlayer.width / 2));
        });

        termGameCanvas.addEventListener('mousedown', () => {
            if (termGameRunning) fireTerminalLaser();
        });
    }

    window.addEventListener('keydown', (e) => {
        const termWin = document.getElementById('window-terminal');
        const termActive = termWin && termWin.classList.contains('focused-window');

        if (termGameRunning) {
            if (e.key === 'Escape') {
                exitTerminalGame();
                return;
            }
            if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D', ' '].includes(e.key)) {
                if (termActive) e.preventDefault();
                termKeys[e.key] = true;
                if (e.key === ' ') fireTerminalLaser();
            }
        }
    });

    // ==========================================================================
    // Immersive Dark Terminal Mode Logic
    // ==========================================================================
    const termWin = document.getElementById('window-terminal');
    const termImmersiveBtn = document.getElementById('terminal-immersive-btn');

    function toggleTerminalImmersive(forceState) {
        if (!termWin) return;
        const isImmersive = forceState !== undefined ? forceState : !termWin.classList.contains('immersive-terminal');
        
        if (isImmersive) {
            termWin.classList.add('immersive-terminal');
            showToast('Immersive Dark CRT Terminal Mode Engaged 📺', 'info');
        } else {
            termWin.classList.remove('immersive-terminal');
            showToast('Returned to Windowed Terminal Mode', 'info');
        }
    }

    if (termImmersiveBtn) {
        termImmersiveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTerminalImmersive();
        });
    }

    // ==========================================================================
    // Full-Viewport Canvas Space Invaders Game Engine + Synthesized Web Audio SFX
    // ==========================================================================
    const fullOverlay = document.getElementById('full-game-overlay');
    const fullCanvas = document.getElementById('full-game-canvas');
    const fullScoreVal = document.getElementById('full-game-score');
    const fullWaveVal = document.getElementById('full-game-wave');
    const fullHighscoreVal = document.getElementById('full-game-highscore');
    const fullLivesVal = document.getElementById('full-game-lives');
    const fullExitBtn = document.getElementById('full-game-exit-btn');

    let fullCtx = fullCanvas ? fullCanvas.getContext('2d') : null;
    let fullGameRunning = false;
    let fullGameAnimId = null;

    let fullPlayer = { x: 500, y: 600, width: 36, height: 22, speed: 9 };
    let fullLasers = [];
    let fullEnemies = [];
    let fullParticles = [];
    let fullScore = 0;
    let fullWave = 1;
    let fullLives = 3;
    let fullHighscore = localStorage.getItem('full_game_highscore') || 0;
    let fullKeys = {};
    let fullLastFire = 0;

    if (fullHighscoreVal) fullHighscoreVal.textContent = fullHighscore;

    // Web Audio API Retro Sound Effects Generator (Zero external dependencies)
    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playLaserSFX() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.12);
        } catch(e) {}
    }

    function playExplosionSFX() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const bufferSize = ctx.sampleRate * 0.18;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
            noise.connect(gain);
            gain.connect(ctx.destination);
            noise.start();
        } catch(e) {}
    }

    function resizeFullCanvas() {
        if (!fullCanvas) return;
        fullCanvas.width = window.innerWidth;
        fullCanvas.height = window.innerHeight - 60;
        fullPlayer.y = fullCanvas.height - 40;
    }

    function startFullWebsiteGame() {
        if (!fullOverlay || !fullCanvas) {
            console.error("Space Shooter Canvas elements not found.");
            return;
        }

        fullGameRunning = true;
        fullScore = 0;
        fullWave = 1;
        fullLives = 3;
        fullLasers = [];
        fullEnemies = [];
        fullParticles = [];
        fullKeys = {};

        if (fullScoreVal) fullScoreVal.textContent = fullScore;
        if (fullWaveVal) fullWaveVal.textContent = fullWave;
        if (fullLivesVal) fullLivesVal.textContent = '❤️❤️❤️';
        if (fullHighscoreVal) fullHighscoreVal.textContent = fullHighscore;

        fullOverlay.style.display = 'flex';
        resizeFullCanvas();
        fullPlayer.x = fullCanvas.width / 2 - fullPlayer.width / 2;

        spawnFullEnemyWave(fullWave);

        if (fullGameAnimId) cancelAnimationFrame(fullGameAnimId);
        fullGameAnimId = requestAnimationFrame(updateFullGameLoop);

        showToast("Full-Screen Space Invaders Launched! [ESC] to Exit", "success");
    }

    // Expose globally so desktop icons, dock, and terminal can invoke it cleanly
    window.startFullWebsiteGame = startFullWebsiteGame;

    function exitFullWebsiteGame() {
        if (!fullGameRunning) return;
        fullGameRunning = false;
        if (fullGameAnimId) {
            cancelAnimationFrame(fullGameAnimId);
            fullGameAnimId = null;
        }
        if (fullOverlay) {
            fullOverlay.style.display = 'none';
        }
        appendTermLine(`<div>[<span class="term-highlight">Full-Website Space Invaders</span> closed. Returned to desktop]</div>`);
        if (terminalInput) terminalInput.focus();
    }
    window.exitFullWebsiteGame = exitFullWebsiteGame;

    function spawnFullEnemyWave(wave) {
        fullEnemies = [];
        const rows = Math.min(6, 3 + Math.floor(wave / 2));
        const cols = Math.min(14, 7 + wave);
        const startX = 60;
        const startY = 40;
        const spacingX = Math.min(70, (fullCanvas.width - 120) / cols);
        const spacingY = 36;

        const colors = ['#ff5f56', '#00f2fe', '#ffbd2e', '#7f00ff', '#27c93f', '#e11d48'];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                fullEnemies.push({
                    x: startX + c * spacingX,
                    y: startY + r * spacingY,
                    width: 32,
                    height: 22,
                    color: colors[r % colors.length],
                    vx: (1.5 + wave * 0.3),
                    row: r
                });
            }
        }
    }

    function fireFullLaser() {
        const now = Date.now();
        if (now - fullLastFire < 150) return;
        fullLastFire = now;
        playLaserSFX();
        fullLasers.push({
            x: fullPlayer.x + fullPlayer.width / 2 - 2,
            y: fullPlayer.y,
            width: 5,
            height: 15,
            vy: 10
        });
    }

    function createFullExplosion(x, y, color) {
        playExplosionSFX();
        for (let i = 0; i < 14; i++) {
            fullParticles.push({
                x, y,
                vx: (Math.random() - 0.5) * 7,
                vy: (Math.random() - 0.5) * 7,
                life: 30,
                color: color || '#00f2fe'
            });
        }
    }

    function updateFullGameLoop() {
        if (!fullGameRunning || !fullCtx || !fullCanvas) return;

        // Dark Canvas Background with Starfield
        fullCtx.fillStyle = 'rgba(5, 7, 12, 0.95)';
        fullCtx.fillRect(0, 0, fullCanvas.width, fullCanvas.height);

        // Starfield Particles
        fullCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 40; i++) {
            const rx = (Math.sin(Date.now() * 0.0008 + i * 19) * 0.5 + 0.5) * fullCanvas.width;
            const ry = (Math.cos(Date.now() * 0.0006 + i * 11) * 0.5 + 0.5) * fullCanvas.height;
            fullCtx.fillRect(rx, ry, 2, 2);
        }

        // Keyboard Movement
        if (fullKeys['ArrowLeft'] || fullKeys['a'] || fullKeys['A']) {
            fullPlayer.x = Math.max(0, fullPlayer.x - fullPlayer.speed);
        }
        if (fullKeys['ArrowRight'] || fullKeys['d'] || fullKeys['D']) {
            fullPlayer.x = Math.min(fullCanvas.width - fullPlayer.width, fullPlayer.x + fullPlayer.speed);
        }

        // Draw Player Ship (Glowing Neon Cyan Spaceship)
        fullCtx.shadowBlur = 15;
        fullCtx.shadowColor = '#00f2fe';
        fullCtx.fillStyle = '#00f2fe';
        fullCtx.beginPath();
        fullCtx.moveTo(fullPlayer.x + fullPlayer.width / 2, fullPlayer.y);
        fullCtx.lineTo(fullPlayer.x, fullPlayer.y + fullPlayer.height);
        fullCtx.lineTo(fullPlayer.x + fullPlayer.width / 2, fullPlayer.y + fullPlayer.height - 5);
        fullCtx.lineTo(fullPlayer.x + fullPlayer.width, fullPlayer.y + fullPlayer.height);
        fullCtx.closePath();
        fullCtx.fill();

        // Draw Lasers
        fullCtx.fillStyle = '#00f2fe';
        for (let i = fullLasers.length - 1; i >= 0; i--) {
            fullLasers[i].y -= fullLasers[i].vy;
            fullCtx.fillRect(fullLasers[i].x, fullLasers[i].y, fullLasers[i].width, fullLasers[i].height);

            if (fullLasers[i].y < -20) {
                fullLasers.splice(i, 1);
            }
        }

        // Move & Draw Invaders
        let hitEdge = false;
        fullEnemies.forEach(e => {
            e.x += e.vx;
            if (e.x <= 15 || e.x + e.width >= fullCanvas.width - 15) {
                hitEdge = true;
            }
        });

        if (hitEdge) {
            fullEnemies.forEach(e => {
                e.vx = -e.vx;
                e.y += 16;
            });
        }

        const initialEnemyCount = fullEnemies.length;

        for (let i = fullEnemies.length - 1; i >= 0; i--) {
            const enemy = fullEnemies[i];
            if (!enemy) continue;

            fullCtx.shadowBlur = 10;
            fullCtx.shadowColor = enemy.color;
            fullCtx.fillStyle = enemy.color;

            fullCtx.fillRect(enemy.x, enemy.y + 5, enemy.width, enemy.height - 10);
            fullCtx.fillRect(enemy.x + 5, enemy.y, enemy.width - 10, enemy.height);

            // Eye details
            fullCtx.fillStyle = '#000';
            fullCtx.fillRect(enemy.x + 7, enemy.y + 6, 4, 4);
            fullCtx.fillRect(enemy.x + enemy.width - 11, enemy.y + 6, 4, 4);

            // Laser collision
            for (let j = fullLasers.length - 1; j >= 0; j--) {
                const l = fullLasers[j];
                if (l.x >= enemy.x && l.x <= enemy.x + enemy.width &&
                    l.y >= enemy.y && l.y <= enemy.y + enemy.height) {

                    createFullExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color);
                    fullEnemies.splice(i, 1);
                    fullLasers.splice(j, 1);

                    fullScore += 10 * fullWave;
                    if (fullScoreVal) fullScoreVal.textContent = fullScore;

                    if (fullScore > fullHighscore) {
                        fullHighscore = fullScore;
                        localStorage.setItem('full_game_highscore', fullHighscore);
                        if (fullHighscoreVal) fullHighscoreVal.textContent = fullHighscore;
                    }
                    break;
                }
            }

            // Enemy collision with bottom or player
            if (enemy) {
                const hitsPlayer = (
                    enemy.x + enemy.width >= fullPlayer.x &&
                    enemy.x <= fullPlayer.x + fullPlayer.width &&
                    enemy.y + enemy.height >= fullPlayer.y &&
                    enemy.y <= fullPlayer.y + fullPlayer.height
                );

                if (enemy.y + enemy.height >= fullCanvas.height - 10 || hitsPlayer) {
                    fullLives--;
                    updateFullLivesDisplay();
                    createFullExplosion(fullPlayer.x + fullPlayer.width / 2, fullPlayer.y + fullPlayer.height / 2, '#ff5f56');
                    fullEnemies.splice(i, 1);

                    if (fullLives <= 0) {
                        endFullWebsiteGame();
                        return;
                    }
                }
            }
        }

        // Wave Completion Check
        if (initialEnemyCount > 0 && fullEnemies.length === 0) {
            fullWave++;
            if (fullWaveVal) fullWaveVal.textContent = fullWave;
            showToast(`WAVE ${fullWave} ENGAGED! Enemies Speed Boosted!`, 'success');
            spawnFullEnemyWave(fullWave);
        }

        // Particles
        for (let i = fullParticles.length - 1; i >= 0; i--) {
            const p = fullParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            fullCtx.shadowColor = p.color;
            fullCtx.fillStyle = p.color;
            fullCtx.fillRect(p.x, p.y, 3, 3);

            if (p.life <= 0) {
                fullParticles.splice(i, 1);
            }
        }

        fullCtx.shadowBlur = 0;
        fullGameAnimId = requestAnimationFrame(updateFullGameLoop);
    }

    function updateFullLivesDisplay() {
        if (!fullLivesVal) return;
        if (fullLives === 3) fullLivesVal.textContent = '❤️❤️❤️';
        else if (fullLives === 2) fullLivesVal.textContent = '❤️❤️';
        else if (fullLives === 1) fullLivesVal.textContent = '❤️';
        else fullLivesVal.textContent = '💀';
    }

    function endFullWebsiteGame() {
        fullGameRunning = false;
        if (fullCtx && fullCanvas) {
            fullCtx.fillStyle = 'rgba(5, 7, 12, 0.92)';
            fullCtx.fillRect(0, 0, fullCanvas.width, fullCanvas.height);
            fullCtx.font = 'bold 36px "Space Grotesk", sans-serif';
            fullCtx.fillStyle = '#ff5f56';
            fullCtx.textAlign = 'center';
            fullCtx.fillText('GAME OVER', fullCanvas.width / 2, fullCanvas.height / 2 - 20);
            fullCtx.font = '16px "Fira Code", monospace';
            fullCtx.fillStyle = '#00f2fe';
            fullCtx.fillText(`FINAL SCORE: ${fullScore} | WAVE REACHED: ${fullWave}`, fullCanvas.width / 2, fullCanvas.height / 2 + 25);
            fullCtx.fillStyle = '#94a3b8';
            fullCtx.fillText("Press [ESC] or click EXIT GAME to return to desktop", fullCanvas.width / 2, fullCanvas.height / 2 + 65);
        }
    }

    if (fullCanvas) {
        fullCanvas.addEventListener('mousemove', (e) => {
            if (!fullGameRunning) return;
            const rect = fullCanvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            fullPlayer.x = Math.max(0, Math.min(fullCanvas.width - fullPlayer.width, mouseX - fullPlayer.width / 2));
        });

        fullCanvas.addEventListener('mousedown', () => {
            if (fullGameRunning) fireFullLaser();
        });
    }

    if (fullExitBtn) {
        fullExitBtn.addEventListener('click', exitFullWebsiteGame);
    }

    window.addEventListener('keydown', (e) => {
        if (fullGameRunning) {
            if (e.key === 'Escape') {
                exitFullWebsiteGame();
                return;
            }
            if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D', ' '].includes(e.key)) {
                e.preventDefault();
                fullKeys[e.key] = true;
                if (e.key === ' ') fireFullLaser();
            }
        }
    });

    // Global Site-Wide Secret Easter Egg Sequence Listener (Type 'game' anywhere on the website!)
    let secretKeyBuffer = '';
    window.addEventListener('keydown', (e) => {
        if (fullGameRunning) return;

        // Skip if user is actively typing inside an input field or textarea
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag === 'input' || activeTag === 'textarea') return;

        if (e.key && e.key.length === 1) {
            secretKeyBuffer = (secretKeyBuffer + e.key.toLowerCase()).slice(-10);

            if (secretKeyBuffer.endsWith('game') || secretKeyBuffer.endsWith('invader') || secretKeyBuffer.endsWith('space')) {
                secretKeyBuffer = '';
                startFullWebsiteGame();
            } else if (secretKeyBuffer.endsWith('theme')) {
                secretKeyBuffer = '';
                toggleTheme();
            } else if (secretKeyBuffer.endsWith('snake')) {
                secretKeyBuffer = '';
                openApp('snake');
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        if (fullGameRunning) {
            fullKeys[e.key] = false;
        }
    });

    window.addEventListener('resize', () => {
        if (fullGameRunning) resizeFullCanvas();
    });

    function processTerminalCommand(cmd) {
        // Output prompt echo
        appendTermLine(`<span class="terminal-prompt">visitor@os:~$</span> ${cmd}`);

        const trimmedCmd = cmd.trim();
        if (trimmedCmd === '') return;

        const cmdLower = trimmedCmd.toLowerCase();
        if (cmdLower === 'download resume' || cmdLower === 'get resume') {
            triggerResumeDownload();
            return;
        }

        const parts = trimmedCmd.split(/\s+/);
        const baseCmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (baseCmd) {
            case 'help':
                appendTermLine(`
                    <div>Available Commands:</div>
                    <div>- <span class="term-highlight">about</span>: Details on who I am</div>
                    <div>- <span class="term-highlight">skills</span>: Technical skills roster</div>
                    <div>- <span class="term-highlight">projects</span>: View areas of focus</div>
                    <div>- <span class="term-highlight">resume</span>: View and download my professional resume</div>
                    <div>- <span class="term-highlight">experience</span>: Professional & organization experiences</div>
                    <div>- <span class="term-highlight">timeline</span>: Education and certifications</div>
                    <div>- <span class="term-highlight">contact</span>: Access email and contact details</div>
                    <div>- <span class="term-highlight">theme [light|dark|toggle]</span>: Switch UI light/dark mode ☀️🌙</div>
                    <div>- <span class="term-highlight">snake</span>: Play Classic Snake game</div>
                    <div>- <span class="term-highlight">clear</span>: Clear terminal console screen</div>
                    <div>- <span class="term-highlight">sudo [command]</span>: Request superuser elevation</div>
                `);
                break;
            case 'theme':
                if (args.length > 0) {
                    const mode = args[0].toLowerCase();
                    if (mode === 'light') setTheme('light');
                    else if (mode === 'dark') setTheme('dark');
                    else if (mode === 'toggle') toggleTheme();
                    else appendTermLine(`<div>Usage: <span class="term-highlight">theme light</span>, <span class="term-highlight">theme dark</span>, or <span class="term-highlight">theme toggle</span></div>`);
                } else {
                    toggleTheme();
                }
                break;
            case 'fullscreen':
            case 'immersive':
                toggleTerminalImmersive();
                break;
            case 'game':
            case 'invaders':
            case 'space':
                appendTermLine(`<div>Launching <span class="term-highlight">Full-Viewport Space Invaders</span> game overlay...</div>`);
                startFullWebsiteGame();
                break;
            case 'about':
            case 'profile':
                appendTermLine(`
                    <div style="color: #fff; font-weight: 500;">Sidharth D - IoT & AI/ML Engineer</div>
                    <div>Computer Science undergraduate at College of Engineering Attingal (2025-2029). Specializes in ESP32 hardware networking, Edge AI inference models, and statistics systems.</div>
                `);
                break;
            case 'skills':
                appendTermLine(`
                    <div>Skills Inventory:</div>
                    <div>- <span class="term-highlight">Programming & OS:</span> Python, C++, C, Bash, HTML/CSS, Linux OS</div>
                    <div>- <span class="term-highlight">Languages:</span> English, Malayalam, Hindi</div>
                    <div>- <span class="term-highlight">IoT & Hardware:</span> ESP32, Raspberry Pi, Arduino, MQTT, Prototyping</div>
                    <div>- <span class="term-highlight">AI/ML & Data:</span> Edge AI, Face Recognition, NumPy, SciPy, Pandas</div>
                `);
                break;
            case 'projects':
                appendTermLine(`
                    <div>Portfolio Projects:</div>
                    <div>1. <span class="term-highlight">Grabster / MediaHub Downloader ⚡</span></div>
                    <div>   - Description: Self-hosted video/audio downloader powered by yt-dlp session streams.</div>
                    <div>   - Live Demo: <a href="https://novara.ugsidharth.in/" target="_blank" style="color: var(--color-cyan);">novara.ugsidharth.in</a></div>
                    <div>   - Source Code: <a href="https://github.com/UG-SIDHARTH/Grabster-5.0" target="_blank" style="color: var(--color-cyan);">GitHub/Grabster-5.0</a></div>
                    <br>
                    <div>2. <span class="term-highlight">OS (WebOS Portfolio) 🖥️</span></div>
                    <div>   - Description: Interactive glassmorphic desktop environment displaying profile stats and timelines.</div>
                    <div>   - Live Demo: <a href="https://ug-sidharth.github.io/portfolio" target="_blank" style="color: var(--color-cyan);">ug-sidharth.github.io/portfolio</a></div>
                    <div>   - Source Code: <a href="https://github.com/UG-SIDHARTH/portfolio" target="_blank" style="color: var(--color-cyan);">GitHub/portfolio</a></div>
                    <br>
                    <div>3. <span class="term-highlight">Smart Monitor Backend 📡</span></div>
                    <div>   - Description: Telemetry processing backend for real-time sensor monitoring.</div>
                    <div>   - Status: <span style="color: #ff5f56;">Offline Backend Module</span></div>
                    <div>   - Source Code: <a href="https://github.com/UG-SIDHARTH/project" target="_blank" style="color: var(--color-cyan);">GitHub/project</a></div>
                    <br>
                    <div>4. <span class="term-highlight">Football Outcome Predictor ⚽</span></div>
                    <div>   - Description: Machine learning team statistics outcome predictive model.</div>
                    <div>   - Status: <span style="color: #ff5f56;">Prediction Model Offline</span></div>
                    <div>   - Source Code: <a href="https://github.com/UG-SIDHARTH/Football-Match-Outcome-Predictor/tree/main" target="_blank" style="color: var(--color-cyan);">GitHub/Predictor</a></div>
                    <br>
                    <div>5. <span class="term-highlight">Project Front-End 🌐</span></div>
                    <div>   - Description: Device telemetry frontend and real-time dashboard view.</div>
                    <div>   - Status: <span style="color: #ff5f56;">Client Interface Offline</span></div>
                    <div>   - Source Code: <a href="https://github.com/UG-SIDHARTH/PROJECT-FRONT-END/tree/main" target="_blank" style="color: var(--color-cyan);">GitHub/Front-End</a></div>
                `);
                break;
            case 'resume':
                if (args.includes('-d') || args.includes('--download')) {
                    triggerResumeDownload();
                } else if (args.includes('-v') || args.includes('--view')) {
                    appendTermLine(`<div>Opening <span class="term-highlight">Resume.app</span> window...</div>`);
                    openApp('resume');
                } else {
                    appendTermLine(`
                        <div style="color: #fff; font-weight: 500;">📄 SIDHARTH D - PROFESSIONAL RESUME</div>
                        <div>------------------------------------</div>
                        <div><span class="term-highlight">Name:</span> Sidharth D</div>
                        <div><span class="term-highlight">Specialization:</span> Developer, IoT Engineer, ML Enthusiast</div>
                        <div><span class="term-highlight">Education:</span> B.Tech in CSE at College of Engineering, Attingal (2025-2029)</div>
                        <div><span class="term-highlight">Experience:</span> Media Team @ IEEE SB CEAL | Media Team @ FOSS SB CEAL | Media Lead @ ISTE</div>
                        <div><span class="term-highlight">Primary Stack:</span> Python, C/C++, ESP32, Edge AI, Data Analytics</div>
                        <div><span class="term-highlight">Email:</span> mail@ugsidharth.in</div>
                        <div><span class="term-highlight">Location:</span> Kazhakkoottam, Kerala</div>
                        <div>------------------------------------</div>
                        <div>Command Options:</div>
                        <div>- Type <span class="term-highlight">resume -v</span> or <span class="term-highlight">resume --view</span> to launch CV Viewer</div>
                    `);
                }
                break;
            case 'experience':
            case 'experiences':
            case 'exp':
                appendTermLine(`
                    <div>Organizational Experience:</div>
                    <div>- <span class="term-highlight">Media Team:</span> IEEE SB CEAL | Apr 2026 - Present</div>
                    <div>- <span class="term-highlight">Media Team:</span> FOSS SB CEAL | Jun 2026 - Present</div>
                    <div>- <span class="term-highlight">Media Lead:</span> ISTE | Jul 2026 - Present</div>
                `);
                break;
            case 'timeline':
            case 'education':
                appendTermLine(`
                    <div>Academic History:</div>
                    <div>- <span class="term-highlight">B.Tech CSE:</span> CEAL | 2025 - 2029 (Expected)</div>
                    <div>- <span class="term-highlight">12th Grade:</span> Jyoti Nilayam | 2025 (Science stream)</div>
                    <div>- <span class="term-highlight">Certifications:</span> AI/ML in Junior Telecom Data Analyst</div>
                `);
                break;
            case 'contact':
            case 'mail':
                appendTermLine(`
                    <div>Contact Telemetry:</div>
                    <div>- <span class="term-highlight">Email:</span> mail@ugsidharth.in</div>
                    <div>- <span class="term-highlight">Location:</span> Kazhakkoottam, Kerala, India</div>
                `);
                break;
            case 'quit':
            case 'exit':
                if (termGameRunning) {
                    exitTerminalGame();
                } else {
                    appendTermLine(`<div>Type <span class="term-highlight">'help'</span> for available options.</div>`);
                }
                break;
            case 'snake':
                appendTermLine(`<div>Launching <span class="term-highlight">Snake.app</span> Classic Snake...</div>`);
                openApp('snake');
                break;
            case 'fight':
            case 'battle':
            case 'shooter':
                appendTermLine(`<div>Launching secret <span class="term-highlight">Fight.app</span> Space Battle...</div>`);
                openApp('fight');
                break;
            case 'clear':
                if (terminalOutput) {
                    terminalOutput.innerHTML = '';
                }
                break;
            case 'sudo':
                appendTermLine(`<div><span style="color: red;">[sudo] password for visitor:</span> </div>`);
                appendTermLine(`<div>Permission Denied: Nice try, but visitor accounts do not have root clearance!</div>`);
                break;
            default:
                if (baseCmd === 'sudo') {
                    appendTermLine(`<div>Permission Denied: Nice try, but visitor accounts do not have root clearance!</div>`);
                } else {
                    appendTermLine(`<div>bash: command not found: <span style="color: red;">${cmd}</span>. Type <span class="term-highlight">'help'</span> for reference.</div>`);
                }
        }
    }

    // 7. Contact Form Handling
    const mailForm = document.getElementById('mail-form');
    const toastContainer = document.getElementById('toast-container');

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = document.createElement('span');
        icon.textContent = type === 'success' ? '⚡' : 'ℹ️';
        icon.style.fontSize = '1.1rem';
        
        const label = document.createElement('span');
        label.textContent = message;

        toast.appendChild(icon);
        toast.appendChild(label);
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slide-in-tray 0.25s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);
    }

    if (mailForm) {
        mailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('mail-name').value;
            const email = document.getElementById('mail-email').value;
            const subject = document.getElementById('mail-subject').value;
            const message = document.getElementById('mail-message').value;

            // Submit to Backend API
            fetch(`${API_BASE}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, subject, message })
            })
            .then(res => {
                if (!res.ok) throw new Error('API Error');
                return res.json();
            })
            .then(data => {
                showToast(`Transmission complete. Thank you, ${name}!`);
                mailForm.reset();
                
                // Close form window after brief delay
                setTimeout(() => {
                    const mailWin = document.getElementById('window-mail');
                    if (mailWin) {
                        closeWindow(mailWin);
                    }
                }, 1000);
            })
            .catch(err => {
                console.error('Contact Form Fetch Error:', err);
                showToast(`Transmission failed. Check network stats.`, 'info');
            });
        });
    }

    // 7.5 VS Code Simulated Editor File Switcher
    const vscodeFiles = document.querySelectorAll('.vscode-file-item');
    const vscodeDisplay = document.getElementById('vscode-code-display');
    const vscodeActiveTab = document.getElementById('vscode-active-tab');

    function loadVSCodeFile(fileId) {
        const template = document.getElementById(`template-vscode-${fileId}`);
        if (template && vscodeDisplay && vscodeActiveTab) {
            vscodeDisplay.innerHTML = template.innerHTML;
            const extension = fileId === 'resume' ? 'json' : (fileId === 'index' ? 'html' : (fileId === 'script' ? 'js' : 'css'));
            vscodeActiveTab.querySelector('span').textContent = `${fileId}.${extension}`;
        }
    }

    vscodeFiles.forEach(item => {
        item.addEventListener('click', () => {
            vscodeFiles.forEach(f => f.classList.remove('active-file'));
            item.classList.add('active-file');
            const fileId = item.getAttribute('data-file');
            loadVSCodeFile(fileId);
        });
    });

    // Load default file on boot
    loadVSCodeFile('resume');

    // 7.6 Projects Dashboard Interactive Controls
    const liveOnlyCheck = document.getElementById('live-only-check');
    const refreshBtn = document.getElementById('projects-refresh-btn');
    const techCards = document.querySelectorAll('.tech-card');

    if (liveOnlyCheck) {
        liveOnlyCheck.addEventListener('change', () => {
            const showLiveOnly = liveOnlyCheck.checked;
            techCards.forEach(card => {
                const isLive = card.getAttribute('data-live') === 'true';
                if (showLiveOnly && !isLive) {
                    card.style.opacity = '0.3';
                    card.style.pointerEvents = 'none';
                } else {
                    card.style.opacity = '1';
                    card.style.pointerEvents = 'auto';
                }
            });
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const icon = refreshBtn.querySelector('.refresh-icon');
            if (icon) {
                icon.style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    icon.style.transform = 'none';
                }, 400);
            }
            showToast('Refreshing modules registry...', 'success');
        });
    }

    techCards.forEach(card => {
        card.addEventListener('click', () => {
            techCards.forEach(c => c.classList.remove('active-card'));
            card.classList.add('active-card');
        });
    });

    // 7.7 Embedded Projects Run Viewer (Iframe Browser)
    const runButtons = document.querySelectorAll('.btn-run');
    const projectsContainer = document.querySelector('.projects-window-container');
    const iframeContainer = document.querySelector('.projects-iframe-container');
    const projectsIframe = document.getElementById('projects-iframe');
    const iframeBackBtn = document.getElementById('btn-iframe-back');
    const iframeUrlDisplay = document.getElementById('iframe-current-url');
    const iframeLinkBtn = document.getElementById('iframe-external-link');

    runButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // prevent card click triggers
            const url = btn.getAttribute('href');
            
            if (url && projectsIframe && projectsContainer && iframeContainer) {
                projectsIframe.src = url;
                if (iframeUrlDisplay) iframeUrlDisplay.textContent = url;
                if (iframeLinkBtn) iframeLinkBtn.setAttribute('href', url);
                
                projectsContainer.style.display = 'none';
                iframeContainer.style.display = 'flex';
            }
        });
    });

    if (iframeBackBtn) {
        iframeBackBtn.addEventListener('click', () => {
            if (projectsIframe && projectsContainer && iframeContainer) {
                projectsIframe.src = 'about:blank'; // stop background loading processes
                iframeContainer.style.display = 'none';
                projectsContainer.style.display = 'block';
            }
        });
    }

    // Initialize: Open default windows on boot
    runBootloader();

    // 7.8 Browser.app Navigation & Search Emulator
    const browserAddress = document.getElementById('browser-address');
    const browserGoBtn = document.getElementById('browser-go-btn');
    const browserBackBtn = document.getElementById('browser-back-btn');
    const browserHomeBtn = document.getElementById('browser-home-btn');
    const googleHome = document.getElementById('google-home');
    const googleSearchQuery = document.getElementById('google-search-query');
    const googleSearchBtn = document.getElementById('google-search-btn');
    const googleLuckyBtn = document.getElementById('google-lucky-btn');
    const browserIframe = document.getElementById('browser-iframe');

    function showGoogleHome() {
        if (browserAddress) browserAddress.value = 'https://google.com';
        if (googleHome) googleHome.style.display = 'flex';
        if (browserIframe) {
            browserIframe.style.display = 'none';
            browserIframe.src = 'about:blank';
        }
        if (googleSearchQuery) {
            googleSearchQuery.value = '';
            googleSearchQuery.focus();
        }
    }

    function initBrowserApp() {
        showGoogleHome();
    }

    function performWebSearch(query) {
        query = query.trim();
        if (query === '') return;
        showToast('Launching Google Search...', 'success');
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }

    function handleAddressSubmit() {
        if (!browserAddress) return;
        const value = browserAddress.value.trim();
        if (value === '') return;

        const isDomain = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/i.test(value);
        
        if (isDomain) {
            let url = value;
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
            }
            
            if (url.includes('google.com') && !url.includes('/search')) {
                showGoogleHome();
                return;
            }

            if (googleHome) googleHome.style.display = 'none';
            if (browserIframe) {
                browserIframe.style.display = 'block';
                browserIframe.src = url;
            }
        } else {
            performWebSearch(value);
        }
    }

    if (browserHomeBtn) browserHomeBtn.addEventListener('click', showGoogleHome);
    if (browserBackBtn) browserBackBtn.addEventListener('click', showGoogleHome);

    if (browserGoBtn) {
        browserGoBtn.addEventListener('click', handleAddressSubmit);
    }
    if (browserAddress) {
        browserAddress.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleAddressSubmit();
            }
        });
    }

    if (googleSearchBtn && googleSearchQuery) {
        googleSearchBtn.addEventListener('click', () => {
            performWebSearch(googleSearchQuery.value);
        });
    }

    if (googleSearchQuery) {
        googleSearchQuery.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                performWebSearch(googleSearchQuery.value);
            }
        });
    }

    if (googleLuckyBtn) {
        googleLuckyBtn.addEventListener('click', () => {
            const apps = ['profile', 'skills', 'projects', 'resume', 'terminal', 'mail', 'vscode', 'snake'];
            const randomApp = apps[Math.floor(Math.random() * apps.length)];
            showToast(`OS feeling lucky! Launching ${randomApp}.app...`, 'success');
            setTimeout(() => {
                openApp(randomApp);
            }, 500);
        });
    }

    // 7.9 Snake Game Easter Egg Logic
    const snakeCanvas = document.getElementById('snake-canvas');
    const snakeScoreVal = document.getElementById('snake-score');
    const snakeHighscoreVal = document.getElementById('snake-highscore');
    const snakeStartBtn = document.getElementById('snake-start-btn');
    const slowIndicator = document.getElementById('slow-indicator');

    let snakeCtx = snakeCanvas ? snakeCanvas.getContext('2d') : null;
    let snake = [];
    let foods = [];
    let obstacles = [];
    let dx = 20;
    let dy = 0;
    let score = 0;
    let highscore = localStorage.getItem('snake_highscore') || 0;
    let gameInterval = null;
    let gameRunning = false;
    let slowTicks = 0;
    const gridSize = 20;

    const obstacleCoords = [
        { x: 1, y: 4 }, { x: 1, y: 5 }, { x: 2, y: 5 },
        { x: 1, y: 11 }, { x: 1, y: 12 }, { x: 2, y: 11 },
        { x: 6, y: 1 }, { x: 6, y: 2 }, { x: 6, y: 3 },
        { x: 6, y: 13 }, { x: 6, y: 14 }, { x: 6, y: 15 },
        { x: 4, y: 8 }, { x: 9, y: 3 }, { x: 9, y: 13 }, { x: 9, y: 8 },
        { x: 7, y: 6 }, { x: 7, y: 7 }, { x: 8, y: 6 },
        { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 12, y: 7 },
        { x: 7, y: 10 }, { x: 7, y: 9 }, { x: 8, y: 10 },
        { x: 11, y: 10 }, { x: 12, y: 10 }, { x: 12, y: 9 },
        { x: 15, y: 8 },
        { x: 18, y: 4 }, { x: 18, y: 5 }, { x: 17, y: 5 },
        { x: 18, y: 12 }, { x: 18, y: 11 }, { x: 17, y: 11 },
        { x: 23, y: 2 }, { x: 23, y: 3 }, { x: 23, y: 4 }, { x: 24, y: 4 }, { x: 25, y: 4 }, { x: 26, y: 4 },
        { x: 23, y: 14 }, { x: 23, y: 13 }, { x: 23, y: 12 }, { x: 24, y: 12 }, { x: 25, y: 12 }, { x: 26, y: 12 },
        { x: 23, y: 6 }, { x: 23, y: 7 }, { x: 23, y: 8 }, { x: 23, y: 9 }, { x: 23, y: 10 },
        { x: 21, y: 8 }, { x: 22, y: 8 }, { x: 24, y: 8 }, { x: 25, y: 8 },
        { x: 28, y: 5 }, { x: 28, y: 6 }, { x: 28, y: 7 }, { x: 28, y: 8 }, { x: 28, y: 9 }, { x: 28, y: 10 }, { x: 28, y: 11 }
    ];

    if (snakeHighscoreVal) snakeHighscoreVal.textContent = highscore;

    function startSnakeGame() {
        if (gameRunning) return;
        gameRunning = true;
        score = 0;
        slowTicks = 0;
        if (slowIndicator) slowIndicator.style.display = 'none';
        if (snakeScoreVal) snakeScoreVal.textContent = score;
        dx = gridSize;
        dy = 0;
        snake = [
            { x: gridSize * 13, y: gridSize * 12 },
            { x: gridSize * 12, y: gridSize * 12 },
            { x: gridSize * 11, y: gridSize * 12 }
        ];
        
        obstacles = obstacleCoords.map(o => ({ x: o.x * gridSize, y: o.y * gridSize }));
        
        foods = [];
        spawnInitialFoods();
        
        if (snakeStartBtn) snakeStartBtn.style.display = 'none';

        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(updateSnakeGame, 200);
    }

    function spawnInitialFoods() {
        for (let i = 0; i < 3; i++) spawnFoodItem('red');
        for (let i = 0; i < 2; i++) spawnFoodItem('blue');
        spawnFoodItem('powerup');
    }

    function spawnFoodItem(type) {
        if (!snakeCanvas) return;
        let foundPos = false;
        let fx = 0, fy = 0;
        
        while (!foundPos) {
            fx = (Math.floor(Math.random() * 30) + 1) * gridSize;
            fy = (Math.floor(Math.random() * 15) + 1) * gridSize;
            
            let overlap = false;
            snake.forEach(part => {
                if (part.x === fx && part.y === fy) overlap = true;
            });
            obstacles.forEach(obs => {
                if (obs.x === fx && obs.y === fy) overlap = true;
            });
            foods.forEach(f => {
                if (f.x === fx && f.y === fy) overlap = true;
            });
            
            if (!overlap) foundPos = true;
        }
        
        foods.push({ x: fx, y: fy, type: type });
    }

    function checkSelfCollision(head) {
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) return true;
        }
        return false;
    }

    function updateSnakeGame() {
        if (!snakeCtx || !snakeCanvas) return;

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        let borderCollision = false;
        if (head.x < gridSize || head.x >= snakeCanvas.width - gridSize || 
            head.y < gridSize || head.y >= snakeCanvas.height - gridSize) {
            borderCollision = true;
        }

        let hitObstacle = false;
        obstacles.forEach(obs => {
            if (head.x === obs.x && head.y === obs.y) hitObstacle = true;
        });

        if (borderCollision || checkSelfCollision(head) || hitObstacle) {
            endSnakeGame();
            return;
        }

        snake.unshift(head);

        let eatenIdx = -1;
        for (let i = 0; i < foods.length; i++) {
            if (head.x === foods[i].x && head.y === foods[i].y) {
                eatenIdx = i;
                break;
            }
        }

        if (eatenIdx > -1) {
            const eatenFood = foods[eatenIdx];
            foods.splice(eatenIdx, 1);
            
            if (eatenFood.type === 'red') {
                score += 10;
            } else if (eatenFood.type === 'blue') {
                score += 20;
            } else if (eatenFood.type === 'powerup') {
                score += 30;
                slowTicks = 40;
                if (slowIndicator) slowIndicator.style.display = 'inline';
                
                clearInterval(gameInterval);
                gameInterval = setInterval(updateSnakeGame, 280);
            }
            
            if (snakeScoreVal) snakeScoreVal.textContent = score;
            if (score > highscore) {
                highscore = score;
                localStorage.setItem('snake_highscore', highscore);
                if (snakeHighscoreVal) snakeHighscoreVal.textContent = highscore;
            }
            
            spawnFoodItem(eatenFood.type);
        } else {
            snake.pop();
        }

        if (slowTicks > 0) {
            slowTicks--;
            if (slowTicks === 0) {
                if (slowIndicator) slowIndicator.style.display = 'none';
                clearInterval(gameInterval);
                gameInterval = setInterval(updateSnakeGame, 200);
            }
        }

        // Draw Checkerboard
        for (let row = 0; row < snakeCanvas.height / gridSize; row++) {
            for (let col = 0; col < snakeCanvas.width / gridSize; col++) {
                const px = col * gridSize;
                const py = row * gridSize;
                
                if (row === 0 || row === 16 || col === 0) {
                    snakeCtx.fillStyle = '#2d2f35';
                    snakeCtx.fillRect(px, py, gridSize, gridSize);
                    snakeCtx.strokeStyle = '#1b1c20';
                    snakeCtx.lineWidth = 0.5;
                    snakeCtx.strokeRect(px, py, gridSize, gridSize);
                } else if (col === 31) {
                    snakeCtx.fillStyle = '#b32b2b';
                    snakeCtx.fillRect(px, py, gridSize, gridSize);
                    snakeCtx.strokeStyle = '#7c1c1c';
                    snakeCtx.lineWidth = 0.5;
                    snakeCtx.strokeRect(px, py, gridSize, gridSize);
                } else {
                    const isEven = (col + row) % 2 === 0;
                    snakeCtx.fillStyle = isEven ? '#aad751' : '#a2d149';
                    snakeCtx.fillRect(px, py, gridSize, gridSize);
                }
            }
        }

        // Draw Obstacles
        obstacles.forEach(obs => {
            snakeCtx.fillStyle = '#383838';
            snakeCtx.fillRect(obs.x, obs.y, gridSize, gridSize);
            snakeCtx.strokeStyle = '#222';
            snakeCtx.lineWidth = 1;
            snakeCtx.strokeRect(obs.x, obs.y, gridSize, gridSize);
        });

        // Draw Food
        foods.forEach(f => {
            const centerX = f.x + gridSize / 2;
            const centerY = f.y + gridSize / 2;
            
            if (f.type === 'red' || f.type === 'blue') {
                const appleRadius = 7;
                snakeCtx.fillStyle = f.type === 'red' ? '#e83a14' : '#00f2fe';
                snakeCtx.beginPath();
                snakeCtx.arc(centerX, centerY, appleRadius, 0, Math.PI * 2);
                snakeCtx.fill();
                
                snakeCtx.strokeStyle = '#8b4513';
                snakeCtx.lineWidth = 1.5;
                snakeCtx.beginPath();
                snakeCtx.moveTo(centerX, centerY - appleRadius);
                snakeCtx.quadraticCurveTo(centerX - 2, centerY - appleRadius - 4, centerX - 1, centerY - appleRadius - 5);
                snakeCtx.stroke();
                
                snakeCtx.fillStyle = '#578a34';
                snakeCtx.beginPath();
                snakeCtx.ellipse(centerX + 2, centerY - appleRadius - 3, 2.5, 1.5, Math.PI / 4, 0, Math.PI * 2);
                snakeCtx.fill();
            } else if (f.type === 'powerup') {
                snakeCtx.fillStyle = '#4c52e0';
                snakeCtx.beginPath();
                snakeCtx.arc(centerX, centerY, 8, 0, Math.PI * 2);
                snakeCtx.fill();
                snakeCtx.strokeStyle = '#ffffff';
                snakeCtx.lineWidth = 1;
                snakeCtx.stroke();
                
                snakeCtx.fillStyle = '#ffffff';
                snakeCtx.beginPath();
                snakeCtx.moveTo(centerX, centerY - 4);
                snakeCtx.lineTo(centerX - 4, centerY + 2);
                snakeCtx.lineTo(centerX + 4, centerY + 2);
                snakeCtx.closePath();
                snakeCtx.fill();
            }
        });

        // Draw Snake
        snake.forEach((part, idx) => {
            const cx = part.x + gridSize / 2;
            const cy = part.y + gridSize / 2;
            
            if (idx === 0) {
                snakeCtx.fillStyle = '#467528';
                snakeCtx.beginPath();
                snakeCtx.arc(cx, cy, 9.5, 0, Math.PI * 2);
                snakeCtx.fill();
                
                snakeCtx.fillStyle = '#ffffff';
                let eye1 = {}, eye2 = {};
                if (dx > 0) {
                    eye1 = { x: cx + 4, y: cy - 4 };
                    eye2 = { x: cx + 4, y: cy + 4 };
                } else if (dx < 0) {
                    eye1 = { x: cx - 4, y: cy - 4 };
                    eye2 = { x: cx - 4, y: cy + 4 };
                } else if (dy > 0) {
                    eye1 = { x: cx - 4, y: cy + 4 };
                    eye2 = { x: cx + 4, y: cy + 4 };
                } else {
                    eye1 = { x: cx - 4, y: cy - 4 };
                    eye2 = { x: cx + 4, y: cy - 4 };
                }

                snakeCtx.beginPath();
                snakeCtx.arc(eye1.x, eye1.y, 2.8, 0, Math.PI * 2);
                snakeCtx.arc(eye2.x, eye2.y, 2.8, 0, Math.PI * 2);
                snakeCtx.fill();

                snakeCtx.fillStyle = '#000000';
                snakeCtx.beginPath();
                snakeCtx.arc(eye1.x, eye1.y, 1.2, 0, Math.PI * 2);
                snakeCtx.arc(eye2.x, eye2.y, 1.2, 0, Math.PI * 2);
                snakeCtx.fill();
            } else {
                snakeCtx.fillStyle = '#578a34';
                snakeCtx.beginPath();
                snakeCtx.arc(cx, cy, 8, 0, Math.PI * 2);
                snakeCtx.fill();
                
                snakeCtx.strokeStyle = '#467528';
                snakeCtx.lineWidth = 1.2;
                snakeCtx.stroke();
            }
        });
    }

    function checkSelfCollision(head) {
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) return true;
        }
        return false;
    }

    function endSnakeGame() {
        gameRunning = false;
        clearInterval(gameInterval);
        if (snakeStartBtn) {
            snakeStartBtn.style.display = 'block';
            snakeStartBtn.textContent = 'RESTART';
        }
        if (snakeCtx && snakeCanvas) {
            snakeCtx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
            snakeCtx.font = '24px "Space Grotesk", sans-serif';
            snakeCtx.fillStyle = '#ff5f56';
            snakeCtx.textAlign = 'center';
            snakeCtx.fillText('GAME OVER', snakeCanvas.width / 2, snakeCanvas.height / 2 - 10);
            snakeCtx.font = '14px "Fira Code", monospace';
            snakeCtx.fillStyle = '#94a3b8';
            snakeCtx.fillText(`SCORE: ${score}`, snakeCanvas.width / 2, snakeCanvas.height / 2 + 25);
        }
    }

    if (snakeStartBtn) {
        snakeStartBtn.addEventListener('click', startSnakeGame);
    }

    const dpadUp = document.getElementById('snake-dpad-up');
    const dpadDown = document.getElementById('snake-dpad-down');
    const dpadLeft = document.getElementById('snake-dpad-left');
    const dpadRight = document.getElementById('snake-dpad-right');

    if (dpadUp) {
        dpadUp.addEventListener('click', () => {
            if (dy === 0) { dx = 0; dy = -gridSize; }
        });
    }
    if (dpadDown) {
        dpadDown.addEventListener('click', () => {
            if (dy === 0) { dx = 0; dy = gridSize; }
        });
    }
    if (dpadLeft) {
        dpadLeft.addEventListener('click', () => {
            if (dx === 0) { dx = -gridSize; dy = 0; }
        });
    }
    if (dpadRight) {
        dpadRight.addEventListener('click', () => {
            if (dx === 0) { dx = gridSize; dy = 0; }
        });
    }

    window.addEventListener('keydown', (e) => {
        const snakeWin = document.getElementById('window-snake');
        if (!snakeWin || !snakeWin.classList.contains('focused-window')) return;

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }

        if (e.key === 'ArrowUp' && dy === 0) {
            dx = 0;
            dy = -gridSize;
        } else if (e.key === 'ArrowDown' && dy === 0) {
            dx = 0;
            dy = gridSize;
        } else if (e.key === 'ArrowLeft' && dx === 0) {
            dx = -gridSize;
            dy = 0;
        } else if (e.key === 'ArrowRight' && dx === 0) {
            dx = gridSize;
            dy = 0;
        }
    });

    // 7.95 Fight Game Easter Egg Logic
    const fightCanvas = document.getElementById('fight-canvas');
    const fightScoreVal = document.getElementById('fight-score');
    const fightHighscoreVal = document.getElementById('fight-highscore');
    const fightStartBtn = document.getElementById('fight-start-btn');
    const fightCtrlLeft = document.getElementById('fight-ctrl-left');
    const fightCtrlRight = document.getElementById('fight-ctrl-right');
    const fightCtrlFire = document.getElementById('fight-ctrl-fire');

    let fightCtx = fightCanvas ? fightCanvas.getContext('2d') : null;
    let shooterPlayer = { x: 150, y: 290, width: 22, height: 16, speed: 6 };
    let lasers = [];
    let enemies = [];
    let particles = [];
    let fightScore = 0;
    let fightHighscore = localStorage.getItem('fight_highscore') || 0;
    let fightInterval = null;
    let fightRunning = false;
    let lastFireTime = 0;
    const fireCooldown = 250;
    let enemySpawnCounter = 0;

    if (fightHighscoreVal) fightHighscoreVal.textContent = fightHighscore;

    function startFightGame() {
        if (fightRunning) return;
        fightRunning = true;
        fightScore = 0;
        if (fightScoreVal) fightScoreVal.textContent = fightScore;
        shooterPlayer.x = 150;
        lasers = [];
        enemies = [];
        particles = [];
        enemySpawnCounter = 0;
        if (fightStartBtn) fightStartBtn.style.display = 'none';

        if (fightInterval) clearInterval(fightInterval);
        fightInterval = setInterval(updateFightGame, 1000 / 60);
    }

    function spawnEnemy() {
        if (!fightCanvas) return;
        const size = Math.random() * 12 + 10;
        const x = Math.random() * (fightCanvas.width - size);
        const speed = Math.random() * 1.5 + 1.2;
        enemies.push({ x, y: -size, size, speed });
    }

    function createExplosion(x, y, color) {
        for (let i = 0; i < 8; i++) {
            particles.push({
                x,
                y,
                dx: (Math.random() - 0.5) * 4,
                dy: (Math.random() - 0.5) * 4,
                size: Math.random() * 3 + 1,
                color: color || '#ff5f56',
                life: 30
            });
        }
    }

    function fireLaser() {
        const now = Date.now();
        if (now - lastFireTime < fireCooldown) return;
        lastFireTime = now;
        lasers.push({
            x: shooterPlayer.x + shooterPlayer.width / 2 - 2,
            y: shooterPlayer.y,
            width: 4,
            height: 12,
            speed: 5
        });
        createExplosion(shooterPlayer.x + shooterPlayer.width / 2, shooterPlayer.y, '#00f2fe');
    }

    function updateFightGame() {
        if (!fightCtx || !fightCanvas) return;

        fightCtx.fillStyle = '#020305';
        fightCtx.fillRect(0, 0, fightCanvas.width, fightCanvas.height);

        enemySpawnCounter++;
        if (enemySpawnCounter >= 55) {
            enemySpawnCounter = 0;
            spawnEnemy();
        }

        fightCtx.shadowBlur = 10;
        fightCtx.shadowColor = '#00f2fe';
        fightCtx.fillStyle = '#00f2fe';
        fightCtx.beginPath();
        fightCtx.moveTo(shooterPlayer.x + shooterPlayer.width / 2, shooterPlayer.y);
        fightCtx.lineTo(shooterPlayer.x, shooterPlayer.y + shooterPlayer.height);
        fightCtx.lineTo(shooterPlayer.x + shooterPlayer.width, shooterPlayer.y + shooterPlayer.height);
        fightCtx.closePath();
        fightCtx.fill();

        fightCtx.shadowColor = '#00f2fe';
        fightCtx.fillStyle = '#00f2fe';
        for (let i = lasers.length - 1; i >= 0; i--) {
            lasers[i].y -= lasers[i].speed;
            fightCtx.fillRect(lasers[i].x, lasers[i].y, lasers[i].width, lasers[i].height);
            if (lasers[i].y < -20) {
                lasers.splice(i, 1);
            }
        }

        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].y += enemies[i].speed;

            fightCtx.shadowColor = '#ff5f56';
            fightCtx.fillStyle = '#ff5f56';
            fightCtx.beginPath();
            fightCtx.arc(enemies[i].x + enemies[i].size / 2, enemies[i].y + enemies[i].size / 2, enemies[i].size / 2, 0, Math.PI * 2);
            fightCtx.fill();

            for (let j = lasers.length - 1; j >= 0; j--) {
                const laser = lasers[j];
                const enemy = enemies[i];
                if (laser.x > enemy.x && laser.x < enemy.x + enemy.size &&
                    laser.y > enemy.y && laser.y < enemy.y + enemy.size) {
                    createExplosion(enemy.x + enemy.size / 2, enemy.y + enemy.size / 2, '#ff5f56');
                    enemies.splice(i, 1);
                    lasers.splice(j, 1);
                    fightScore += 10;
                    if (fightScoreVal) fightScoreVal.textContent = fightScore;
                    if (fightScore > fightHighscore) {
                        fightHighscore = fightScore;
                        localStorage.setItem('fight_highscore', fightHighscore);
                        if (fightHighscoreVal) fightHighscoreVal.textContent = fightHighscore;
                    }
                    break;
                }
            }

            if (enemies[i]) {
                const enemy = enemies[i];
                const hitsBottom = (enemy.y + enemy.size >= fightCanvas.height);
                const hitsShip = (
                    enemy.x + enemy.size > shooterPlayer.x &&
                    enemy.x < shooterPlayer.x + shooterPlayer.width &&
                    enemy.y + enemy.size > shooterPlayer.y &&
                    enemy.y < shooterPlayer.y + shooterPlayer.height
                );

                if (hitsBottom || hitsShip) {
                    endFightGame();
                    return;
                }
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].x += particles[i].dx;
            particles[i].y += particles[i].dy;
            particles[i].life--;
            fightCtx.shadowColor = particles[i].color;
            fightCtx.fillStyle = particles[i].color;
            fightCtx.fillRect(particles[i].x, particles[i].y, particles[i].size, particles[i].size);
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }

        fightCtx.shadowBlur = 0;
    }

    function endFightGame() {
        fightRunning = false;
        clearInterval(fightInterval);
        if (fightStartBtn) {
            fightStartBtn.style.display = 'block';
            fightStartBtn.textContent = 'RESTART';
        }
        if (fightCtx && fightCanvas) {
            fightCtx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            fightCtx.fillRect(0, 0, fightCanvas.width, fightCanvas.height);
            fightCtx.font = '16px "Fira Code", monospace';
            fightCtx.fillStyle = '#ff5f56';
            fightCtx.textAlign = 'center';
            fightCtx.fillText('GAME OVER', fightCanvas.width / 2, fightCanvas.height / 2 - 10);
            fightCtx.font = '12px "Fira Code", monospace';
            fightCtx.fillStyle = '#94a3b8';
            fightCtx.fillText(`SCORE: ${fightScore}`, fightCanvas.width / 2, fightCanvas.height / 2 + 20);
        }
    }

    if (fightStartBtn) {
        fightStartBtn.addEventListener('click', startFightGame);
    }

    window.addEventListener('keydown', (e) => {
        const fightWin = document.getElementById('window-fight');
        if (!fightWin || !fightWin.classList.contains('focused-window')) return;

        if (['ArrowLeft', 'ArrowRight', 'Space', ' '].includes(e.key)) {
            e.preventDefault();
        }

        if (e.key === 'ArrowLeft' || e.key === 'Left') {
            shooterPlayer.x = Math.max(0, shooterPlayer.x - shooterPlayer.speed);
        } else if (e.key === 'ArrowRight' || e.key === 'Right') {
            if (fightCanvas) shooterPlayer.x = Math.min(fightCanvas.width - shooterPlayer.width, shooterPlayer.x + shooterPlayer.speed);
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            fireLaser();
        }
    });

    if (fightCtrlLeft) {
        fightCtrlLeft.addEventListener('click', () => {
            shooterPlayer.x = Math.max(0, shooterPlayer.x - 20);
        });
    }
    if (fightCtrlRight) {
        fightCtrlRight.addEventListener('click', () => {
            if (fightCanvas) shooterPlayer.x = Math.min(fightCanvas.width - shooterPlayer.width, shooterPlayer.x + 20);
        });
    }
    if (fightCtrlFire) {
        fightCtrlFire.addEventListener('click', fireLaser);
    }

    // 7.5. Creative.app tab-switching logic
    const creativeTabBtns = document.querySelectorAll('.creative-tab-btn');
    const creativePanels = document.querySelectorAll('.creative-panel');

    creativeTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            creativeTabBtns.forEach(b => {
                b.classList.remove('active-creative-tab');
                b.style.background = 'transparent';
                b.style.borderColor = 'transparent';
                b.style.color = '#94a3b8';
            });
            btn.classList.add('active-creative-tab');
            btn.style.background = 'rgba(0, 242, 254, 0.08)';
            btn.style.borderColor = 'rgba(0, 242, 254, 0.35)';
            btn.style.color = 'var(--color-cyan)';

            const targetTab = btn.getAttribute('data-creative-tab');
            creativePanels.forEach(panel => {
                if (panel.id === `creative-panel-${targetTab}`) {
                    panel.style.display = 'flex';
                } else {
                    panel.style.display = 'none';
                }
            });
        });
    });

    // 8. Wallpaper Canvas particles
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 60;
        const connectDistance = 110;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = (Math.random() - 0.5) * 0.45;
                this.radius = Math.random() * 1.5 + 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 242, 254, 0.35)';
                ctx.fill();
            }
        }

        window.initParticles = function() {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectDistance) {
                        const alpha = (1 - dist / connectDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawLines();
            requestAnimationFrame(animate);
        }

        initParticles();
        animate();
    }
});
