// Shabdvid - Creative Writing Studio
// Official Website Scripts

document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       INTRO SCREEN
    ========================================== */
    var intro = document.getElementById("intro-screen");
    if (intro) {
        intro.style.display = "none";
        intro.classList.add("hide");
    }

    if (window.location.hash && window.location.hash !== "#home") {
        var target = document.getElementById(window.location.hash.substring(1));
        if (target) {
            target.scrollIntoView({
                behavior: "auto",
                block: "start"
            });
        }
    }

    /* ==========================================
       HEADER SCROLL EFFECT
    ========================================== */
    var header = document.querySelector(".header");
    if (header) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }

    /* ==========================================
       FADE IN ON SCROLL
    ========================================== */
    var revealElements = document.querySelectorAll(
        ".service-card, .collection-card, .creating-card, .contact-item, .contact-form, .info-card, .journey-card"
    );
    if (revealElements.length && "IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        }, {
            threshold: 0.15
        });
        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    }

    /* ==========================================
       ANIMATED COUNTERS
    ========================================== */
    var counters = document.querySelectorAll(".about-stat h3");
    if (counters.length && "IntersectionObserver" in window) {
        counters.forEach(function (counter) {
            var text = counter.innerText;
            var number = parseInt(text, 10);
            if (isNaN(number)) return;
            counter.innerText = "0";
            var current = 0;
            var increment = Math.max(1, Math.ceil(number / 60));
            var updateCounter = function () {
                current += increment;
                if (current >= number) {
                    counter.innerText = text;
                    return;
                }
                counter.innerText = current + (text.includes("+") ? "+" : "%");
                requestAnimationFrame(updateCounter);
            };
            var counterObserver = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    counterObserver.disconnect();
                }
            });
            counterObserver.observe(counter);
        });
    }

    /* ==========================================
       HERO VIDEO SOUND CONTROL
    ========================================== */
    var heroVideo = document.getElementById("heroVideo");
    var heroSection = document.querySelector(".hero");
    var heroSoundBtn = document.getElementById("heroSoundBtn");
    var heroSoundIcon = document.getElementById("heroSoundIcon");
    var heroSoundText = document.getElementById("heroSoundText");

    function updateHeroSoundUI(isActive) {
        if (!heroSoundBtn) return;
        if (isActive) {
            heroSoundBtn.classList.add("is-active");
            if (heroSoundIcon) heroSoundIcon.className = "fa-solid fa-volume-high";
            if (heroSoundText) heroSoundText.textContent = "Audio: Playing";
            heroSoundBtn.setAttribute("title", "Click to mute typewriter sound");
        } else {
            heroSoundBtn.classList.remove("is-active");
            if (heroSoundIcon) heroSoundIcon.className = "fa-solid fa-volume-xmark";
            if (heroSoundText) heroSoundText.textContent = "Typewriter Audio";
            heroSoundBtn.setAttribute("title", "Click to hear authentic typewriter sound");
        }
    }

    function enableHeroAudio() {
        if (!heroVideo) return;
        heroVideo.muted = false;
        heroVideo.volume = 1.0;
        var p = heroVideo.play();
        if (p !== undefined) {
            p.then(function () {
                updateHeroSoundUI(true);
            }).catch(function () {
                heroVideo.muted = true;
                updateHeroSoundUI(false);
            });
        } else {
            updateHeroSoundUI(true);
        }
    }

    function disableHeroAudio() {
        if (!heroVideo) return;
        heroVideo.muted = true;
        updateHeroSoundUI(false);
    }

    function toggleHeroAudio() {
        if (!heroVideo) return;
        if (heroVideo.muted) {
            enableHeroAudio();
        } else {
            disableHeroAudio();
        }
    }

    if (heroVideo) {
        heroVideo.muted = true;
        updateHeroSoundUI(false);

        // Direct Sound Button Click
        if (heroSoundBtn) {
            heroSoundBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                toggleHeroAudio();
            });
        }

        if (heroSection) {
            // Click anywhere on hero background toggles sound
            heroSection.addEventListener("click", function (event) {
                if (event.target.closest("a, button, .scroll-indicator")) return;
                toggleHeroAudio();
            });

            // Desktop Hover un-mutes
            heroSection.addEventListener("pointerenter", function () {
                enableHeroAudio();
            });
            heroSection.addEventListener("pointerleave", function () {
                disableHeroAudio();
            });
        }

        // On first user interaction with the document (click or keypress), attempt un-mute if cursor is on hero
        function onDocumentFirstGesture() {
            window.removeEventListener("click", onDocumentFirstGesture);
            window.removeEventListener("touchstart", onDocumentFirstGesture);
        }
        window.addEventListener("click", onDocumentFirstGesture, { passive: true });
        window.addEventListener("touchstart", onDocumentFirstGesture, { passive: true });

        // Tab visibility management
        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                disableHeroAudio();
                heroVideo.pause();
            } else {
                heroVideo.play().catch(function () {});
            }
        });
    }

    // Services Category Filter Logic
    var svcFilterBtns = document.querySelectorAll('.svc-filter-btn');
    var svcPillarCards = document.querySelectorAll('.service-pillar-card');
    var pillarsGrid = document.querySelector('.services-pillars-grid');

    if (svcFilterBtns.length && svcPillarCards.length && pillarsGrid) {
        svcFilterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                svcFilterBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                var filter = btn.getAttribute('data-filter');

                if (filter === 'all') {
                    // 4 cards in 4 equal parts (2x2 square cards grid)
                    pillarsGrid.classList.remove('is-single-view');
                    svcPillarCards.forEach(function (card) {
                        card.style.display = 'flex';
                        card.classList.remove('active-single');
                    });
                } else {
                    // Single centered rectangular box (લંબચોરસ બોક્સ)
                    pillarsGrid.classList.add('is-single-view');
                    svcPillarCards.forEach(function (card) {
                        if (card.getAttribute('data-category') === filter) {
                            card.style.display = 'flex';
                            card.classList.add('active-single');
                        } else {
                            card.style.display = 'none';
                            card.classList.remove('active-single');
                        }
                    });
                }
            });
        });
    }

    // Directory Drawer Toggle Logic
    var dirToggleBtn = document.getElementById('directoryToggleBtn');
    var dirContent = document.getElementById('servicesDirectory');
    if (dirToggleBtn && dirContent) {
        dirToggleBtn.addEventListener('click', function () {
            dirContent.classList.toggle('open');
            dirToggleBtn.classList.toggle('active');
        });
    }

    // =========================================================
    // SPOTLIGHT OVERLAPPING CLIENTS CAROUSEL CONTROLLER
    // Completely Continuous, Infinite, Seamless Loop with Dynamic Center Spotlight
    // Automatically handles any number of new logos added in the future!
    // =========================================================
    var clientsSlider = document.getElementById('clientsSlider');
    var clientsTrack = document.getElementById('clientsTrack');

    if (clientsSlider && clientsTrack) {
        var baseCards = clientsTrack.querySelectorAll('.client-card');
        var UNIQUE_COUNT = baseCards.length;

        // Auto-duplicate the cards 3 more times (4 sets total) so there is ALWAYS a full runway
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < UNIQUE_COUNT; c++) {
                clientsTrack.appendChild(baseCards[c].cloneNode(true));
            }
        }

        var clientCards = clientsTrack.querySelectorAll('.client-card');
        var totalCards = clientCards.length;
        
        // Continuous linear speed (pixels per frame for silky-smooth motion)
        // Desktop is majestic and smooth; mobile speed is gentle and readable so logos can be comfortably read
        var SPEED_DESKTOP = 0.65;
        var SPEED_MOBILE = 0.28;
        var currentX = 0;
        var oneSetWidth = 0;
        var activeCenterIdx = -1;
        var animId = null;
        var lastTime = 0;

        function measureOneSetWidth() {
            if (totalCards >= 20) {
                var diff = clientCards[UNIQUE_COUNT].offsetLeft - clientCards[0].offsetLeft;
                if (diff > 100) {
                    oneSetWidth = diff;
                }
            }
        }

        function updateSpotlight() {
            var sliderRect = clientsSlider.getBoundingClientRect();
            var sliderCenter = sliderRect.left + (sliderRect.width / 2);
            var closestIdx = -1;
            var minDist = Infinity;

            for (var i = 0; i < totalCards; i++) {
                var card = clientCards[i];
                var cardRect = card.getBoundingClientRect();
                if (cardRect.right < sliderRect.left - 300 || cardRect.left > sliderRect.right + 300) {
                    continue;
                }
                var cardCenter = cardRect.left + (cardRect.width / 2);
                var dist = Math.abs(sliderCenter - cardCenter);
                if (dist < minDist) {
                    minDist = dist;
                    closestIdx = i;
                }
            }

            if (closestIdx !== -1 && closestIdx !== activeCenterIdx) {
                if (activeCenterIdx >= 0 && clientCards[activeCenterIdx]) {
                    clientCards[activeCenterIdx].classList.remove('is-center');
                }
                clientCards[closestIdx].classList.add('is-center');
                activeCenterIdx = closestIdx;
            }
        }

        function animate(timestamp) {
            if (!lastTime) lastTime = timestamp;
            var delta = (timestamp - lastTime) / 16.666;
            if (delta > 3) delta = 1;
            lastTime = timestamp;

            var activeSpeed = (window.innerWidth <= 768) ? SPEED_MOBILE : SPEED_DESKTOP;
            currentX -= activeSpeed * delta;

            // Seamless infinite wrap-around
            if (oneSetWidth > 0 && currentX <= -oneSetWidth) {
                currentX += oneSetWidth;
            }

            clientsTrack.style.transform = 'translate3d(' + currentX + 'px, 0, 0)';
            updateSpotlight();

            animId = requestAnimationFrame(animate);
        }

        function initCarousel() {
            measureOneSetWidth();
            if (oneSetWidth <= 0 && clientCards[0]) {
                oneSetWidth = (clientCards[0].offsetWidth - 36) * UNIQUE_COUNT;
            }
            currentX = 0;
            clientsTrack.style.transform = 'translate3d(0, 0, 0)';
            updateSpotlight();
            if (animId) cancelAnimationFrame(animId);
            lastTime = 0;
            animId = requestAnimationFrame(animate);
        }

        requestAnimationFrame(initCarousel);

        window.addEventListener('load', function () {
            measureOneSetWidth();
        });

        window.addEventListener('resize', function () {
            measureOneSetWidth();
        });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                if (animId) cancelAnimationFrame(animId);
                lastTime = 0;
            } else {
                lastTime = 0;
                animId = requestAnimationFrame(animate);
            }
        });
    }

    // =========================================================

// =========================================================
        // SPOTLIGHT THEATER CONTROLLER (CINEMA REDESIGN)
        // Dynamic Lamp Aiming, Light Beam SVG, Video, Cinema Gallery & Lightbox
        // =========================================================
        var spotlightSection = document.getElementById('creating');
        var spotlightLampBody = document.querySelector('.spotlight-lamp-body');
        var spotlightBoxes = document.querySelectorAll('.spotlight-box');
        var spotlightNavPills = document.querySelectorAll('.spotlight-target-pill');

        if (spotlightSection && spotlightBoxes.length) {
            var currentSpotlightIdx = 0;
            var spotlightTimer = null;
            var isUserInteracting = false;

            function showBeam(idx) {
                if (typeof idx === 'number') {
                    updateSpotlightBeam(idx);
                }
                if (spotlightSection) {
                    spotlightSection.classList.add('beam-active');
                }
            }

            function hideBeam() {
                if (spotlightSection) {
                    spotlightSection.classList.remove('beam-active');
                }
            }

            function updateSpotlightBeam(targetIdx) {
                if (targetIdx < 0 || targetIdx >= spotlightBoxes.length) return;
                currentSpotlightIdx = targetIdx;

                // Update box active state
                spotlightBoxes.forEach(function (box, idx) {
                    var bIdx = parseInt(box.getAttribute('data-index') || idx, 10);
                    if (bIdx === targetIdx) {
                        box.classList.add('is-active');
                    } else {
                        box.classList.remove('is-active');
                    }
                });

                // Update nav pills
                spotlightNavPills.forEach(function (pill, idx) {
                    var pIdx = parseInt(pill.getAttribute('data-target') || idx, 10);
                    if (pIdx === targetIdx) {
                        pill.classList.add('active');
                    } else {
                        pill.classList.remove('active');
                    }
                });

                // Rotate lamp & integrated beam directly towards the target box:
                // Target 0 (Gallery - Left): swings LEFT -> +17.0deg
                // Target 1 (Video - Right Top): swings RIGHT -> -14.0deg
                // Target 2 (News - Right Bottom): swings RIGHT -> -18.0deg
                var angleDeg = 0;
                if (targetIdx === 0) {
                    angleDeg = 17.0; // Swings left towards gallery
                } else if (targetIdx === 1) {
                    angleDeg = -14.0;  // Swings right towards video card
                } else if (targetIdx === 2) {
                    angleDeg = -18.0;  // Swings right towards research card
                }

                if (spotlightLampBody) {
                    spotlightLampBody.style.transform = 'rotate(' + angleDeg.toFixed(1) + 'deg)';
                }
            }

            // Window resize updates active beam geometry
            window.addEventListener('resize', function () {
                updateSpotlightBeam(currentSpotlightIdx);
            });

            // Nav pill interactions: hover & click turn ON light beam and aim lamp
            spotlightNavPills.forEach(function (pill, idx) {
                pill.addEventListener('mouseenter', function () {
                    var t = parseInt(pill.getAttribute('data-target') || idx, 10);
                    if (isNaN(t)) t = idx;
                    showBeam(t);
                    stopAutoCycle();
                });
                pill.addEventListener('click', function () {
                    var t = parseInt(pill.getAttribute('data-target') || idx, 10);
                    if (isNaN(t)) t = idx;
                    showBeam(t);
                    stopAutoCycle();
                });
            });

            // Hover on boxes: turn ON light beam and aim lamp at that box
            spotlightBoxes.forEach(function (box) {
                box.addEventListener('mouseenter', function () {
                    var bIdx = parseInt(box.getAttribute('data-index'), 10);
                    if (!isNaN(bIdx)) {
                        showBeam(bIdx);
                        stopAutoCycle();
                    }
                });
            });

            // When mouse leaves the showcase cards: turn OFF light beam smoothly
            var spotlightGridEl = document.getElementById('spotlightGrid');
            var spotlightNavControlsEl = document.querySelector('.spotlight-target-controls');

            if (spotlightGridEl) {
                spotlightGridEl.addEventListener('mouseleave', function () {
                    hideBeam();
                });
            }
            if (spotlightNavControlsEl) {
                spotlightNavControlsEl.addEventListener('mouseleave', function () {
                    hideBeam();
                });
            }
            if (spotlightSection) {
                spotlightSection.addEventListener('mouseleave', function () {
                    hideBeam();
                });
            }

            // Initial state: position beam geometry, but beam is OFF by default (shines only on hover)
            setTimeout(function () {
                updateSpotlightBeam(0);
                hideBeam();
            }, 300);

            function stopAutoCycle() {
                if (spotlightTimer) {
                    clearInterval(spotlightTimer);
                    spotlightTimer = null;
                }
            }
        }

        // Observe whether the Spotlight section is currently visible in viewport
        // Auto-cycling ONLY runs when the user is actively viewing Spotlight.
        // NEVER hijack the user's scroll when viewing other sections (e.g. Happy Clients, Services)!
        var spotlightSectionEl = document.getElementById('creating');
        var isSpotlightInView = true;
        if ('IntersectionObserver' in window && spotlightSectionEl) {
            var spotlightViewObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    isSpotlightInView = entry.isIntersecting;
                });
            }, { threshold: 0.05 });
            spotlightViewObserver.observe(spotlightSectionEl);
        }

        // ---------------------------------------------------------
        // BOX 1: Hybrid Video Player with High-Def Poster Facade & Live Auto-Cycling
        // Automatically cycles through video items every 5s so the screen feels alive
        // Pauses automatically when user is playing or hovering
        // ---------------------------------------------------------
        var videoPlayer = document.getElementById('spotlightMainVideo');
        var youtubeFrame = document.getElementById('spotlightYoutubeFrame');
        var videoPosterFacade = document.getElementById('videoPosterFacade');
        var videoPosterImg = document.getElementById('videoPosterImg');
        var playlistBtns = document.querySelectorAll('.playlist-btn');
        var videoBadge = document.getElementById('videoBadge');
        var podcastYtLink = document.getElementById('podcastYtLink');
        var podcastSpotifyLink = document.getElementById('podcastSpotifyLink');
        var currentActiveVideoBtn = playlistBtns.length ? playlistBtns[0] : null;
        var btnToggleVideoCycle = document.getElementById('btnToggleVideoCycle');
        var videoCycleText = document.getElementById('videoCycleText');
        var videoBox = document.getElementById('videoBox');

        var isVideoAutoCycling = true;
        var videoCycleIntervalMs = 5000;
        var videoCycleTimer = null;
        var isVideoHovering = false;
        var isVideoPlaying = false;
        var videoUserPauseResumeTimer = null;

        function loadVideoItem(btn, autoPlayNow) {
            if (!btn) return;
            currentActiveVideoBtn = btn;
            playlistBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var type = btn.getAttribute('data-type') || 'video';
            var ytId = btn.getAttribute('data-yt');
            var videoSrc = btn.getAttribute('data-video');
            var posterSrc = btn.getAttribute('data-poster');
            var title = btn.getAttribute('data-title');
            var spotifyUrl = btn.getAttribute('data-spotify');
            var ytUrl = btn.getAttribute('data-ytlink');

            // Update thumbnail image on the facade with smooth cinematic fade
            if (videoPosterImg && posterSrc) {
                if (videoPosterImg.getAttribute('src') !== posterSrc && !autoPlayNow) {
                    videoPosterImg.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                    videoPosterImg.style.opacity = '0.35';
                    videoPosterImg.style.transform = 'scale(0.98)';
                    setTimeout(function () {
                        videoPosterImg.src = posterSrc;
                        videoPosterImg.style.opacity = '1';
                        videoPosterImg.style.transform = 'scale(1)';
                    }, 120);
                } else {
                    videoPosterImg.src = posterSrc;
                }
            }

            // Update Badge
            if (videoBadge && title) {
                videoBadge.innerHTML = '<i class="fa-solid fa-circle-play"></i> ' + title;
            }

            // Update external Spotify / YouTube action links
            if (podcastYtLink) {
                if (ytUrl) {
                    podcastYtLink.href = ytUrl;
                    podcastYtLink.style.display = 'inline-flex';
                } else {
                    podcastYtLink.style.display = 'none';
                }
            }

            if (podcastSpotifyLink) {
                if (spotifyUrl) {
                    podcastSpotifyLink.href = spotifyUrl;
                    podcastSpotifyLink.style.display = 'inline-flex';
                } else {
                    podcastSpotifyLink.style.display = 'none';
                }
            }

            if (autoPlayNow) {
                isVideoPlaying = true;
                startPlayingActiveItem();
            } else {
                // Not playing yet: show thumbnail facade, pause players
                isVideoPlaying = false;
                if (videoPosterFacade) {
                    videoPosterFacade.classList.remove('is-playing');
                }
                if (videoPlayer) {
                    videoPlayer.pause();
                    videoPlayer.style.display = 'none';
                }
                if (youtubeFrame) {
                    youtubeFrame.src = '';
                    youtubeFrame.style.display = 'none';
                }
            }
        }

        function startPlayingActiveItem() {
            if (!currentActiveVideoBtn) return;
            isVideoPlaying = true;
            stopVideoCycleTimer();
            updateVideoCycleUI();

            var type = currentActiveVideoBtn.getAttribute('data-type') || 'video';
            var ytId = currentActiveVideoBtn.getAttribute('data-yt');
            var videoSrc = currentActiveVideoBtn.getAttribute('data-video');
            var posterSrc = currentActiveVideoBtn.getAttribute('data-poster');

            // Hide thumbnail facade
            if (videoPosterFacade) {
                videoPosterFacade.classList.add('is-playing');
            }

            if (type === 'youtube' && ytId) {
                if (videoPlayer) {
                    videoPlayer.pause();
                    videoPlayer.style.display = 'none';
                }
                if (youtubeFrame) {
                    youtubeFrame.style.display = 'block';
                    youtubeFrame.src = 'https://www.youtube-nocookie.com/embed/' + ytId + '?autoplay=1&rel=0';
                }
            } else {
                if (youtubeFrame) {
                    youtubeFrame.src = '';
                    youtubeFrame.style.display = 'none';
                }
                if (videoPlayer) {
                    videoPlayer.style.display = 'block';
                    if (videoSrc) {
                        videoPlayer.src = videoSrc;
                        if (posterSrc) videoPlayer.poster = posterSrc;
                        videoPlayer.load();
                        videoPlayer.play().catch(function () {});
                    }
                }
            }
        }

        function updateVideoCycleUI() {
            if (!btnToggleVideoCycle) return;
            if (isVideoAutoCycling && !isVideoPlaying) {
                btnToggleVideoCycle.classList.remove('paused');
                btnToggleVideoCycle.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin"></i> <span id="videoCycleText">Auto-Cycle: On</span>';
                btnToggleVideoCycle.setAttribute('title', 'Click to pause automatic video rotation');
            } else if (isVideoPlaying) {
                btnToggleVideoCycle.classList.add('paused');
                btnToggleVideoCycle.innerHTML = '<i class="fa-solid fa-film"></i> <span id="videoCycleText">Playing</span>';
                btnToggleVideoCycle.setAttribute('title', 'Video is currently playing');
            } else {
                btnToggleVideoCycle.classList.add('paused');
                btnToggleVideoCycle.innerHTML = '<i class="fa-solid fa-circle-play"></i> <span id="videoCycleText">Auto-Cycle: Paused</span>';
                btnToggleVideoCycle.setAttribute('title', 'Click to resume automatic video rotation');
            }
        }

        function startVideoCycleTimer() {
            stopVideoCycleTimer();
            if (!isVideoAutoCycling || isVideoPlaying) return;
            videoCycleTimer = setInterval(function () {
                if (isVideoHovering || isVideoPlaying || !isVideoAutoCycling) return;
                advanceVideoCycle();
            }, videoCycleIntervalMs);
        }

        function stopVideoCycleTimer() {
            if (videoCycleTimer) {
                clearInterval(videoCycleTimer);
                videoCycleTimer = null;
            }
        }

        function advanceVideoCycle() {
            if (!isSpotlightInView) return; // Do not cycle or touch DOM if user is viewing another section
            if (!playlistBtns || playlistBtns.length <= 1) return;
            var currentIndex = -1;
            for (var i = 0; i < playlistBtns.length; i++) {
                if (playlistBtns[i] === currentActiveVideoBtn) {
                    currentIndex = i;
                    break;
                }
            }
            var nextIndex = (currentIndex + 1) % playlistBtns.length;
            var nextBtn = playlistBtns[nextIndex];
            loadVideoItem(nextBtn, false);
            // Intentionally no scrollIntoView: prevents any jumping or disruption when user scrolls
        }

        // Video playback events
        if (videoPlayer) {
            videoPlayer.addEventListener('play', function () {
                isVideoPlaying = true;
                stopVideoCycleTimer();
                updateVideoCycleUI();
            });
            videoPlayer.addEventListener('ended', function () {
                isVideoPlaying = false;
                updateVideoCycleUI();
                clearTimeout(videoUserPauseResumeTimer);
                videoUserPauseResumeTimer = setTimeout(function () {
                    if (!isVideoPlaying) {
                        advanceVideoCycle();
                        startVideoCycleTimer();
                    }
                }, 3000);
            });
            videoPlayer.addEventListener('pause', function () {
                clearTimeout(videoUserPauseResumeTimer);
                videoUserPauseResumeTimer = setTimeout(function () {
                    if (videoPlayer.paused && !videoPlayer.seeking) {
                        isVideoPlaying = false;
                        updateVideoCycleUI();
                        startVideoCycleTimer();
                    }
                }, 10000);
            });
        }

        // Hover pause on video card
        if (videoBox) {
            videoBox.addEventListener('mouseenter', function () {
                isVideoHovering = true;
            });
            videoBox.addEventListener('mouseleave', function () {
                isVideoHovering = false;
            });
        }

        // Toggle button in playlist header
        if (btnToggleVideoCycle) {
            btnToggleVideoCycle.addEventListener('click', function (e) {
                e.stopPropagation();
                if (isVideoPlaying) {
                    isVideoPlaying = false;
                    loadVideoItem(currentActiveVideoBtn, false);
                    isVideoAutoCycling = true;
                } else {
                    isVideoAutoCycling = !isVideoAutoCycling;
                }
                updateVideoCycleUI();
                if (isVideoAutoCycling) {
                    startVideoCycleTimer();
                } else {
                    stopVideoCycleTimer();
                }
            });
        }

        // Clicking the thumbnail facade or play button starts playback
        if (videoPosterFacade) {
            videoPosterFacade.addEventListener('click', function (e) {
                e.stopPropagation();
                startPlayingActiveItem();
            });
        }

        if (playlistBtns.length) {
            playlistBtns.forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    // When clicked in playlist, switch to item and play immediately
                    loadVideoItem(btn, true);
                    updateVideoCycleUI();
                });
            });
        }

        // Initialize Auto-Cycle
        startVideoCycleTimer();
        updateVideoCycleUI();

        // ---------------------------------------------------------
        // BOX 2: Fieldwork Photo Gallery (34 Archives, All Photos)
        // ---------------------------------------------------------
        var archiveDataEl = document.getElementById('fieldworkArchiveData');
        var galleryProjects = [];
        if (archiveDataEl) {
            try {
                galleryProjects = JSON.parse(archiveDataEl.textContent.trim());
            } catch (err) {
                console.error('Error parsing gallery data:', err);
            }
        }

        var galleryMainPhoto = document.getElementById('galleryMainPhoto');
        var galleryPrev = document.getElementById('galleryPrevBtn');
        var galleryNext = document.getElementById('galleryNextBtn');
        var galleryCounter = document.getElementById('galleryCounter');
        var galleryLoc = document.getElementById('galleryLoc');
        var galleryDate = document.getElementById('galleryDate');
        var galleryPhotoCount = document.getElementById('galleryPhotoCount');
        var galleryTitle = document.getElementById('galleryTitle');
        var galleryDesc = document.getElementById('galleryDesc');
        var galleryThumbStrip = document.getElementById('galleryThumbStrip');
        var galleryFilmstripWrap = document.getElementById('galleryFilmstripWrap');
        var galleryDropdown = document.getElementById('galleryProjectSelect');
        var filmstripIndicator = document.getElementById('filmstripPhotoIndicator');
        var photoFrameTag = document.getElementById('photoFrameTag');
        var galleryPhotoCaption = document.getElementById('galleryPhotoCaption');
        var lightboxPhotoCaption = document.getElementById('lightboxPhotoCaption');

        // Specification Elements
        var specDate = document.getElementById('specDate');
        var specRole = document.getElementById('specRole');
        var specUnit = document.getElementById('specUnit');
        var specFormat = document.getElementById('specFormat');

        // Filmstrip Navigation Buttons
        var fsPrev = document.getElementById('filmstripScrollPrev');
        var fsNext = document.getElementById('filmstripScrollNext');
        var btnOpenLightbox = document.getElementById('btnOpenLightbox');
        var btnTogglePlay = document.getElementById('btnTogglePlay');

        // Lightbox Elements
        var lightbox = document.getElementById('spotlightLightbox');
        var lightboxOverlay = document.getElementById('lightboxOverlay');
        var lightboxClose = document.getElementById('lightboxClose');
        var lightboxMainImg = document.getElementById('lightboxMainImg');
        var lightboxTitle = document.getElementById('lightboxTitle');
        var lightboxCounter = document.getElementById('lightboxCounter');
        var lightboxPrev = document.getElementById('lightboxPrev');
        var lightboxNext = document.getElementById('lightboxNext');
        var lightboxThumbs = document.getElementById('lightboxThumbs');
        var fullscreenBtn = document.getElementById('galleryFullscreenBtn');
        var openBhagvadGeetaBtn = document.getElementById('openBhagvadGeetaBtn');

        if (galleryProjects && galleryProjects.length) {
            var activeProjectIndex = 0;
            var activePhotoIndex = 0;
            var isAutoPlaying = true; // Auto-cycle all 34 folders by default
            var autoPlayIntervalMs = 5000; // 5 seconds per project folder
            var autoPlayTimer = null;
            var isUserHovering = false;
            var pauseResumeTimeout = null;
            var galleryBoxEl = document.getElementById('galleryBox');

            function pad(n) {
                return (n < 10 ? '0' : '') + n;
            }

            function getProjectSpecs(p) {
                if (p.specs) {
                    return {
                        date: p.specs.date || p.date_en || "",
                        role: p.specs.role || "Direction, Field Research & Screenplay",
                        unit: p.specs.unit || "Shabdvid Creative Crew & Lighting Setup",
                        format: p.specs.format || ((p.images ? p.images.length : 1) + " High-Resolution Archival Photos & Master Cut")
                    };
                }
                var name = (p.folder || '').toUpperCase();
                var cam = "4K Digital Cinema & High-Res Stills";
                if (name.indexOf('DANG') !== -1 || name.indexOf('KUTCH') !== -1 || name.indexOf('TAUTE') !== -1) {
                    cam = "4K Rugged Field Rig & Aerial Drone";
                } else if (name.indexOf('ADD') !== -1 || name.indexOf('COMMERCIAL') !== -1 || name.indexOf('FILM SHOOT') !== -1) {
                    cam = "4K Cinema Camera & Studio Lighting Rig";
                } else if (name.indexOf('DOORDARSHAN') !== -1 || name.indexOf('ANCHOR') !== -1) {
                    cam = "Studio Multi-Camera Telecast & Prompter";
                } else if (name.indexOf('GEETA') !== -1 || name.indexOf('BHAGVAD') !== -1 || name.indexOf('SADVIDYA') !== -1) {
                    cam = "Macro Manuscript Rig & Studio Acoustic Unit";
                } else if (name.indexOf('AIFF') !== -1 || name.indexOf('FESTIVAL') !== -1) {
                    cam = "Festival Red Carpet & 4K Digital Screening";
                }

                return {
                    camera: cam,
                    role: "Direction, Field Research & Screenplay",
                    unit: "Shabdvid Creative Crew & Lighting Setup",
                    format: (p.images ? p.images.length : 1) + " High-Resolution Archival Photos & Master Cut"
                };
            }

            function renderProject(projIdx, photoIdx) {
                if (!galleryProjects.length) return;
                if (projIdx < 0) projIdx = galleryProjects.length - 1;
                if (projIdx >= galleryProjects.length) projIdx = 0;
                activeProjectIndex = projIdx;

                var p = galleryProjects[projIdx];
                var pImages = p.images && p.images.length ? p.images : [p.hero_image || 'vishal.jpg'];

                if (photoIdx === undefined || photoIdx < 0) photoIdx = 0;
                if (photoIdx >= pImages.length) photoIdx = pImages.length - 1;
                activePhotoIndex = photoIdx;

                if (lightbox && lightbox.classList.contains('open')) {
                    syncLightbox();
                }

                // Sync dropdown selector
                if (galleryDropdown && galleryDropdown.value !== String(projIdx)) {
                    galleryDropdown.value = String(projIdx);
                }

                // Update Main Photo with smooth transition (stays in place, no window jumping!)
                if (galleryMainPhoto) {
                    var currentSrc = pImages[photoIdx];
                    galleryMainPhoto.style.opacity = '0.4';
                    setTimeout(function () {
                        galleryMainPhoto.src = currentSrc;
                        galleryMainPhoto.style.opacity = '1';
                    }, 100);
                }

                // Update Counter: Photo XX / Total | Archive XX of Total
                if (galleryCounter) {
                    galleryCounter.textContent = 'Photo ' + pad(photoIdx + 1) + ' / ' + pad(pImages.length) +
                        ' | Archive ' + pad(projIdx + 1) + ' of ' + pad(galleryProjects.length);
                }

                // Update Metadata
                if (galleryLoc) {
                    galleryLoc.innerHTML = '<i class="fa-solid fa-location-dot"></i> ' + p.location_en;
                }
                if (galleryDate) {
                    galleryDate.innerHTML = '<i class="fa-regular fa-calendar"></i> ' + p.date_en;
                }
                if (galleryPhotoCount) {
                    galleryPhotoCount.innerHTML = '<i class="fa-solid fa-images"></i> ' + pImages.length + ' Photos in Folder';
                }
                if (galleryTitle) {
                    galleryTitle.textContent = p.title_en;
                }

                // Individual Photo Specific Details
                var photoCaption = p.title_en + ' — Frame ' + pad(photoIdx + 1);
                var photoDesc = p.desc_en;
                if (p.photo_details && p.photo_details[photoIdx]) {
                    var pDet = p.photo_details[photoIdx];
                    if (pDet.caption) photoCaption = pDet.caption;
                    if (pDet.desc) photoDesc = pDet.desc;
                }

                if (photoFrameTag) {
                    photoFrameTag.innerHTML = '<i class="fa-solid fa-camera-retro"></i> Frame ' + pad(photoIdx + 1) + ' of ' + pad(pImages.length);
                }
                if (galleryPhotoCaption) {
                    galleryPhotoCaption.textContent = photoCaption;
                }
                if (galleryDesc) {
                    galleryDesc.textContent = photoDesc;
                }
                if (filmstripIndicator) {
                    filmstripIndicator.textContent = 'Showing ' + (photoIdx + 1) + ' of ' + pImages.length;
                }

                // Update Specifications Grid
                var specs = getProjectSpecs(p);
                if (specDate) specDate.textContent = specs.date || p.date_en;
                if (specRole) specRole.textContent = specs.role;
                if (specUnit) specUnit.textContent = specs.unit;
                if (specFormat) specFormat.textContent = specs.format;

                // Populate Thumbnails Filmstrip with ALL photos of the folder (100% contained)
                if (galleryThumbStrip) {
                    galleryThumbStrip.innerHTML = '';
                    pImages.forEach(function (imgSrc, imgIdx) {
                        var thumbDiv = document.createElement('div');
                        thumbDiv.className = 'g-thumb-item' + (imgIdx === photoIdx ? ' active' : '');
                        thumbDiv.innerHTML = '<img src="' + imgSrc + '" alt="Photo ' + (imgIdx + 1) + '">';
                        thumbDiv.addEventListener('click', function (e) {
                            e.stopPropagation();
                            pauseAutoPlayTemporarily(8000);
                            renderProject(projIdx, imgIdx);
                        });
                        galleryThumbStrip.appendChild(thumbDiv);
                    });

                    // Scroll ONLY the filmstrip container horizontally — NEVER scroll the page window!
                    if (galleryFilmstripWrap) {
                        var activeThumb = galleryThumbStrip.querySelector('.g-thumb-item.active');
                        if (activeThumb) {
                            var targetScroll = activeThumb.offsetLeft - (galleryFilmstripWrap.clientWidth / 2) + (activeThumb.clientWidth / 2);
                            galleryFilmstripWrap.scrollTo({ left: targetScroll, behavior: 'smooth' });
                        }
                    }
                }

                // Sync Lightbox if open
                if (lightbox && lightbox.classList.contains('open')) {
                    syncLightbox();
                }
            }

            // Dropdown change listener
            if (galleryDropdown) {
                galleryDropdown.addEventListener('change', function () {
                    var selectedIdx = parseInt(this.value, 10);
                    if (!isNaN(selectedIdx)) {
                        renderProject(selectedIdx, 0);
                    }
                });
            }

            // Next / Prev click listeners (Navigates cleanly without page jumping)
            if (galleryPrev) {
                galleryPrev.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var p = galleryProjects[activeProjectIndex];
                    var pImages = p.images || [];
                    if (activePhotoIndex > 0) {
                        renderProject(activeProjectIndex, activePhotoIndex - 1);
                    } else {
                        var prevProjIdx = (activeProjectIndex - 1 + galleryProjects.length) % galleryProjects.length;
                        var prevImages = galleryProjects[prevProjIdx].images || [];
                        renderProject(prevProjIdx, Math.max(0, prevImages.length - 1));
                    }
                });
            }

            if (galleryNext) {
                galleryNext.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var p = galleryProjects[activeProjectIndex];
                    var pImages = p.images || [];
                    if (activePhotoIndex < pImages.length - 1) {
                        renderProject(activeProjectIndex, activePhotoIndex + 1);
                    } else {
                        var nextProjIdx = (activeProjectIndex + 1) % galleryProjects.length;
                        renderProject(nextProjIdx, 0);
                    }
                });
            }

            // Filmstrip Scroll Buttons
            if (fsPrev && galleryFilmstripWrap) {
                fsPrev.addEventListener('click', function (e) {
                    e.stopPropagation();
                    galleryFilmstripWrap.scrollBy({ left: -260, behavior: 'smooth' });
                });
            }
            if (fsNext && galleryFilmstripWrap) {
                fsNext.addEventListener('click', function (e) {
                    e.stopPropagation();
                    galleryFilmstripWrap.scrollBy({ left: 260, behavior: 'smooth' });
                });
            }

            // Quick Lightbox Button
            if (btnOpenLightbox) {
                btnOpenLightbox.addEventListener('click', function (e) {
                    e.stopPropagation();
                    openLightbox(activeProjectIndex, activePhotoIndex);
                });
            }

            // ---------------------------------------------------------
            // AUTOMATIC SEQUENTIAL FOLDER ROTATION CONTROLLER
            // Smoothly cycles through all 34 folders so the site feels alive!
            // ---------------------------------------------------------
            function updatePlayButtonUI() {
                if (!btnTogglePlay) return;
                if (isAutoPlaying) {
                    btnTogglePlay.classList.remove('outline');
                    btnTogglePlay.innerHTML = '<i class="fa-solid fa-circle-pause"></i> <span id="slideshowBtnText">Live Auto-Cycle: On</span>';
                    btnTogglePlay.setAttribute('title', 'Click to pause automatic folder changes');
                } else {
                    btnTogglePlay.classList.add('outline');
                    btnTogglePlay.innerHTML = '<i class="fa-solid fa-circle-play"></i> <span id="slideshowBtnText">Live Auto-Cycle: Paused</span>';
                    btnTogglePlay.setAttribute('title', 'Click to resume automatic folder changes');
                }
            }

            function startAutoPlay() {
                stopAutoPlay();
                if (!isAutoPlaying) return;
                autoPlayTimer = setInterval(function () {
                    if (!isSpotlightInView) return; // Do not cycle if user is viewing another section
                    // Do not auto-advance if user is hovering over the gallery card or inspecting
                    if (isUserHovering) return;
                    if (lightbox && lightbox.classList.contains('open')) return;
                    if (document.hidden) return;

                    // Advance sequentially to next project folder (1 -> 2 -> ... -> 34 -> 1)
                    var nextProjIdx = (activeProjectIndex + 1) % galleryProjects.length;
                    renderProject(nextProjIdx, 0);
                }, autoPlayIntervalMs);
            }

            function stopAutoPlay() {
                if (autoPlayTimer) {
                    clearInterval(autoPlayTimer);
                    autoPlayTimer = null;
                }
            }

            function pauseAutoPlayTemporarily(delayMs) {
                stopAutoPlay();
                if (pauseResumeTimeout) clearTimeout(pauseResumeTimeout);
                if (!isAutoPlaying) return;
                pauseResumeTimeout = setTimeout(function () {
                    startAutoPlay();
                }, delayMs || 8000);
            }

            // Hover on gallery box pauses auto-rotation so user can read/inspect comfortably
            if (galleryBoxEl) {
                galleryBoxEl.addEventListener('mouseenter', function () {
                    isUserHovering = true;
                });
                galleryBoxEl.addEventListener('mouseleave', function () {
                    isUserHovering = false;
                });
            }

            // User dropdown selection pauses auto-rotation temporarily
            if (galleryDropdown) {
                galleryDropdown.addEventListener('change', function () {
                    pauseAutoPlayTemporarily(10000);
                });
            }

            // User arrow clicks pause auto-rotation temporarily
            if (galleryPrev) {
                galleryPrev.addEventListener('click', function () {
                    pauseAutoPlayTemporarily(8000);
                });
            }
            if (galleryNext) {
                galleryNext.addEventListener('click', function () {
                    pauseAutoPlayTemporarily(8000);
                });
            }

            // Toggle play/pause button
            if (btnTogglePlay) {
                btnTogglePlay.addEventListener('click', function (e) {
                    e.stopPropagation();
                    isAutoPlaying = !isAutoPlaying;
                    updatePlayButtonUI();
                    if (isAutoPlaying) {
                        startAutoPlay();
                    } else {
                        stopAutoPlay();
                    }
                });
            }

            // Visibility changes (tab hidden/visible)
            document.addEventListener('visibilitychange', function () {
                if (document.hidden) {
                    stopAutoPlay();
                } else if (isAutoPlaying) {
                    startAutoPlay();
                }
            });

            // ---------------------------------------------------------
            // LIGHTBOX MODAL LOGIC
            // ---------------------------------------------------------
            function syncLightbox() {
                var p = galleryProjects[activeProjectIndex];
                var pImages = p.images || [];
                if (lightboxMainImg && pImages.length) {
                    lightboxMainImg.src = pImages[activePhotoIndex];
                }
                if (lightboxTitle) {
                    lightboxTitle.textContent = p.title_en;
                }
                var lbPhotoCaption = p.title_en + ' — Frame ' + pad(activePhotoIndex + 1);
                if (p.photo_details && p.photo_details[activePhotoIndex] && p.photo_details[activePhotoIndex].caption) {
                    lbPhotoCaption = p.photo_details[activePhotoIndex].caption;
                }
                if (lightboxPhotoCaption) {
                    lightboxPhotoCaption.textContent = lbPhotoCaption;
                }
                if (lightboxCounter) {
                    lightboxCounter.textContent = 'Photo ' + (activePhotoIndex + 1) + ' of ' + pImages.length;
                }
                if (lightboxThumbs) {
                    lightboxThumbs.innerHTML = '';
                    pImages.forEach(function (imgSrc, imgIdx) {
                        var tDiv = document.createElement('div');
                        tDiv.className = 'lightbox-thumb-item' + (imgIdx === activePhotoIndex ? ' active' : '');
                        tDiv.innerHTML = '<img src="' + imgSrc + '" alt="Thumbnail">';
                        tDiv.addEventListener('click', function () {
                            renderProject(activeProjectIndex, imgIdx);
                        });
                        lightboxThumbs.appendChild(tDiv);
                    });
                }
            }

            function openLightbox(projIdx, photoIdx) {
                if (projIdx !== undefined) {
                    renderProject(projIdx, photoIdx || 0);
                }
                if (lightbox) {
                    syncLightbox();
                    lightbox.classList.add('open');
                    lightbox.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                }
            }

            function closeLightbox() {
                if (lightbox) {
                    lightbox.classList.remove('open');
                    lightbox.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = '';
                }
            }

            if (fullscreenBtn) {
                fullscreenBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    openLightbox(activeProjectIndex, activePhotoIndex);
                });
            }

            if (galleryMainPhoto) {
                galleryMainPhoto.style.cursor = 'zoom-in';
                galleryMainPhoto.addEventListener('click', function () {
                    openLightbox(activeProjectIndex, activePhotoIndex);
                });
            }

            if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
            if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

            if (lightboxPrev) {
                lightboxPrev.addEventListener('click', function (e) {
                    e.stopPropagation();
                    var p = galleryProjects[activeProjectIndex];
                    var pImages = p.images || [];
                    var newIdx = (activePhotoIndex - 1 + pImages.length) % pImages.length;
                    renderProject(activeProjectIndex, newIdx);
                });
            }

            if (lightboxNext) {
                lightboxNext.addEventListener('click', function (e) {
                    e.stopPropagation();
                    var p = galleryProjects[activeProjectIndex];
                    var pImages = p.images || [];
                    var newIdx = (activePhotoIndex + 1) % pImages.length;
                    renderProject(activeProjectIndex, newIdx);
                });
            }

            // Keyboard navigation for Lightbox
            document.addEventListener('keydown', function (e) {
                if (lightbox && lightbox.classList.contains('open')) {
                    if (e.key === 'Escape') closeLightbox();
                    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
                    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
                }
            });

            // ---------------------------------------------------------
            // CONNECT SHREEMAD BHAGVAD GEETA NEWS BUTTON TO PHOTOS
            // ---------------------------------------------------------
            if (openBhagvadGeetaBtn) {
                openBhagvadGeetaBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Find Shreemad Bhagvad Geeta index
                    var bgIdx = -1;
                    galleryProjects.forEach(function (proj, idx) {
                        if (proj.folder && proj.folder.indexOf('BHAGVAD GEETA') !== -1) {
                            bgIdx = idx;
                        }
                    });

                    if (bgIdx === -1) {
                        bgIdx = parseInt(openBhagvadGeetaBtn.getAttribute('data-target-index') || 27, 10);
                    }

                    // Switch gallery to Bhagvad Geeta and open Lightbox
                    renderProject(bgIdx, 0);

                    // Open lightbox for immediate high-res viewing of all 10 photos
                    setTimeout(function () {
                        openLightbox(bgIdx, 0);
                    }, 200);
                });
            }

            // Render first archive on page load and start live folder rotation
            renderProject(0, 0);
            updatePlayButtonUI();
            startAutoPlay();
        }

    // =========================================================
    // CONTACT FORM - DIRECT EMAIL SUBMISSION HANDLER
    // Delivers project inquiries directly to vishal@shabdvid.com
    // =========================================================
    var contactForm = document.getElementById('contactForm');
    var formStatusAlert = document.getElementById('formStatusAlert');
    var formSubmitBtn = document.getElementById('formSubmitBtn');

    if (contactForm && formSubmitBtn) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            // Button loading state
            var originalBtnContent = formSubmitBtn.innerHTML;
            formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Inquiry...';
            formSubmitBtn.disabled = true;

            var formData = new FormData(contactForm);

            fetch('https://formsubmit.co/ajax/vishal@shabdvid.com', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                formSubmitBtn.innerHTML = originalBtnContent;
                formSubmitBtn.disabled = false;

                if (data && (data.success === 'true' || data.success === true)) {
                    contactForm.reset();
                    if (formStatusAlert) {
                        formStatusAlert.className = 'form-status-alert is-success';
                        formStatusAlert.innerHTML = '<i class="fa-solid fa-circle-check"></i> <div><strong>Thank You! Your inquiry has been sent successfully.</strong><br>We have received your project details and Vishal will review and reach out to you within 24 business hours.</div>';
                        formStatusAlert.style.display = 'flex';
                        formStatusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                        setTimeout(function () {
                            formStatusAlert.style.display = 'none';
                        }, 9000);
                    }
                } else {
                    // Fallback to normal form submit if needed
                    contactForm.submit();
                }
            })
            .catch(function (error) {
                formSubmitBtn.innerHTML = originalBtnContent;
                formSubmitBtn.disabled = false;
                // If network/CORS fails, standard form submit works as seamless fallback
                contactForm.submit();
            });
        });
    }

    // ==========================================
    // MOBILE NAVIGATION DRAWER & TOGGLE
    // ==========================================
    var mobileNavToggle = document.getElementById('mobileNavToggle');
    var mainNavbar = document.getElementById('mainNavbar') || document.querySelector('.navbar');
    var mobileNavBackdrop = document.getElementById('mobileNavBackdrop');

    if (mobileNavToggle && mainNavbar) {
        function toggleMobileNav(e) {
            if (e) e.stopPropagation();
            var isOpen = mobileNavToggle.classList.toggle('nav-open');
            mainNavbar.classList.toggle('nav-active', isOpen);
            if (mobileNavBackdrop) {
                mobileNavBackdrop.classList.toggle('active', isOpen);
            }
            document.body.classList.toggle('mobile-nav-locked', isOpen);
            mobileNavToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }

        function closeMobileNav() {
            mobileNavToggle.classList.remove('nav-open');
            mainNavbar.classList.remove('nav-active');
            if (mobileNavBackdrop) {
                mobileNavBackdrop.classList.remove('active');
            }
            document.body.classList.remove('mobile-nav-locked');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
        }

        mobileNavToggle.addEventListener('click', toggleMobileNav);

        if (mobileNavBackdrop) {
            mobileNavBackdrop.addEventListener('click', closeMobileNav);
        }

        // Close drawer when any nav link is clicked
        var navLinks = mainNavbar.querySelectorAll('a');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                closeMobileNav();
            });
        });

        // Close drawer on ESC key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mainNavbar.classList.contains('nav-active')) {
                closeMobileNav();
            }
        });
    }
});
