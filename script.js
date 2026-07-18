document.addEventListener('DOMContentLoaded', () => {
    // Global API URL Redirection Mapping for decoupled frontend/backend deployment
    const API_BASE = window.location.port === '3500' ? '' : 'http://localhost:3500';

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
                    <div>- <span class="term-highlight">snake</span>: Play Classic Snake game</div>
                    <div>- <span class="term-highlight">neofetch</span>: System summary report</div>
                    <div>- <span class="term-highlight">clear</span>: Clear terminal console screen</div>
                    <div>- <span class="term-highlight">sudo [command]</span>: Request superuser elevation</div>
                `);
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
                        <div><span class="term-highlight">Email:</span> ugsidharth@icloud.com</div>
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
            case 'snake':
            case 'game':
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
            case 'neofetch':
                const screenRes = `${window.innerWidth}x${window.innerHeight}`;
                appendTermLine(`
                    <pre style="color: #00ff55; font-family: monospace; font-size: 0.8rem; line-height: 1.25;">
      .---.       visitor@os-portfolio
     /     \\      --------------------------
     \\   _./      OS: OS v1.0.6 x86_64
      \`-'-'       Host: WebOS Desktop Environment
     /|\\ | /|\\    Kernel: Javascript ES6 Engine
    / | \\|/ | \\   Uptime: 4 mins
   /  |  |  |  \\  Resolution: ${screenRes}
                 Shell: custom-bash-sh
                 Theme: Glassmorphism Dark Mesh
                 CPU: ESP32 Hardware Emulator
                 RAM: 512 MB (Simulated)
                    </pre>
                `);
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

    let snakeCtx = snakeCanvas ? snakeCanvas.getContext('2d') : null;
    let snake = [];
    let food = {};
    let dx = 16;
    let dy = 0;
    let score = 0;
    let highscore = localStorage.getItem('snake_highscore') || 0;
    let gameInterval = null;
    let gameRunning = false;
    const gridSize = 16;

    if (snakeHighscoreVal) snakeHighscoreVal.textContent = highscore;

    function startSnakeGame() {
        if (gameRunning) return;
        gameRunning = true;
        score = 0;
        if (snakeScoreVal) snakeScoreVal.textContent = score;
        dx = gridSize;
        dy = 0;
        snake = [
            { x: gridSize * 5, y: gridSize * 5 },
            { x: gridSize * 4, y: gridSize * 5 },
            { x: gridSize * 3, y: gridSize * 5 }
        ];
        createFood();
        if (snakeStartBtn) snakeStartBtn.style.display = 'none';

        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(updateSnakeGame, 100);
    }

    function createFood() {
        if (!snakeCanvas) return;
        food.x = Math.floor(Math.random() * (snakeCanvas.width / gridSize)) * gridSize;
        food.y = Math.floor(Math.random() * (snakeCanvas.height / gridSize)) * gridSize;
        
        let foodOnSnake = false;
        snake.forEach(part => {
            if (part.x === food.x && part.y === food.y) foodOnSnake = true;
        });
        if (foodOnSnake) createFood();
    }

    function updateSnakeGame() {
        if (!snakeCtx || !snakeCanvas) return;

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        if (head.x < 0 || head.x >= snakeCanvas.width || head.y < 0 || head.y >= snakeCanvas.height || checkSelfCollision(head)) {
            endSnakeGame();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            if (snakeScoreVal) snakeScoreVal.textContent = score;
            if (score > highscore) {
                highscore = score;
                localStorage.setItem('snake_highscore', highscore);
                if (snakeHighscoreVal) snakeHighscoreVal.textContent = highscore;
            }
            createFood();
        } else {
            snake.pop();
        }

        // Draw green checkered board
        for (let row = 0; row < snakeCanvas.height / gridSize; row++) {
            for (let col = 0; col < snakeCanvas.width / gridSize; col++) {
                const isEven = (col + row) % 2 === 0;
                snakeCtx.fillStyle = isEven ? '#aad751' : '#a2d149';
                snakeCtx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
            }
        }

        // Draw Food (detailed Red Apple)
        const centerX = food.x + gridSize / 2;
        const centerY = food.y + gridSize / 2;
        const appleRadius = 6;
        
        snakeCtx.fillStyle = '#e83a14';
        snakeCtx.beginPath();
        snakeCtx.arc(centerX, centerY, appleRadius, 0, Math.PI * 2);
        snakeCtx.fill();
        
        snakeCtx.strokeStyle = '#8b4513';
        snakeCtx.lineWidth = 1.5;
        snakeCtx.beginPath();
        snakeCtx.moveTo(centerX, centerY - appleRadius);
        snakeCtx.quadraticCurveTo(centerX - 2, centerY - appleRadius - 4, centerX - 1, centerY - appleRadius - 5);
        snakeCtx.stroke();
        
        snakeCtx.fillStyle = '#2e8b57';
        snakeCtx.beginPath();
        snakeCtx.ellipse(centerX + 2, centerY - appleRadius - 3, 2, 1.2, Math.PI / 4, 0, Math.PI * 2);
        snakeCtx.fill();

        // Draw Snake (Classic blue with direction-aware eyes on the head)
        snake.forEach((part, idx) => {
            if (idx === 0) {
                snakeCtx.fillStyle = '#3f61d8';
                snakeCtx.fillRect(part.x, part.y, gridSize, gridSize);

                snakeCtx.fillStyle = '#ffffff';
                let eye1 = {}, eye2 = {};
                if (dx > 0) {
                    eye1 = { x: part.x + 11, y: part.y + 4 };
                    eye2 = { x: part.x + 11, y: part.y + 12 };
                } else if (dx < 0) {
                    eye1 = { x: part.x + 5, y: part.y + 4 };
                    eye2 = { x: part.x + 5, y: part.y + 12 };
                } else if (dy > 0) {
                    eye1 = { x: part.x + 4, y: part.y + 11 };
                    eye2 = { x: part.x + 12, y: part.y + 11 };
                } else {
                    eye1 = { x: part.x + 4, y: part.y + 5 };
                    eye2 = { x: part.x + 12, y: part.y + 5 };
                }

                snakeCtx.beginPath();
                snakeCtx.arc(eye1.x, eye1.y, 2.5, 0, Math.PI * 2);
                snakeCtx.arc(eye2.x, eye2.y, 2.5, 0, Math.PI * 2);
                snakeCtx.fill();

                snakeCtx.fillStyle = '#000000';
                snakeCtx.beginPath();
                snakeCtx.arc(eye1.x, eye1.y, 1.2, 0, Math.PI * 2);
                snakeCtx.arc(eye2.x, eye2.y, 1.2, 0, Math.PI * 2);
                snakeCtx.fill();
            } else {
                snakeCtx.fillStyle = '#4e7cf6';
                snakeCtx.fillRect(part.x + 0.5, part.y + 0.5, gridSize - 1, gridSize - 1);
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
            snakeCtx.font = '16px "Fira Code", monospace';
            snakeCtx.fillStyle = '#ff5f56';
            snakeCtx.textAlign = 'center';
            snakeCtx.fillText('GAME OVER', snakeCanvas.width / 2, snakeCanvas.height / 2 - 10);
            snakeCtx.font = '12px "Fira Code", monospace';
            snakeCtx.fillStyle = '#94a3b8';
            snakeCtx.fillText(`SCORE: ${score}`, snakeCanvas.width / 2, snakeCanvas.height / 2 + 20);
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
