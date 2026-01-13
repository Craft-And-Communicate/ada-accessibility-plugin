/**
 * ADA Accessibility Widget JavaScript
 * Designed for seniors and senior living communities
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        storageKey: 'adaAccessibilitySettings',
        position: (typeof adaAccessSettings !== 'undefined' && adaAccessSettings.position) || 'right',
        primaryColor: (typeof adaAccessSettings !== 'undefined' && adaAccessSettings.primaryColor) || '#0066cc'
    };

    // State management
    let state = {
        textSize: 0, // 0 = normal, 1 = large, 2 = larger, 3 = largest
        lineHeight: 0, // 0 = normal, 1 = relaxed, 2 = loose
        letterSpacing: false,
        contrastMode: 'none', // none, dark, light
        dyslexiaFont: false,
        readableFont: false,
        largeCursor: false,
        readingGuide: false,
        readingMask: false,
        highlightLinks: false,
        highlightFocus: false,
        pauseAnimations: false,
        desaturate: false,
        invertColors: false
    };

    // DOM Elements
    let panel, toggle, readingGuideLine, readingMaskTop, readingMaskBottom;

    /**
     * Initialize the widget
     */
    function init() {
        loadState();
        createElements();
        attachEventListeners();
        applyState();
    }

    /**
     * Load saved state from localStorage
     */
    function loadState() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKey);
            if (saved) {
                state = { ...state, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('ADA Accessibility: Could not load saved settings');
        }
    }

    /**
     * Save state to localStorage
     */
    function saveState() {
        try {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
        } catch (e) {
            console.warn('ADA Accessibility: Could not save settings');
        }
    }

    /**
     * Create reading guide elements
     */
    function createReadingGuideElements() {
        // Reading guide line
        readingGuideLine = document.createElement('div');
        readingGuideLine.id = 'ada-reading-guide-line';
        document.body.appendChild(readingGuideLine);

        // Reading mask elements
        readingMaskTop = document.createElement('div');
        readingMaskTop.id = 'ada-reading-mask-top';
        document.body.appendChild(readingMaskTop);

        readingMaskBottom = document.createElement('div');
        readingMaskBottom.id = 'ada-reading-mask-bottom';
        document.body.appendChild(readingMaskBottom);

        // Track mouse for reading guide/mask
        document.addEventListener('mousemove', function(e) {
            if (state.readingGuide) {
                readingGuideLine.style.top = (e.clientY - 20) + 'px';
            }
            if (state.readingMask) {
                const maskHeight = 60;
                readingMaskTop.style.height = Math.max(0, e.clientY - maskHeight) + 'px';
                readingMaskBottom.style.top = (e.clientY + maskHeight) + 'px';
                readingMaskBottom.style.height = (window.innerHeight - e.clientY - maskHeight) + 'px';
            }
        });
    }

    /**
     * Create all widget elements
     */
    function createElements() {
        // Create skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'ada-skip-link';
        skipLink.textContent = 'Skip to Main Content';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Create toggle button
        toggle = document.createElement('button');
        toggle.id = 'ada-accessibility-toggle';
        toggle.className = CONFIG.position;
        toggle.setAttribute('aria-label', 'Open Accessibility Menu');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
            </svg>
        `;
        document.body.appendChild(toggle);

        // Create panel
        panel = document.createElement('div');
        panel.id = 'ada-accessibility-panel';
        panel.className = CONFIG.position;
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Accessibility Settings');
        panel.setAttribute('aria-hidden', 'true');
        panel.innerHTML = createPanelHTML();
        document.body.appendChild(panel);

        // Create reading guide elements
        createReadingGuideElements();
    }

    /**
     * Generate panel HTML
     */
    function createPanelHTML() {
        return `
            <div class="ada-panel-header">
                <h2>Accessibility</h2>
                <button class="ada-close-btn" aria-label="Close accessibility menu">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="ada-panel-content">
                <!-- Text & Reading Section -->
                <div class="ada-feature-section">
                    <h3>Text & Reading</h3>
                    <div class="ada-slider-control">
                        <label>
                            <span>Text Size</span>
                            <span id="ada-text-size-label">Normal</span>
                        </label>
                        <input type="range" id="ada-text-size" min="0" max="3" step="1" value="${state.textSize}"
                               aria-label="Adjust text size">
                    </div>
                    <div class="ada-slider-control">
                        <label>
                            <span>Line Spacing</span>
                            <span id="ada-line-height-label">Normal</span>
                        </label>
                        <input type="range" id="ada-line-height" min="0" max="2" step="1" value="${state.lineHeight}"
                               aria-label="Adjust line spacing">
                    </div>
                    <div class="ada-feature-grid">
                        <button class="ada-feature-btn ${state.letterSpacing ? 'active' : ''}" data-feature="letterSpacing" aria-pressed="${state.letterSpacing}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5H21V7H3V5ZM3 19H21V21H3V19ZM5 11L2 14L5 17V14H19V17L22 14L19 11V14H5V11Z"/></svg>
                            <span>Letter Spacing</span>
                        </button>
                        <button class="ada-feature-btn ${state.dyslexiaFont ? 'active' : ''}" data-feature="dyslexiaFont" aria-pressed="${state.dyslexiaFont}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.93 13.5H14.07L12 6.89L9.93 13.5ZM11.11 3H12.89L18.89 21H16.94L15.74 17H8.26L7.06 21H5.11L11.11 3Z"/></svg>
                            <span>Dyslexia Font</span>
                        </button>
                        <button class="ada-feature-btn ${state.readableFont ? 'active' : ''}" data-feature="readableFont" aria-pressed="${state.readableFont}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4V7H10.5V19H13.5V7H19V4H5Z"/></svg>
                            <span>Readable Font</span>
                        </button>
                    </div>
                </div>

                <!-- Vision Section -->
                <div class="ada-feature-section">
                    <h3>Vision & Colors</h3>
                    <div class="ada-feature-grid">
                        <button class="ada-feature-btn ${state.contrastMode === 'dark' ? 'active' : ''}" data-feature="contrastDark" aria-pressed="${state.contrastMode === 'dark'}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19V5C15.86 5 19 8.14 19 12C19 15.86 15.86 19 12 19Z"/></svg>
                            <span>Dark Contrast</span>
                        </button>
                        <button class="ada-feature-btn ${state.contrastMode === 'light' ? 'active' : ''}" data-feature="contrastLight" aria-pressed="${state.contrastMode === 'light'}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7ZM2 13H4V11H2V13ZM20 13H22V11H20V13ZM11 2V4H13V2H11ZM11 20V22H13V20H11ZM5.64 5.64L4.22 4.22L5.64 5.64L4.22 4.22L5.64 5.64ZM18.36 18.36L19.78 19.78L18.36 18.36ZM19.78 4.22L18.36 5.64L19.78 4.22ZM4.22 19.78L5.64 18.36L4.22 19.78Z"/></svg>
                            <span>Light Contrast</span>
                        </button>
                        <button class="ada-feature-btn ${state.desaturate ? 'active' : ''}" data-feature="desaturate" aria-pressed="${state.desaturate}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"/></svg>
                            <span>Grayscale</span>
                        </button>
                        <button class="ada-feature-btn ${state.invertColors ? 'active' : ''}" data-feature="invertColors" aria-pressed="${state.invertColors}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.66 7.93L12 2.27L6.34 7.93C3.22 11.05 3.22 16.12 6.34 19.24C7.9 20.8 9.95 21.58 12 21.58C14.05 21.58 16.1 20.8 17.66 19.24C20.78 16.12 20.78 11.05 17.66 7.93ZM12 19.59C10.52 19.59 9.04 19.04 7.93 17.93C5.72 15.72 5.72 12.15 7.93 9.93L12 5.86V19.59Z"/></svg>
                            <span>Invert Colors</span>
                        </button>
                    </div>
                </div>

                <!-- Reading Aids Section -->
                <div class="ada-feature-section">
                    <h3>Reading Aids</h3>
                    <div class="ada-feature-grid">
                        <button class="ada-feature-btn ${state.readingGuide ? 'active' : ''}" data-feature="readingGuide" aria-pressed="${state.readingGuide}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5H21V7H3V5ZM3 11H21V13H3V11ZM3 17H21V19H3V17Z"/></svg>
                            <span>Reading Guide</span>
                        </button>
                        <button class="ada-feature-btn ${state.readingMask ? 'active' : ''}" data-feature="readingMask" aria-pressed="${state.readingMask}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"/></svg>
                            <span>Focus Mask</span>
                        </button>
                        <button class="ada-feature-btn ${state.highlightLinks ? 'active' : ''}" data-feature="highlightLinks" aria-pressed="${state.highlightLinks}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7Z"/></svg>
                            <span>Highlight Links</span>
                        </button>
                        <button class="ada-feature-btn ${state.largeCursor ? 'active' : ''}" data-feature="largeCursor" aria-pressed="${state.largeCursor}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.64 21.97C13.14 22.21 12.54 22 12.31 21.5L10.13 16.76L7.62 18.78C7.45 18.92 7.24 19 7.02 19C6.55 19 6.14 18.61 6.14 18.09V1.91C6.14 1.39 6.55 1 7.02 1C7.22 1 7.43 1.08 7.6 1.21L19.08 10.54C19.49 10.87 19.56 11.47 19.25 11.89C19.05 12.18 18.72 12.33 18.38 12.33H14.91L17.05 17.1C17.28 17.6 17.07 18.2 16.57 18.44L13.64 21.97Z"/></svg>
                            <span>Large Cursor</span>
                        </button>
                    </div>
                </div>

                <!-- Navigation Section -->
                <div class="ada-feature-section">
                    <h3>Navigation</h3>
                    <div class="ada-feature-grid">
                        <button class="ada-feature-btn ${state.highlightFocus ? 'active' : ''}" data-feature="highlightFocus" aria-pressed="${state.highlightFocus}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 15H3V19C3 20.1 3.9 21 5 21H9V19H5V15ZM5 5H9V3H5C3.9 3 3 3.9 3 5V9H5V5ZM19 3H15V5H19V9H21V5C21 3.9 20.1 3 19 3ZM19 19H15V21H19C20.1 21 21 20.1 21 19V15H19V19ZM12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8Z"/></svg>
                            <span>Focus Highlight</span>
                        </button>
                        <button class="ada-feature-btn ${state.pauseAnimations ? 'active' : ''}" data-feature="pauseAnimations" aria-pressed="${state.pauseAnimations}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z"/></svg>
                            <span>Pause Animations</span>
                        </button>
                    </div>
                </div>

                <!-- Reset Button -->
                <button class="ada-reset-btn" id="ada-reset-all">
                    Reset All Settings
                </button>
            </div>
            <div class="ada-panel-footer">
                <p>ADA Accessibility Widget by <a href="https://craftandcommunicate.com" target="_blank" rel="noopener" style="color: var(--ada-primary); text-decoration: none; font-weight: 600;">Craft &amp; Communicate</a></p>
            </div>
        `;
    }

    /**
     * Attach event listeners
     */
    function attachEventListeners() {
        // Toggle button
        toggle.addEventListener('click', togglePanel);

        // Close button
        panel.querySelector('.ada-close-btn').addEventListener('click', closePanel);

        // Feature buttons
        panel.querySelectorAll('.ada-feature-btn').forEach(btn => {
            btn.addEventListener('click', handleFeatureClick);
        });

        // Sliders
        document.getElementById('ada-text-size').addEventListener('input', handleTextSizeChange);
        document.getElementById('ada-line-height').addEventListener('input', handleLineHeightChange);

        // Reset button
        document.getElementById('ada-reset-all').addEventListener('click', resetAll);

        // Close on escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && panel.classList.contains('active')) {
                closePanel();
            }
        });

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (panel.classList.contains('active') &&
                !panel.contains(e.target) &&
                !toggle.contains(e.target)) {
                closePanel();
            }
        });

        // Keyboard navigation detection
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('ada-keyboard-nav');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('ada-keyboard-nav');
        });
    }

    /**
     * Toggle panel visibility
     */
    function togglePanel() {
        const isOpen = panel.classList.contains('active');
        if (isOpen) {
            closePanel();
        } else {
            openPanel();
        }
    }

    /**
     * Open panel
     */
    function openPanel() {
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        panel.querySelector('.ada-close-btn').focus();
    }

    /**
     * Close panel
     */
    function closePanel() {
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
    }

    /**
     * Handle feature button clicks
     */
    function handleFeatureClick(e) {
        const btn = e.currentTarget;
        const feature = btn.dataset.feature;

        switch (feature) {
            case 'contrastDark':
                state.contrastMode = state.contrastMode === 'dark' ? 'none' : 'dark';
                break;
            case 'contrastLight':
                state.contrastMode = state.contrastMode === 'light' ? 'none' : 'light';
                break;
            case 'dyslexiaFont':
                state.dyslexiaFont = !state.dyslexiaFont;
                if (state.dyslexiaFont) state.readableFont = false;
                break;
            case 'readableFont':
                state.readableFont = !state.readableFont;
                if (state.readableFont) state.dyslexiaFont = false;
                break;
            default:
                if (state.hasOwnProperty(feature)) {
                    state[feature] = !state[feature];
                }
        }

        saveState();
        applyState();
        updateButtonStates();
    }

    /**
     * Handle text size slider change
     */
    function handleTextSizeChange(e) {
        state.textSize = parseInt(e.target.value);
        saveState();
        applyState();
        updateSliderLabels();
    }

    /**
     * Handle line height slider change
     */
    function handleLineHeightChange(e) {
        state.lineHeight = parseInt(e.target.value);
        saveState();
        applyState();
        updateSliderLabels();
    }

    /**
     * Update slider labels
     */
    function updateSliderLabels() {
        const textSizeLabels = ['Normal', 'Large', 'Larger', 'Largest'];
        const lineHeightLabels = ['Normal', 'Relaxed', 'Loose'];

        document.getElementById('ada-text-size-label').textContent = textSizeLabels[state.textSize];
        document.getElementById('ada-line-height-label').textContent = lineHeightLabels[state.lineHeight];
    }

    /**
     * Update button active states
     */
    function updateButtonStates() {
        panel.querySelectorAll('.ada-feature-btn').forEach(btn => {
            const feature = btn.dataset.feature;
            let isActive = false;

            switch (feature) {
                case 'contrastDark':
                    isActive = state.contrastMode === 'dark';
                    break;
                case 'contrastLight':
                    isActive = state.contrastMode === 'light';
                    break;
                default:
                    isActive = state[feature];
            }

            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive);
        });
    }

    /**
     * Apply current state to the page
     */
    function applyState() {
        const body = document.body;

        // Text size
        body.classList.remove('ada-text-large', 'ada-text-larger', 'ada-text-largest');
        if (state.textSize === 1) body.classList.add('ada-text-large');
        if (state.textSize === 2) body.classList.add('ada-text-larger');
        if (state.textSize === 3) body.classList.add('ada-text-largest');

        // Line height
        body.classList.remove('ada-line-height-relaxed', 'ada-line-height-loose');
        if (state.lineHeight === 1) body.classList.add('ada-line-height-relaxed');
        if (state.lineHeight === 2) body.classList.add('ada-line-height-loose');

        // Letter spacing
        body.classList.toggle('ada-letter-spacing', state.letterSpacing);

        // Contrast modes
        body.classList.remove('ada-contrast-dark', 'ada-contrast-light');
        if (state.contrastMode === 'dark') body.classList.add('ada-contrast-dark');
        if (state.contrastMode === 'light') body.classList.add('ada-contrast-light');

        // Fonts
        body.classList.toggle('ada-dyslexia-font', state.dyslexiaFont);
        body.classList.toggle('ada-readable-font', state.readableFont);

        // Cursor
        body.classList.toggle('ada-large-cursor', state.largeCursor);

        // Reading aids
        body.classList.toggle('ada-reading-guide', state.readingGuide);
        body.classList.toggle('ada-reading-mask', state.readingMask);
        body.classList.toggle('ada-highlight-links', state.highlightLinks);
        body.classList.toggle('ada-highlight-focus', state.highlightFocus);

        // Animations
        body.classList.toggle('ada-pause-animations', state.pauseAnimations);

        // Color filters
        body.classList.toggle('ada-desaturate', state.desaturate);
        body.classList.toggle('ada-invert', state.invertColors);

        // Update slider values
        const textSizeSlider = document.getElementById('ada-text-size');
        const lineHeightSlider = document.getElementById('ada-line-height');
        if (textSizeSlider) textSizeSlider.value = state.textSize;
        if (lineHeightSlider) lineHeightSlider.value = state.lineHeight;

        updateSliderLabels();
        updateButtonStates();
    }

    /**
     * Reset all settings
     */
    function resetAll() {
        state = {
            textSize: 0,
            lineHeight: 0,
            letterSpacing: false,
            contrastMode: 'none',
            dyslexiaFont: false,
            readableFont: false,
            largeCursor: false,
            readingGuide: false,
            readingMask: false,
            highlightLinks: false,
            highlightFocus: false,
            pauseAnimations: false,
            desaturate: false,
            invertColors: false
        };
        saveState();
        applyState();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
