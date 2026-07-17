document.addEventListener('DOMContentLoaded', () => {
    // Global API URL Redirection Mapping for decoupled frontend/backend deployment
    const API_BASE = window.location.port === '3500' ? '' : 'http://localhost:3500';

    // BIOS Boot Up Simulation sequence
    const bootScreen = document.getElementById('boot-screen');
    const bootLog = document.getElementById('boot-log');
    const bootProgress = document.getElementById('boot-progress');

    const bootMessages = [
        { text: "INITIALIZING SIDHARTH_OS KERNEL v1.0.6...", type: "info" },
        { text: "ALLOCATING PROCESS MEMORY MEM_BASE=0x7FFF...", type: "default" },
        { text: "ESTABLISHING PERSISTENT DATA DRIVERS... OK", type: "success" },
        { text: "CHECKING FRONTEND PORT LISTEN METRICS... PORT_8500", type: "default" },
        { text: "CHECKING SECURE MESSAGE LOG CONNECTIONS... PORT_3500", type: "default" },
        { text: "MOUNTING CYBERPUNK PARTICLE LAYERS... OK", type: "success" },
        { text: "DECRYPTING PORTFOLIO DATA ARTIFACTS...", type: "info" },
        { text: "DECRYPTING GRABSTER / MEDIAHUB MODULES... SUCCESS", type: "success" },
        { text: "DECRYPTING SIDHARTH_OS DESKTOP INTERFACES... SUCCESS", type: "success" },
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
            showToast("Rebooting SidharthOS...", "info");
            
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
        appendTermLine(`<span class="terminal-prompt">visitor@sidharth-os:~$</span> ${cmd}`);

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
                    <div>- <span class="term-highlight">timeline</span>: Education and certifications</div>
                    <div>- <span class="term-highlight">contact</span>: Access email and contact details</div>
                    <div>- <span class="term-highlight">snake</span>: Play Snake game (Easter Egg)</div>
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
                    <div>- <span class="term-highlight">Languages:</span> Python, C++, C, Bash, HTML/CSS, LaTeX</div>
                    <div>- <span class="term-highlight">IoT & Hardware:</span> ESP32, Raspberry Pi, Arduino, MQTT, Prototyping</div>
                    <div>- <span class="term-highlight">AI/ML & Data:</span> Edge AI, Face Recognition, NumPy, SciPy, Pandas</div>
                `);
                break;
            case 'projects':
                appendTermLine(`
                    <div>Portfolio Projects:</div>
                    <div>1. <span class="term-highlight">Grabster / MediaHub Downloader ⚡</span></div>
                    <div>   - Description: Self-hosted production-ready video/audio downloader powered by yt-dlp.</div>
                    <div>   - Live Demo: <a href="https://novara.ugsidharth.in/" target="_blank" style="color: var(--color-cyan);">novara.ugsidharth.in</a></div>
                    <div>   - Source Code: <a href="https://github.com/UG-SIDHARTH/Grabster-5.0" target="_blank" style="color: var(--color-cyan);">GitHub/Grabster-5.0</a></div>
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
                        <div style="color: #fff; font-weight: 500;">📄 SREEDEV S S - PROFESSIONAL RESUME</div>
                        <div>------------------------------------</div>
                        <div><span class="term-highlight">Name:</span> Sreedev S S</div>
                        <div><span class="term-highlight">Role:</span> Developer, Designer, Editor</div>
                        <div><span class="term-highlight">Email:</span> sreedevss05@gmail.com</div>
                        <div><span class="term-highlight">Web:</span> sreedevss.in</div>
                        <div><span class="term-highlight">Location:</span> Thiruvananthapuram, Kerala, India</div>
                        <div><span class="term-highlight">Experience 1:</span> Intern @ Logixmotion Pvt Ltd</div>
                        <div><span class="term-highlight">Experience 2:</span> Deputy CFA @ FOSS CEAL</div>
                        <div>------------------------------------</div>
                        <div>Command Options:</div>
                        <div>- Type <span class="term-highlight">resume -v</span> or <span class="term-highlight">resume --view</span> to launch CV Viewer</div>
                    `);
                }
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
                appendTermLine(`<div>Launching <span class="term-highlight">Snake.app</span> easter egg game...</div>`);
                openApp('snake');
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
     .---.       visitor@sidharth-portfolio
    /     \\      --------------------------
    \\   _./      OS: SidharthOS v1.0.6 x86_64
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
            showToast(`SidharthOS feeling lucky! Launching ${randomApp}.app...`, 'success');
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

        snakeCtx.fillStyle = '#0c0f17';
        snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

        snakeCtx.strokeStyle = 'rgba(0, 242, 254, 0.04)';
        for (let i = 0; i < snakeCanvas.width; i += gridSize) {
            snakeCtx.beginPath();
            snakeCtx.moveTo(i, 0);
            snakeCtx.lineTo(i, snakeCanvas.height);
            snakeCtx.stroke();
            snakeCtx.beginPath();
            snakeCtx.moveTo(0, i);
            snakeCtx.lineTo(snakeCanvas.width, i);
            snakeCtx.stroke();
        }

        // Draw Food
        snakeCtx.shadowBlur = 8;
        snakeCtx.shadowColor = '#7f00ff';
        snakeCtx.fillStyle = '#7f00ff';
        snakeCtx.fillRect(food.x + 2, food.y + 2, gridSize - 4, gridSize - 4);

        // Draw Snake
        snakeCtx.shadowColor = '#00f2fe';
        snake.forEach((part, idx) => {
            snakeCtx.fillStyle = idx === 0 ? '#ffffff' : '#00f2fe';
            snakeCtx.fillRect(part.x + 1, part.y + 1, gridSize - 2, gridSize - 2);
        });
        
        snakeCtx.shadowBlur = 0;
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
