document.addEventListener('DOMContentLoaded', () => {
    // Global API URL Redirection Mapping for decoupled frontend/backend deployment
    const API_BASE = window.location.port === '3000' ? '' : 'http://localhost:3000';

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
    const shutdownBtn = document.getElementById('sys-shutdown');

    if (rebootBtn) {
        rebootBtn.addEventListener('click', () => {
            toggleStartMenu(false);
            showToast("System wallpaper rebooting...", "info");
            if (typeof initParticles === 'function') {
                initParticles();
            }
        });
    }

    if (shutdownBtn) {
        shutdownBtn.addEventListener('click', () => {
            toggleStartMenu(false);
            showToast("Shutting down system animations. Click restart to restore.", "info");
            document.body.style.transition = 'filter 2s ease';
            document.body.style.filter = 'brightness(0)';
            
            // Re-boot button simulation overlay
            const powerOverlay = document.createElement('div');
            powerOverlay.className = 'power-overlay';
            powerOverlay.style = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: black; z-index: 9999; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 1.5s ease;';
            document.body.appendChild(powerOverlay);
            
            setTimeout(() => {
                powerOverlay.style.opacity = '1';
                const turnOnBtn = document.createElement('button');
                turnOnBtn.textContent = '⏻ Turn On System';
                turnOnBtn.className = 'btn btn-primary';
                turnOnBtn.style = 'font-size: 1.2rem; cursor: pointer;';
                turnOnBtn.addEventListener('click', () => {
                    document.body.style.filter = '';
                    powerOverlay.remove();
                    showToast("SidharthOS rebooted successfully.", "success");
                });
                powerOverlay.appendChild(turnOnBtn);
            }, 2000);
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

    function processTerminalCommand(cmd) {
        // Output prompt echo
        appendTermLine(`<span class="terminal-prompt">visitor@sidharth-os:~$</span> ${cmd}`);

        if (cmd === '') return;

        switch (cmd) {
            case 'help':
                appendTermLine(`
                    <div>Available Commands:</div>
                    <div>- <span class="term-highlight">about</span>: Details on who I am</div>
                    <div>- <span class="term-highlight">skills</span>: Technical skills roster</div>
                    <div>- <span class="term-highlight">projects</span>: View areas of focus</div>
                    <div>- <span class="term-highlight">timeline</span>: Education and certifications</div>
                    <div>- <span class="term-highlight">contact</span>: Access email and contact details</div>
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
                    <div>- <span class="term-highlight">Email:</span> ugsidharth@icloud.com</div>
                    <div>- <span class="term-highlight">Location:</span> Kazhakkoottam, Kerala, India</div>
                `);
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
    \\   _./      OS: SidharthOS v1.0.4 x86_64
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
                if (cmd.startsWith('sudo ')) {
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
        if (vscodeDisplay && vscodeActiveTab) {
            vscodeDisplay.innerHTML = '<span style="color: #888;">Streaming code from server...</span>';
            const extension = fileId === 'resume' ? 'json' : (fileId === 'index' ? 'html' : (fileId === 'script' ? 'js' : 'css'));
            vscodeActiveTab.querySelector('span').textContent = `${fileId}.${extension}`;

            fetch(`${API_BASE}/api/code?file=${fileId}`)
                .then(res => {
                    if (!res.ok) throw new Error('API Code Error');
                    return res.text();
                })
                .then(codeText => {
                    vscodeDisplay.innerHTML = codeText;
                })
                .catch(err => {
                    console.error('Error fetching file code:', err);
                    vscodeDisplay.innerHTML = '<span style="color: red;">Error: Failed to stream source code.</span>';
                });
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
    const refreshBtn = document.getElementById('projects-refresh-btn');
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
            initPortfolioData(); // Reload dynamically from backend
        });
    }

    // 7.7 Embedded Projects Run Viewer (Iframe Browser Back Button)
    const iframeBackBtn = document.getElementById('btn-iframe-back');
    const projectsContainer = document.querySelector('.projects-window-container');
    const iframeContainer = document.querySelector('.projects-iframe-container');
    const projectsIframe = document.getElementById('projects-iframe');
    
    if (iframeBackBtn) {
        iframeBackBtn.addEventListener('click', () => {
            if (projectsIframe && projectsContainer && iframeContainer) {
                projectsIframe.src = 'about:blank'; // stop background loading processes
                iframeContainer.style.display = 'none';
                projectsContainer.style.display = 'block';
            }
        });
    }

    // 8.0 Fetch Portfolio Data and Render Dynamically
    function initPortfolioData() {
        fetch(`${API_BASE}/api/data`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load portfolio database.');
                return res.json();
            })
            .then(data => {
                // Populate Profile
                const nameEl = document.getElementById('prof-name');
                if (nameEl) nameEl.textContent = data.profile.name;
                const tagEl = document.getElementById('prof-tagline');
                if (tagEl) tagEl.textContent = data.profile.tagline;
                
                const metaEl = document.getElementById('prof-meta');
                if (metaEl) {
                    metaEl.innerHTML = `
                        <div class="meta-line">📍 ${data.profile.location}</div>
                        <div class="meta-line">📧 ${data.profile.email}</div>
                    `;
                }
                const socialsEl = document.getElementById('prof-socials');
                if (socialsEl) {
                    socialsEl.innerHTML = `
                        <a href="${data.profile.github}" target="_blank" rel="noopener noreferrer" class="social-link-btn" aria-label="GitHub">GitHub</a>
                        <a href="${data.profile.linkedin}" target="_blank" rel="noopener noreferrer" class="social-link-btn" aria-label="LinkedIn">LinkedIn</a>
                    `;
                }

                // Populate Skills
                const skillsGrid = document.getElementById('skills-os-grid');
                if (skillsGrid) {
                    skillsGrid.innerHTML = '';
                    data.skills.forEach(skill => {
                        const item = document.createElement('div');
                        item.className = 'skill-os-item';
                        item.setAttribute('data-category', skill.category);
                        
                        const span = document.createElement('span');
                        span.textContent = skill.name;
                        item.appendChild(span);
                        skillsGrid.appendChild(item);
                    });
                }

                // Populate Projects
                const projectsGrid = document.getElementById('projects-tech-grid');
                if (projectsGrid) {
                    projectsGrid.innerHTML = '';
                    data.projects.forEach(project => {
                        const card = document.createElement('div');
                        card.className = 'tech-card';
                        card.setAttribute('data-live', project.live ? 'true' : 'false');
                        
                        const ticks = document.createElement('div');
                        ticks.className = 'tech-card-ticks';
                        card.appendChild(ticks);
                        
                        const header = document.createElement('div');
                        header.className = 'tech-card-header';
                        
                        const titleRow = document.createElement('div');
                        titleRow.className = 'tech-card-title-row';
                        
                        const h3 = document.createElement('h3');
                        h3.innerHTML = `<span class="tech-card-num">${project.id}</span> ${project.title}`;
                        titleRow.appendChild(h3);
                        
                        const actions = document.createElement('div');
                        actions.className = 'tech-card-actions';
                        actions.innerHTML = `
                            <a href="${project.code_url}" target="_blank" rel="noopener noreferrer" class="tech-btn btn-code">[CODE]</a>
                            <a href="${project.run_url}" target="_blank" rel="noopener noreferrer" class="tech-btn btn-run">[RUN]</a>
                        `;
                        titleRow.appendChild(actions);
                        header.appendChild(titleRow);
                        card.appendChild(header);
                        
                        const body = document.createElement('div');
                        body.className = 'tech-card-body';
                        
                        const desc = document.createElement('p');
                        desc.className = 'tech-card-desc';
                        desc.textContent = project.desc;
                        body.appendChild(desc);
                        
                        const segBar = document.createElement('div');
                        segBar.className = 'tech-lang-bar';
                        
                        const legend = document.createElement('div');
                        legend.className = 'tech-lang-legend';
                        
                        Object.keys(project.languages).forEach(lang => {
                            const pct = project.languages[lang];
                            const color = project.colors[lang] || '#888';
                            
                            const seg = document.createElement('div');
                            seg.className = 'lang-seg';
                            seg.style.width = pct;
                            seg.style.backgroundColor = color;
                            segBar.appendChild(seg);
                            
                            const legendItem = document.createElement('span');
                            legendItem.className = 'legend-item';
                            legendItem.innerHTML = `<span class="dot" style="background: ${color};"></span> ${lang} <strong>${pct}</strong>`;
                            legend.appendChild(legendItem);
                        });
                        
                        body.appendChild(segBar);
                        body.appendChild(legend);
                        card.appendChild(body);
                        
                        const footer = document.createElement('div');
                        footer.className = 'tech-card-footer';
                        footer.innerHTML = `
                            <div class="dash-separator"></div>
                            <span class="footer-meta">NO_TAG_METADATA_DETECTED</span>
                        `;
                        card.appendChild(footer);
                        
                        projectsGrid.appendChild(card);
                    });

                    // Re-bind interactive controls since elements were created dynamically
                    const liveOnlyCheck = document.getElementById('live-only-check');
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

                    techCards.forEach(card => {
                        card.addEventListener('click', () => {
                            techCards.forEach(c => c.classList.remove('active-card'));
                            card.classList.add('active-card');
                        });
                    });

                    // Re-bind runs button listeners
                    const runButtons = document.querySelectorAll('.btn-run');
                    const iframeContainer = document.querySelector('.projects-iframe-container');
                    const iframeUrlDisplay = document.getElementById('iframe-current-url');
                    const iframeLinkBtn = document.getElementById('iframe-external-link');

                    runButtons.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
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
                }

                // Populate Timeline
                const timelineContainer = document.getElementById('timeline-window-container');
                if (timelineContainer) {
                    timelineContainer.innerHTML = '';
                    data.timeline.forEach(item => {
                        const card = document.createElement('div');
                        card.className = 'timeline-card';
                        card.innerHTML = `
                            <span class="timeline-meta">${item.period}</span>
                            <h4>${item.title}</h4>
                            <p class="timeline-subtitle">${item.institution}</p>
                        `;
                        timelineContainer.appendChild(card);
                    });
                }
            })
            .catch(err => {
                console.error('Error initializing portfolio database:', err);
                showToast('Failed to load system datasets.', 'info');
            });
    }

    // Run dynamic rendering boot
    initPortfolioData();

    // Initialize: Open default windows on boot
    setTimeout(() => {
        openApp('profile');
    }, 800);

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
