const TOTAL_PAGES = 485;
const IMAGE_BASE_PATH = '../pages/warsh_muthamman_png/page';
const DEFAULT_LEFT_MARGIN = 0.03;
const DEFAULT_RIGHT_MARGIN = 0.97;
const HORIZONTAL_SNAP_THRESHOLD = 0.012;

let currentPage = 1;
let overlayEnabled = localStorage.getItem('warsh_muthamman_overlay') !== 'false'; // default true


// Theme State & Logic
let currentTheme = localStorage.getItem('warsh_muthamman_theme') || 'auto'; // 'auto' | 'light' | 'dark'

function applyTheme() {
    const isSystemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    // Toggle class on documentElement
    if (currentTheme === 'light' || (currentTheme === 'auto' && isSystemLight)) {
        document.documentElement.classList.add('light-theme');
    } else {
        document.documentElement.classList.remove('light-theme');
    }
    
    // Update button icon if it exists in DOM
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        if (currentTheme === 'auto') {
            themeBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 17.93V4.07a8 8 0 0 1 0 15.86z"/></svg>`;
            themeBtn.title = "المظهر: تلقائي (مع النظام)";
        } else if (currentTheme === 'light') {
            themeBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41zm-12.37 12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41z"/></svg>`;
            themeBtn.title = "المظهر: فاتح";
        } else { // 'dark'
            themeBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12.3 2a10 10 0 0 0-1.9 19.8 10 10 0 0 0 11.5-12.3 8.1 8.1 0 0 1-9.6-7.5z"/></svg>`;
            themeBtn.title = "المظهر: داكن";
        }
    }
}

function toggleTheme() {
    if (currentTheme === 'auto') {
        currentTheme = 'light';
    } else if (currentTheme === 'light') {
        currentTheme = 'dark';
    } else {
        currentTheme = 'auto';
    }
    localStorage.setItem('warsh_muthamman_theme', currentTheme);
    applyTheme();
    
    let label = 'تلقائي (مع النظام)';
    if (currentTheme === 'light') label = 'فاتح';
    if (currentTheme === 'dark') label = 'داكن';
    showToast(`تم تغيير المظهر إلى: ${label}`);
}

// Page Background Color Logic
let currentPageBg = localStorage.getItem('warsh_muthamman_page_bg') || '#ffffff';

function applyPageBg(color) {
    document.documentElement.style.setProperty('--page-bg', color);
    document.querySelectorAll('.bg-color-circle').forEach(btn => {
        if (btn.getAttribute('data-color') === color) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Apply theme and page background immediately to prevent layout color flash
applyTheme();
applyPageBg(currentPageBg);

document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    applyPageBg(currentPageBg);
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    
    // Add page background selector listeners
    document.querySelectorAll('.bg-color-circle').forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.getAttribute('data-color');
            currentPageBg = color;
            localStorage.setItem('warsh_muthamman_page_bg', color);
            applyPageBg(color);
            showToast(`تم تغيير خلفية الصفحة`);
        });
    });
});

// Listener for system color scheme changes
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    if (currentTheme === 'auto') {
        applyTheme();
    }
});

// Data State
let currentLayoutData = null;
let currentAyahData = null;
let originalLineBands = null; // To compute offsets properly

// Selection and Drag State
let selectedItem = null; // { type: 'highlight'|'marker', index: number }
let selectedItemOriginals = null; // Storing original values for comparison
let isDragging = false;
let dragMode = 'move';
let dragStartMouseX = 0;
let dragStartMouseY = 0;
let dragStartLeft = 0;
let dragStartRight = 0;
let dragStartCX = 0;
let dragStartCY = 0;
let dragStartLine = 0;
let dragStartImageY = 0;
let dragStartBandTop = 0;
let dragStartBandBottom = 0;

// Undo/redo history for the currently loaded page.
const HISTORY_LIMIT = 100;
let undoStack = [];
let redoStack = [];
let activeHistoryTransaction = null;

// Auto-save debounce timers
let ayahSaveTimeout;
let layoutSaveTimeout;

function autoSaveAyahData() {
    // Auto-save disabled as requested.
}

function autoSaveLayoutData() {
    // Auto-save disabled as requested.
}

const DOM = {
    img: document.getElementById('page-image'),
    pageText: document.getElementById('current-page-text'),
    jumpInput: document.getElementById('jump-input'),
    overlay: document.getElementById('overlay-container'),
    rightPanel: document.getElementById('right-panel'),
    boxInfo: document.getElementById('box-info'),
    hlControls: document.getElementById('highlight-controls'),
    mkControls: document.getElementById('marker-controls'),
    toast: document.getElementById('toast'),
    toggleOverlayBtn: document.getElementById('toggle-overlay-btn'),
    saveAllBtn: document.getElementById('save-all-btn'),
    undoBtn: document.getElementById('undo-btn'),
    redoBtn: document.getElementById('redo-btn')
};

function showToast(msg, isError = false) {
    DOM.toast.textContent = msg;
    DOM.toast.style.background = isError ? '#f44336' : '#4CAF50';
    DOM.toast.style.opacity = 1;
    setTimeout(() => DOM.toast.style.opacity = 0, 3000);
}

function appAlert(message, title = "تنبيه") {
    return new Promise((resolve) => {
        const overlay = document.getElementById('custom-modal-overlay');
        const titleEl = document.getElementById('custom-modal-title');
        const messageEl = document.getElementById('custom-modal-message');
        const okBtn = document.getElementById('custom-modal-ok');
        const cancelBtn = document.getElementById('custom-modal-cancel');
        if (!overlay) { alert(message); resolve(true); return; }
        
        titleEl.textContent = title;
        messageEl.textContent = message;
        cancelBtn.style.display = 'none';
        overlay.style.display = 'flex';
        
        const cleanup = () => {
            overlay.style.display = 'none';
            okBtn.removeEventListener('click', onOk);
        };
        const onOk = () => { cleanup(); resolve(true); };
        okBtn.addEventListener('click', onOk);
    });
}

function appConfirm(message, title = "تأكيد") {
    return new Promise((resolve) => {
        const overlay = document.getElementById('custom-modal-overlay');
        const titleEl = document.getElementById('custom-modal-title');
        const messageEl = document.getElementById('custom-modal-message');
        const okBtn = document.getElementById('custom-modal-ok');
        const cancelBtn = document.getElementById('custom-modal-cancel');
        if (!overlay) { resolve(confirm(message)); return; }
        
        titleEl.textContent = title;
        messageEl.textContent = message;
        cancelBtn.style.display = 'inline-block';
        overlay.style.display = 'flex';
        
        const cleanup = () => {
            overlay.style.display = 'none';
            okBtn.removeEventListener('click', onOk);
            cancelBtn.removeEventListener('click', onCancel);
        };
        const onOk = () => { cleanup(); resolve(true); };
        const onCancel = () => { cleanup(); resolve(false); };
        okBtn.addEventListener('click', onOk);
        cancelBtn.addEventListener('click', onCancel);
    });
}

function cloneData(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
}

function parseNumericInputValue(value, fallback = 0) {
    const normalized = String(value ?? '').trim().replace(/[،,]/g, '.');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function clampUnitValue(value) {
    return Math.min(1, Math.max(0, value));
}

function normalizeHighlightGeometry(highlight) {
    if (!highlight) return;
    highlight.left = clampUnitValue(parseNumericInputValue(highlight.left));
    highlight.right = clampUnitValue(parseNumericInputValue(highlight.right));
}

function normalizeMarkerGeometry(marker) {
    if (!marker) return;
    marker.center_x = clampUnitValue(parseNumericInputValue(marker.center_x));
    marker.center_y = clampUnitValue(parseNumericInputValue(marker.center_y, 0.5));
}

function normalizeAyahGeometry(data = currentAyahData) {
    if (!data) return;
    if (Array.isArray(data.ayah_highlights)) {
        data.ayah_highlights.forEach(normalizeHighlightGeometry);
    }
    if (Array.isArray(data.ayah_markers)) {
        data.ayah_markers.forEach(normalizeMarkerGeometry);
    }
}

function readHistoryInputValues() {
    const ids = [
        'global-y-offset',
        'global-scale',
        'global-height',
        'global-pad-left',
        'global-pad-right',
        'global-first-line-pad',
        'global-last-line-pad'
    ];
    return ids.reduce((values, id) => {
        const el = document.getElementById(id);
        if (el) values[id] = el.value;
        return values;
    }, {});
}

function writeHistoryInputValues(values) {
    Object.entries(values || {}).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
    });
}

function createHistorySnapshot(label = '') {
    if (!currentLayoutData && !currentAyahData) return null;
    return {
        label,
        page: currentPage,
        currentLayoutData: cloneData(currentLayoutData),
        currentAyahData: cloneData(currentAyahData),
        originalLineBands: cloneData(originalLineBands),
        selectedItem: cloneData(selectedItem),
        selectedItemOriginals: cloneData(selectedItemOriginals),
        inputValues: readHistoryInputValues()
    };
}

function snapshotFingerprint(snapshot) {
    if (!snapshot) return '';
    return JSON.stringify({
        currentLayoutData: snapshot.currentLayoutData,
        currentAyahData: snapshot.currentAyahData,
        originalLineBands: snapshot.originalLineBands,
        selectedItem: snapshot.selectedItem,
        inputValues: snapshot.inputValues
    });
}

function updateUndoRedoButtons() {
    const inDrawing = typeof isDrawingMode !== 'undefined' && isDrawingMode;
    const hasDrawingHistory = inDrawing && typeof drawingHistory !== 'undefined' && drawingHistory.length > 1;
    const hasDrawings = typeof hasUnsavedDrawings !== 'undefined' && hasUnsavedDrawings;

    if (DOM.undoBtn) {
        DOM.undoBtn.disabled = inDrawing ? !hasDrawingHistory : (undoStack.length === 0);
    }
    if (DOM.redoBtn) {
        // في وضع الرسم لا يوجد redo للرسم - نعطّله دائماً
        DOM.redoBtn.disabled = inDrawing ? true : (redoStack.length === 0);
    }
    if (DOM.saveAllBtn) {
        DOM.saveAllBtn.disabled = !currentLayoutData && !currentAyahData && !hasDrawings;
    }
}

function resetHistory() {
    undoStack = [];
    redoStack = [];
    activeHistoryTransaction = null;
    updateUndoRedoButtons();
}

function pushUndoSnapshot(label = '') {
    const snapshot = createHistorySnapshot(label);
    if (!snapshot) return;

    const last = undoStack[undoStack.length - 1];
    if (last && snapshotFingerprint(last) === snapshotFingerprint(snapshot)) return;

    undoStack.push(snapshot);
    if (undoStack.length > HISTORY_LIMIT) undoStack.shift();
    redoStack = [];
    updateUndoRedoButtons();
}

function beginHistoryTransaction(label = '') {
    if (activeHistoryTransaction) return;
    pushUndoSnapshot(label);
    activeHistoryTransaction = label || 'edit';
}

function endHistoryTransaction() {
    activeHistoryTransaction = null;
}

function restoreHistorySnapshot(snapshot) {
    if (!snapshot) return;
    currentLayoutData = cloneData(snapshot.currentLayoutData);
    currentAyahData = cloneData(snapshot.currentAyahData);
    originalLineBands = cloneData(snapshot.originalLineBands);
    selectedItem = cloneData(snapshot.selectedItem);
    selectedItemOriginals = cloneData(snapshot.selectedItemOriginals);
    writeHistoryInputValues(snapshot.inputValues);

    if (selectedItem && selectedItem.type === 'highlight' && !currentAyahData?.ayah_highlights?.[selectedItem.index]) {
        selectedItem = null;
        selectedItemOriginals = null;
    }
    if (selectedItem && selectedItem.type === 'marker' && !currentAyahData?.ayah_markers?.[selectedItem.index]) {
        selectedItem = null;
        selectedItemOriginals = null;
    }

    renderBoxes();
    if (selectedItem) openRightPanel();
    else clearRightPanel();
    if (typeof updateLeftPanelSaveButtons === 'function') updateLeftPanelSaveButtons();
    updateUndoRedoButtons();
}

function undoLastChange() {
    // في وضع الرسم: نفذ تراجع الرسم
    if (typeof isDrawingMode !== 'undefined' && isDrawingMode && typeof undoDrawing === 'function') {
        undoDrawing();
        return;
    }
    if (undoStack.length === 0) return;
    const current = createHistorySnapshot('redo');
    const previous = undoStack.pop();
    if (current) redoStack.push(current);
    activeHistoryTransaction = null;
    restoreHistorySnapshot(previous);
    showToast('تم التراجع');
}

function redoLastChange() {
    // في وضع الرسم: لا يوجد redo للرسم حالياً، تجاهل
    if (typeof isDrawingMode !== 'undefined' && isDrawingMode) {
        showToast('الإرجاع غير متاح في وضع الرسم');
        return;
    }
    if (redoStack.length === 0) return;
    const current = createHistorySnapshot('undo');
    const next = redoStack.pop();
    if (current) undoStack.push(current);
    activeHistoryTransaction = null;
    restoreHistorySnapshot(next);
    showToast('تم الإرجاع');
}

async function saveToServer(filepath, content, onSuccessCallback) {
    try {
        const res = await fetch('/api/save-json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filepath, content })
        });
        if (!res.ok) throw new Error('Save failed');
        showToast('تم الحفظ بنجاح');
        if (onSuccessCallback) onSuccessCallback();
        return true;
    } catch (err) {
        console.error(err);
        showToast('خطأ أثناء الحفظ! هل الخادم Node.js يعمل؟', true);
        return false;
    }
}

document.getElementById('toggle-overlay-btn').addEventListener('click', () => {
    overlayEnabled = !overlayEnabled;
    localStorage.setItem('warsh_muthamman_overlay', overlayEnabled);
    DOM.overlay.style.display = overlayEnabled ? 'block' : 'none';
    DOM.toggleOverlayBtn.style.color = overlayEnabled ? '#FF9800' : '#4CAF50';
    if (overlayEnabled) loadOverlayData(currentPage);
});

const savedPage = localStorage.getItem('warsh_muthamman_last_page');
if (savedPage) {
    let parsed = parseInt(savedPage);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= TOTAL_PAGES) currentPage = parsed;
}

function updatePage(page) {
    if (page < 1) page = 1;
    if (page > TOTAL_PAGES) page = TOTAL_PAGES;
    currentPage = page;
    
    const pageStr = String(currentPage).padStart(3, '0');
    DOM.img.src = `${IMAGE_BASE_PATH}${pageStr}.png`;
    if (DOM.pageText) DOM.pageText.textContent = currentPage;
    DOM.jumpInput.value = currentPage; 
    
    localStorage.setItem('warsh_muthamman_last_page', currentPage);
    closeRightPanel();
    
    // Reset left panel inputs
    document.getElementById('global-y-offset').value = 0;
    document.getElementById('global-scale').value = 1.0;
    document.getElementById('global-height').value = "";
    document.getElementById('lines-count-input').value = 15;
    if (typeof updateLeftPanelSaveButtons === 'function') updateLeftPanelSaveButtons();

    if (overlayEnabled) {
        DOM.overlay.style.display = 'block';
        DOM.toggleOverlayBtn.style.color = '#FF9800';
        loadOverlayData(currentPage);
    } else {
        DOM.overlay.style.display = 'none';
        DOM.toggleOverlayBtn.style.color = '#4CAF50';
    }
}

async function loadOverlayData(page) {
    DOM.overlay.innerHTML = '';
    currentLayoutData = null;
    currentAyahData = null;
    originalLineBands = null;
    resetHistory();

    const pageStr = String(page).padStart(3, '0');
    const cacheBust = Date.now();
    const layoutUrl = `../databases/ayahinfo/warsh_muthamman/page_layout_json/page_${pageStr}.json?v=${cacheBust}`;
    const ayahUrl = `../databases/ayahinfo/warsh_muthamman/pages_json/page_${pageStr}.json?v=${cacheBust}`;

    try {
        const [layoutRes, ayahRes] = await Promise.all([
            fetch(layoutUrl, { cache: 'no-store' }),
            fetch(ayahUrl, { cache: 'no-store' })
        ]);
        if (!layoutRes.ok || !ayahRes.ok) throw new Error('Data not found');

        currentLayoutData = await layoutRes.json();
        currentAyahData = await ayahRes.json();
        normalizeAyahGeometry(currentAyahData);
        
        // Deep copy to store original lines for offset computing
        if (currentLayoutData.lineBands) {
            originalLineBands = JSON.parse(JSON.stringify(currentLayoutData.lineBands));
            if (originalLineBands.length > 0) {
                const avgHeight = Math.round(originalLineBands.reduce((sum, b) => sum + (b.bottom - b.top), 0) / originalLineBands.length);
                document.getElementById('global-height-orig').textContent = `الأصلية: ~${avgHeight}`;
                document.getElementById('page-lines-count-orig').textContent = `الأصلية: ${originalLineBands.length}`;
                document.getElementById('lines-count-input').value = originalLineBands.length;
            } else {
                document.getElementById('global-height-orig').textContent = `الأصلية: -`;
                document.getElementById('page-lines-count-orig').textContent = `الأصلية: -`;
                document.getElementById('lines-count-input').value = 15;
            }
        } else {
            document.getElementById('global-height-orig').textContent = `الأصلية: -`;
            document.getElementById('page-lines-count-orig').textContent = `الأصلية: -`;
            document.getElementById('lines-count-input').value = 15;
        }

        renderBoxes();
        resetHistory();
    } catch (err) {
        console.error("Could not load overlay data:", err);
        showToast("تعذر جلب البيانات. هل الخادم يعمل؟", true);
    }
}

/**
 * Maps validation issues/diagnostics to UI element identifiers.
 * 
 * - issue.target.kind === "highlight" matches highlightIndex
 * - issue.target.kind === "marker" matches markerIndex
 * - issue.target.kind === "line" matches line
 * - issue.target.kind === "page" is shown in the panel only (matches nothing visually on canvas)
 */
function doesIssueMatchTarget(issue, kind, identifier) {
    if (!issue || !issue.target) return false;
    
    if (issue.target.kind === 'highlight' && kind === 'highlight') {
        return issue.target.highlightIndex === identifier;
    }
    
    if (issue.target.kind === 'marker' && kind === 'marker') {
        return issue.target.markerIndex === identifier;
    }
    
    if (issue.target.kind === 'line' && kind === 'line') {
        return issue.target.line === identifier;
    }
    
    // Support SAME_LINE_GAP and SAME_LINE_OVERLAP highlightIndex mapping
    if (issue.target.kind === 'line' && kind === 'highlight') {
        return issue.target.prevHighlightIndex === identifier || issue.target.nextHighlightIndex === identifier;
    }
    
    return false;
}

function renderBoxes() {
    DOM.overlay.innerHTML = '';
    if (!currentLayoutData || !currentAyahData) return;

    const imgHeight = currentLayoutData.imageHeight || 2000;
    const lineMap = {};
    
    if (currentLayoutData.lineBands) {
        const padFirstTop = parseInt(document.getElementById('global-first-line-pad').value) || 0;
        const padLastBottom = parseInt(document.getElementById('global-last-line-pad').value) || 0;

        currentLayoutData.lineBands.forEach((b, index) => {
            let top = b.top;
            let bottom = b.bottom;

            if (index === 0) {
                top = Math.max(0, top - padFirstTop);
            }
            if (index === currentLayoutData.lineBands.length - 1) {
                bottom = bottom + padLastBottom;
            }

            lineMap[b.line] = {
                top: top / imgHeight * 100,
                height: (bottom - top) / imgHeight * 100
            };

            // Check if this line has a layout error
            if (typeof currentValidationIssues !== 'undefined' && currentValidationIssues.length > 0) {
                const lineIssues = currentValidationIssues.filter(x => 
                    doesIssueMatchTarget(x, 'line', b.line)
                );
                if (lineIssues.length > 0) {
                    let maxSev = 'suspicious';
                    if (lineIssues.some(x => x.severity === 'fatal')) maxSev = 'fatal';
                    else if (lineIssues.some(x => x.severity === 'warning')) maxSev = 'warning';

                    const bandDiv = document.createElement('div');
                    bandDiv.className = `layout-error-band validation-${maxSev}`;
                    bandDiv.style.top = (top / imgHeight * 100) + '%';
                    bandDiv.style.height = ((bottom - top) / imgHeight * 100) + '%';
                    bandDiv.title = lineIssues.map(x => x.message).join('\n');
                    DOM.overlay.appendChild(bandDiv);
                }
            }
        });
    }

    // Render Highlights
    if (currentAyahData.ayah_highlights) {
        const padLeft = parseNumericInputValue(document.getElementById('global-pad-left').value);
        const padRight = parseNumericInputValue(document.getElementById('global-pad-right').value);

        currentAyahData.ayah_highlights.forEach((h, index) => {
            const band = lineMap[h.line];
            if (band) {
                const div = document.createElement('div');
                div.className = 'highlight-box';
                div.setAttribute('data-highlight-index', index);

                // Check for validation issues on this highlight
                if (typeof currentValidationIssues !== 'undefined' && currentValidationIssues.length > 0) {
                    const highlightIssues = currentValidationIssues.filter(x => 
                        doesIssueMatchTarget(x, 'highlight', index)
                    );
                    if (highlightIssues.length > 0) {
                        let maxSev = 'suspicious';
                        if (highlightIssues.some(x => x.severity === 'fatal')) maxSev = 'fatal';
                        else if (highlightIssues.some(x => x.severity === 'warning')) maxSev = 'warning';
                        div.classList.add(`validation-${maxSev}`);
                    }
                }
                const actualLeft = Math.max(0, h.left - padLeft);
                const actualRight = Math.min(1, h.right + padRight);

                const leftPct = Math.min(actualLeft, actualRight) * 100;
                const rightPct = Math.max(actualLeft, actualRight) * 100;
                const widthPct = rightPct - leftPct;

                div.style.top = band.top + '%';
                div.style.height = band.height + '%';
                div.style.left = leftPct + '%';
                div.style.width = widthPct + '%';
                div.title = `سورة ${h.sura} آية ${h.ayah}`;

                const label = document.createElement('span');
                label.className = 'ayah-label';
                label.textContent = h.ayah;
                div.appendChild(label);
                
                if (selectedItem && selectedItem.type === 'highlight' && selectedItem.index === index) {
                    div.classList.add('selected-box');
                    
                    const edges = ['left', 'right', 'top', 'bottom'];
                    edges.forEach(edge => {
                        const handle = document.createElement('div');
                        handle.className = `box-resize-handle ${edge}`;
                        handle.addEventListener('pointerdown', (e) => {
                            if (e.button !== 0) return; // Only left click
                            e.stopPropagation(); // prevent box pointerdown
                            selectItem('highlight', index);
                            beginHistoryTransaction('resize highlight');
                            isDragging = true;
                            dragMode = `resize-${edge}`;
                            dragStartMouseX = e.clientX;
                            dragStartMouseY = e.clientY;
                            dragStartLeft = h.left;
                            dragStartRight = h.right;
                            
                            const bandObj = currentLayoutData.lineBands.find(b => b.line === h.line);
                            if (bandObj) {
                                dragStartBandTop = bandObj.top;
                                dragStartBandBottom = bandObj.bottom;
                            }
                        });
                        handle.addEventListener('dblclick', (e) => {
                            if (edge !== 'left' && edge !== 'right') return;
                            e.preventDefault();
                            e.stopPropagation();
                            selectItem('highlight', index);
                            pushUndoSnapshot(`snap ${edge} edge to margin`);
                            if (edge === 'left') {
                                h.left = DEFAULT_LEFT_MARGIN;
                            } else {
                                h.right = DEFAULT_RIGHT_MARGIN;
                            }
                            normalizeHighlightGeometry(h);
                            renderBoxes();
                            openRightPanel();
                            autoSaveAyahData();
                        });
                        div.appendChild(handle);
                    });
                    
                    // Add alignment toolbar
                    const toolbar = document.createElement('div');
                    toolbar.className = 'box-toolbar';
                    
                    const btnRight = document.createElement('button');
                    btnRight.innerHTML = '⭲';
                    btnRight.title = 'تمديد للحد الأيمن (Ctrl + سهم يمين)';
                    btnRight.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); });
                    btnRight.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pushUndoSnapshot('snap right edge to margin');
                        h.right = DEFAULT_RIGHT_MARGIN;
                        normalizeHighlightGeometry(h);
                        renderBoxes();
                        openRightPanel();
                        autoSaveAyahData();
                    });

                    const btnFull = document.createElement('button');
                    btnFull.innerHTML = '⭤';
                    btnFull.title = 'تمديد للحدين الأيمن والأيسر (Ctrl + مسافة)';
                    btnFull.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); });
                    btnFull.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pushUndoSnapshot('snap both edges to margins');
                        h.left = DEFAULT_LEFT_MARGIN;
                        h.right = DEFAULT_RIGHT_MARGIN;
                        normalizeHighlightGeometry(h);
                        renderBoxes();
                        openRightPanel();
                        autoSaveAyahData();
                    });

                    const btnLeft = document.createElement('button');
                    btnLeft.innerHTML = '⭰';
                    btnLeft.title = 'تمديد للحد الأيسر (Ctrl + سهم يسار)';
                    btnLeft.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); });
                    btnLeft.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pushUndoSnapshot('snap left edge to margin');
                        h.left = DEFAULT_LEFT_MARGIN;
                        normalizeHighlightGeometry(h);
                        renderBoxes();
                        openRightPanel();
                        autoSaveAyahData();
                    });

                    const btnMinus = document.createElement('button');
                    btnMinus.innerHTML = '-';
                    btnMinus.title = 'إنقاص رقم الآية (-)';
                    btnMinus.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); });
                    btnMinus.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pushUndoSnapshot('decrement ayah number');
                        h.ayah = Math.max(1, h.ayah - 1);
                        renderBoxes();
                        openRightPanel();
                        autoSaveAyahData();
                    });

                    const btnPlus = document.createElement('button');
                    btnPlus.innerHTML = '+';
                    btnPlus.title = 'زيادة رقم الآية (+)';
                    btnPlus.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); });
                    btnPlus.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pushUndoSnapshot('increment ayah number');
                        h.ayah++;
                        renderBoxes();
                        openRightPanel();
                        autoSaveAyahData();
                    });

                    const btnDup = document.createElement('button');
                    btnDup.innerHTML = '⧉';
                    btnDup.title = 'تكرار المربع (Shift+D)';
                    btnDup.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); });
                    btnDup.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pushUndoSnapshot('duplicate highlight box');
                        const newH = JSON.parse(JSON.stringify(h));
                        currentAyahData.ayah_highlights.splice(index + 1, 0, newH);
                        selectItem('highlight', index + 1);
                        renderBoxes();
                        openRightPanel();
                        autoSaveAyahData();
                    });

                    const btnDel = document.createElement('button');
                    btnDel.innerHTML = '🗑';
                    btnDel.title = 'حذف المربع (Delete)';
                    btnDel.style.color = '#ff5252';
                    btnDel.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); });
                    btnDel.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pushUndoSnapshot('delete highlight box');
                        currentAyahData.ayah_highlights.splice(index, 1);
                        selectedItem = null;
                        renderBoxes();
                        openRightPanel();
                        autoSaveAyahData();
                    });

                    const btnLineUp = document.createElement('button');
                    btnLineUp.innerHTML = '↑';
                    btnLineUp.title = 'نقل للسطر السابق (لأعلى)';
                    btnLineUp.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); });
                    btnLineUp.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pushUndoSnapshot('move highlight to previous line');
                        h.line = Math.max(1, h.line - 1);
                        renderBoxes();
                        openRightPanel();
                        autoSaveAyahData();
                    });

                    const btnLineDown = document.createElement('button');
                    btnLineDown.innerHTML = '↓';
                    btnLineDown.title = 'نقل للسطر التالي (لأسفل)';
                    btnLineDown.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); });
                    btnLineDown.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pushUndoSnapshot('move highlight to next line');
                        h.line = Math.min(currentLayoutData.lineBands.length, h.line + 1);
                        renderBoxes();
                        openRightPanel();
                        autoSaveAyahData();
                    });

                    toolbar.appendChild(btnDel);
                    toolbar.appendChild(btnDup);
                    toolbar.appendChild(btnLineUp);
                    toolbar.appendChild(btnLineDown);
                    toolbar.appendChild(btnMinus);
                    toolbar.appendChild(btnPlus);
                    toolbar.appendChild(btnRight);
                    toolbar.appendChild(btnFull);
                    toolbar.appendChild(btnLeft);
                    div.appendChild(toolbar);
                }

                div.addEventListener('pointerdown', (e) => {
                    if (e.button !== 0) return; // Only left click
                    e.stopPropagation();
                    selectItem('highlight', index);
                    beginHistoryTransaction('move highlight');
                    isDragging = true;
                    dragMode = 'move';
                    dragStartMouseX = e.clientX;
                    dragStartMouseY = e.clientY;
                    dragStartLeft = h.left;
                    dragStartRight = h.right;
                });
                DOM.overlay.appendChild(div);
            }
        });
    }

    // Render Markers
    if (currentAyahData.ayah_markers) {
        currentAyahData.ayah_markers.forEach((m, index) => {
            const band = lineMap[m.line];
            if (band) {
                const div = document.createElement('div');
                div.className = 'marker-box';
                div.setAttribute('data-marker-index', index);

                // Check for validation issues on this marker
                if (typeof currentValidationIssues !== 'undefined' && currentValidationIssues.length > 0) {
                    const markerIssues = currentValidationIssues.filter(x => 
                        doesIssueMatchTarget(x, 'marker', index)
                    );
                    if (markerIssues.length > 0) {
                        let maxSev = 'suspicious';
                        if (markerIssues.some(x => x.severity === 'fatal')) maxSev = 'fatal';
                        else if (markerIssues.some(x => x.severity === 'warning')) maxSev = 'warning';
                        div.classList.add(`validation-${maxSev}`);
                    }
                }
                const cx = m.center_x * 100;
                const cy = band.top + ((m.center_y || 0.5) * band.height);

                div.style.left = cx + '%';
                div.style.top = cy + '%';
                div.style.width = '2.5%';
                div.style.aspectRatio = '1 / 1';
                div.title = `نهاية الآية ${m.ayah}`;
                
                const label = document.createElement('span');
                label.className = 'ayah-label marker-label';
                label.textContent = m.ayah;
                div.appendChild(label);
                
                if (selectedItem && selectedItem.type === 'marker' && selectedItem.index === index) {
                    div.classList.add('selected-box');
                    
                    const toolbar = document.createElement('div');
                    toolbar.className = 'box-toolbar';

                    const btnMinus = document.createElement('button');
                    btnMinus.innerHTML = '-';
                    btnMinus.title = 'إنقاص رقم الآية (-)';
                    btnMinus.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); });
                    btnMinus.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pushUndoSnapshot('decrement ayah number');
                        m.ayah = Math.max(1, m.ayah - 1);
                        renderBoxes();
                        openRightPanel();
                        autoSaveAyahData();
                    });

                    const btnPlus = document.createElement('button');
                    btnPlus.innerHTML = '+';
                    btnPlus.title = 'زيادة رقم الآية (+)';
                    btnPlus.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); });
                    btnPlus.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pushUndoSnapshot('increment ayah number');
                        m.ayah++;
                        renderBoxes();
                        openRightPanel();
                        autoSaveAyahData();
                    });

                    const btnDup = document.createElement('button');
                    btnDup.innerHTML = '⧉';
                    btnDup.title = 'تكرار الدائرة (Shift+D)';
                    btnDup.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); });
                    btnDup.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pushUndoSnapshot('duplicate marker');
                        const newM = JSON.parse(JSON.stringify(m));
                        currentAyahData.ayah_markers.splice(index + 1, 0, newM);
                        selectItem('marker', index + 1);
                        renderBoxes();
                        openRightPanel();
                        autoSaveAyahData();
                    });

                    const btnDel = document.createElement('button');
                    btnDel.innerHTML = '🗑';
                    btnDel.title = 'حذف الدائرة (Delete)';
                    btnDel.style.color = '#ff5252';
                    btnDel.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); });
                    btnDel.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pushUndoSnapshot('delete marker');
                        currentAyahData.ayah_markers.splice(index, 1);
                        selectedItem = null;
                        renderBoxes();
                        openRightPanel();
                        autoSaveAyahData();
                    });

                    const btnLineUp = document.createElement('button');
                    btnLineUp.innerHTML = '↑';
                    btnLineUp.title = 'نقل للسطر السابق (لأعلى)';
                    btnLineUp.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); });
                    btnLineUp.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pushUndoSnapshot('move marker to previous line');
                        m.line = Math.max(1, m.line - 1);
                        renderBoxes();
                        openRightPanel();
                        autoSaveAyahData();
                    });

                    const btnLineDown = document.createElement('button');
                    btnLineDown.innerHTML = '↓';
                    btnLineDown.title = 'نقل للسطر التالي (لأسفل)';
                    btnLineDown.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); });
                    btnLineDown.addEventListener('click', (e) => {
                        e.stopPropagation();
                        pushUndoSnapshot('move marker to next line');
                        m.line = Math.min(currentLayoutData.lineBands.length, m.line + 1);
                        renderBoxes();
                        openRightPanel();
                        autoSaveAyahData();
                    });

                    toolbar.appendChild(btnDel);
                    toolbar.appendChild(btnDup);
                    toolbar.appendChild(btnLineUp);
                    toolbar.appendChild(btnLineDown);
                    toolbar.appendChild(btnMinus);
                    toolbar.appendChild(btnPlus);
                    div.appendChild(toolbar);
                }

                div.addEventListener('pointerdown', (e) => {
                    if (e.button !== 0) return;
                    e.stopPropagation();
                    selectItem('marker', index);
                    beginHistoryTransaction('move marker');
                    isDragging = true;
                    dragStartMouseX = e.clientX;
                    dragStartMouseY = e.clientY;
                    dragStartCX = m.center_x;
                    dragStartCY = m.center_y || 0.5;
                    dragStartLine = m.line;
                    dragStartImageY = getMarkerImageY(m);
                });
                DOM.overlay.appendChild(div);
            }
        });
    }
}

// Selection Logic
function selectItem(type, index) {
    // Keep original values when first selected
    if (!selectedItem || selectedItem.type !== type || selectedItem.index !== index) {
        if (type === 'highlight') {
            const h = currentAyahData.ayah_highlights[index];
            selectedItemOriginals = { left: h.left, right: h.right, sura: h.sura, ayah: h.ayah, line: h.line };
        } else if (type === 'marker') {
            const m = currentAyahData.ayah_markers[index];
            selectedItemOriginals = { center_x: m.center_x, center_y: m.center_y || 0.5, line: m.line, sura: m.sura, ayah: m.ayah };
        }
    }
    selectedItem = { type, index };
    renderBoxes(); // Refresh to show selection outline
    openRightPanel();
}

// Drag events on document
document.addEventListener('pointermove', (e) => {
    if (!isDragging || !selectedItem || !currentAyahData) return;
    
    const imgRect = DOM.img.getBoundingClientRect();
    const deltaX = (e.clientX - dragStartMouseX) / imgRect.width;
    
    if (selectedItem.type === 'highlight') {
        const h = currentAyahData.ayah_highlights[selectedItem.index];
        if (dragMode === 'move') {
            h.left = dragStartLeft + deltaX;
            h.right = dragStartRight + deltaX;
        } else if (dragMode === 'resize-left') {
            h.left = dragStartLeft + deltaX;
        } else if (dragMode === 'resize-right') {
            h.right = dragStartRight + deltaX;
        } else if (dragMode === 'resize-top' || dragMode === 'resize-bottom') {
            const band = currentLayoutData.lineBands.find(b => b.line === h.line);
            if (band) {
                const deltaY = (e.clientY - dragStartMouseY) / imgRect.height * currentLayoutData.imageHeight;
                const bandIndex = currentLayoutData.lineBands.indexOf(band);
                const shiftFollowing = document.getElementById('shift-following-lines') && document.getElementById('shift-following-lines').checked;
                const preventOverlap = document.getElementById('prevent-overlap') && document.getElementById('prevent-overlap').checked;
                const snapEnabled = shouldSnapHighlightEdges();
                
                if (dragMode === 'resize-top') {
                    let newTop = Math.round(dragStartBandTop + deltaY);
                    if (!shiftFollowing) {
                        const prevBand = currentLayoutData.lineBands[bandIndex - 1];
                        if (prevBand) {
                            if (snapEnabled && Math.abs(newTop - prevBand.bottom) <= 15) newTop = prevBand.bottom;
                            if (preventOverlap && newTop < prevBand.bottom) newTop = prevBand.bottom;
                        }
                    }
                    if (preventOverlap && newTop >= band.bottom - 5) newTop = band.bottom - 5;
                    
                    const shiftDelta = newTop - band.top;
                    band.top = newTop;
                    if (shiftFollowing) shiftPrecedingLines(bandIndex, shiftDelta);
                } else if (dragMode === 'resize-bottom') {
                    let newBottom = Math.round(dragStartBandBottom + deltaY);
                    if (!shiftFollowing) {
                        const nextBand = currentLayoutData.lineBands[bandIndex + 1];
                        if (nextBand) {
                            if (snapEnabled && Math.abs(newBottom - nextBand.top) <= 15) newBottom = nextBand.top;
                            if (preventOverlap && newBottom > nextBand.top) newBottom = nextBand.top;
                        }
                    }
                    if (preventOverlap && newBottom <= band.top + 5) newBottom = band.top + 5;
                    
                    const shiftDelta = newBottom - band.bottom;
                    band.bottom = newBottom;
                    if (shiftFollowing) shiftFollowingLines(bandIndex, shiftDelta);
                }
            }
        }
        applyHighlightMagneticSnap(h, selectedItem.index, dragMode);
        
        const preventOverlap = document.getElementById('prevent-overlap') && document.getElementById('prevent-overlap').checked;
        if (preventOverlap && (dragMode === 'resize-left' || dragMode === 'resize-right' || dragMode === 'move')) {
            if (dragMode === 'move') {
                const adjacentLeft = currentAyahData.ayah_highlights.filter(oh => oh.line === h.line && oh.right <= dragStartLeft + 0.0001 && oh !== h);
                const adjacentRight = currentAyahData.ayah_highlights.filter(oh => oh.line === h.line && oh.left >= dragStartRight - 0.0001 && oh !== h);
                const maxLeftBound = adjacentLeft.length > 0 ? Math.max(...adjacentLeft.map(oh => oh.right)) : 0;
                const minRightBound = adjacentRight.length > 0 ? Math.min(...adjacentRight.map(oh => oh.left)) : 1;
                
                let width = h.right - h.left;
                if (h.left < maxLeftBound) {
                    h.left = maxLeftBound;
                    h.right = h.left + width;
                }
                if (h.right > minRightBound) {
                    h.right = minRightBound;
                    h.left = h.right - width;
                }
            } else if (dragMode === 'resize-left') {
                const adjacentHighlights = currentAyahData.ayah_highlights.filter(oh => oh.line === h.line && oh.right <= dragStartLeft + 0.0001 && oh !== h);
                if (adjacentHighlights.length > 0) {
                    const maxRight = Math.max(...adjacentHighlights.map(oh => oh.right));
                    if (h.left < maxRight) h.left = maxRight;
                }
                if (h.left > h.right - 0.002) h.left = h.right - 0.002;
            } else if (dragMode === 'resize-right') {
                const adjacentHighlights = currentAyahData.ayah_highlights.filter(oh => oh.line === h.line && oh.left >= dragStartRight - 0.0001 && oh !== h);
                if (adjacentHighlights.length > 0) {
                    const minLeft = Math.min(...adjacentHighlights.map(oh => oh.left));
                    if (h.right > minLeft) h.right = minLeft;
                }
                if (h.right < h.left + 0.002) h.right = h.left + 0.002;
            }
        }
        
        normalizeHighlightGeometry(h);
    } else if (selectedItem.type === 'marker') {
        const m = currentAyahData.ayah_markers[selectedItem.index];
        const oldLine = m.line;
        const oldCenterX = m.center_x;
        
        // Keyboard modifier constraints
        const lockVertical = e.shiftKey && !e.ctrlKey; // Shift alone -> horizontal only
        const lockHorizontal = e.shiftKey && e.ctrlKey; // Ctrl+Shift -> vertical only
        
        if (lockHorizontal) {
            m.center_x = dragStartCX;
        } else {
            m.center_x = clampUnitValue(dragStartCX + deltaX);
        }
        
        if (lockVertical) {
            m.line = dragStartLine;
            m.center_y = dragStartCY;
        } else {
            const deltaYImage = (e.clientY - dragStartMouseY) / imgRect.height * currentLayoutData.imageHeight;
            setMarkerPositionFromImageY(m, dragStartImageY + deltaYImage);
        }
        normalizeMarkerGeometry(m);

        if (oldLine !== m.line) {
            syncMarkerLineChange(m, oldLine, oldCenterX);
        }
        if (typeof syncHighlightWithMarker === 'function') {
            syncHighlightWithMarker(m, { allowCreateNext: shouldCreateNextHighlightOnMarkerMove() });
        }
    }
    renderBoxes();
    openRightPanel(); // refresh inputs
});

document.addEventListener('pointerup', () => {
    if (isDragging) {
        const wasMarkerPreview = selectedItem && selectedItem.type === 'marker';
        isDragging = false;
        if (wasMarkerPreview) {
            // Marker dragging is a live preview only. Persist it explicitly with
            // the small save button or the main ayah save button.
        } else if (selectedItem && selectedItem.type === 'highlight' && (dragMode === 'resize-top' || dragMode === 'resize-bottom')) {
            autoSaveLayoutData();
        } else {
            autoSaveAyahData();
        }
        dragMode = 'move';
        endHistoryTransaction();
        
        // Trigger validation on drag end (live edit)
        setTimeout(validateCurrentPage, 50);
    }
});

function openRightPanel() {
    if (!selectedItem || !currentAyahData) {
        clearRightPanel();
        return;
    }

    const adjSection = document.getElementById('ayah-adjustment-section');
    if (adjSection) adjSection.style.display = 'block';

    const btnSave = document.getElementById('save-ayah-btn');
    btnSave.disabled = false;
    btnSave.style.opacity = 1;
    btnSave.style.cursor = 'pointer';
    const deleteHighlightBtn = document.getElementById('delete-highlight-btn');
    if (deleteHighlightBtn) {
        deleteHighlightBtn.disabled = selectedItem.type !== 'highlight';
    }

    const badge = document.getElementById('save-status-badge');
    badge.style.background = "";
    badge.style.color = "";
    badge.style.border = "";
    
    if (selectedItem.type === 'highlight') {
        const h = currentAyahData.ayah_highlights[selectedItem.index];
        
        document.getElementById('meta-type').textContent = "تظليل آية";
        if (document.activeElement !== document.getElementById('meta-sura')) document.getElementById('meta-sura').value = h.sura;
        if (document.activeElement !== document.getElementById('meta-ayah')) document.getElementById('meta-ayah').value = h.ayah;
        if (document.activeElement !== document.getElementById('meta-line')) document.getElementById('meta-line').value = h.line;

        document.getElementById('highlight-value-fields').style.display = 'flex';
        document.getElementById('marker-value-fields').style.display = 'none';

        // Input values
        if (document.activeElement !== document.getElementById('hl-left')) {
            document.getElementById('hl-left').value = h.left;
        }
        if (document.activeElement !== document.getElementById('hl-right')) {
            document.getElementById('hl-right').value = h.right;
        }
        
        // Line top/bottom inputs
        let isTopChanged = false;
        let isBottomChanged = false;
        const band = currentLayoutData.lineBands.find(b => b.line === h.line);
        if (band) {
            if (document.activeElement !== document.getElementById('hl-line-top')) {
                document.getElementById('hl-line-top').value = band.top;
            }
            if (document.activeElement !== document.getElementById('hl-line-bottom')) {
                document.getElementById('hl-line-bottom').value = band.bottom;
            }
            
            const origBand = originalLineBands ? originalLineBands.find(b => b.line === h.line) : band;
            document.getElementById('line-top-orig').textContent = origBand ? origBand.top : band.top;
            document.getElementById('line-top-curr').textContent = band.top;
            document.getElementById('line-bottom-orig').textContent = origBand ? origBand.bottom : band.bottom;
            document.getElementById('line-bottom-curr').textContent = band.bottom;
            
            // Calculate heights (Bottom - Top)
            const origHeight = origBand ? (origBand.bottom - origBand.top) : (band.bottom - band.top);
            const currHeight = band.bottom - band.top;
            document.getElementById('line-height-orig').textContent = origHeight;
            document.getElementById('line-height-curr').textContent = currHeight;

            isTopChanged = origBand && origBand.top !== band.top;
            isBottomChanged = origBand && origBand.bottom !== band.bottom;
        }

        // Compare values
        const origLeft = selectedItemOriginals ? selectedItemOriginals.left : h.left;
        const origRight = selectedItemOriginals ? selectedItemOriginals.right : h.right;
        document.getElementById('hl-left-orig').textContent = origLeft.toFixed(4);
        document.getElementById('hl-left-curr').textContent = h.left.toFixed(4);
        document.getElementById('hl-right-orig').textContent = origRight.toFixed(4);
        document.getElementById('hl-right-curr').textContent = h.right.toFixed(4);

        // Update badge state
        const origSura = selectedItemOriginals ? selectedItemOriginals.sura : h.sura;
        const origAyah = selectedItemOriginals ? selectedItemOriginals.ayah : h.ayah;
        const origLine = selectedItemOriginals ? selectedItemOriginals.line : h.line;
        
        document.getElementById('meta-sura-orig').textContent = origSura;
        document.getElementById('meta-sura-curr').textContent = h.sura;
        document.getElementById('meta-ayah-orig').textContent = origAyah;
        document.getElementById('meta-ayah-curr').textContent = h.ayah;
        document.getElementById('meta-line-orig').textContent = origLine;
        document.getElementById('meta-line-curr').textContent = h.line;

        const isSuraChanged = h.sura !== origSura;
        const isAyahChanged = h.ayah !== origAyah;
        const isLineChangedMeta = h.line !== origLine;

        const isLeftChanged = Math.abs(h.left - origLeft) > 0.00001;
        const isRightChanged = Math.abs(h.right - origRight) > 0.00001;
        const isChanged = isLeftChanged || isRightChanged || isTopChanged || isBottomChanged || isSuraChanged || isAyahChanged || isLineChangedMeta;
        
        if (isChanged) {
            badge.textContent = "غير محفوظ ⚠️";
            badge.className = "badge badge-unsaved";
        } else {
            badge.textContent = "تم الحفظ ✓";
            badge.className = "badge badge-saved";
        }

        // Update inline save buttons
        const btnSaveLeft = document.getElementById('save-hl-left');
        const btnSaveRight = document.getElementById('save-hl-right');
        const btnSaveTop = document.getElementById('save-hl-line-top');
        const btnSaveBottom = document.getElementById('save-hl-line-bottom');
        
        if (isLeftChanged) {
            btnSaveLeft.className = "save-inline-btn unsaved";
            btnSaveLeft.title = "تغيير غير محفوظ - انقر للحفظ";
        } else {
            btnSaveLeft.className = "save-inline-btn saved";
            btnSaveLeft.title = "تم الحفظ";
        }
        if (isRightChanged) {
            btnSaveRight.className = "save-inline-btn unsaved";
            btnSaveRight.title = "تغيير غير محفوظ - انقر للحفظ";
        } else {
            btnSaveRight.className = "save-inline-btn saved";
            btnSaveRight.title = "تم الحفظ";
        }
        if (isTopChanged) {
            btnSaveTop.className = "save-inline-btn unsaved";
            btnSaveTop.title = "تغيير غير محفوظ - انقر للحفظ";
        } else {
            btnSaveTop.className = "save-inline-btn saved";
            btnSaveTop.title = "تم الحفظ";
        }
        if (isBottomChanged) {
            btnSaveBottom.className = "save-inline-btn unsaved";
            btnSaveBottom.title = "تغيير غير محفوظ - انقر للحفظ";
        } else {
            btnSaveBottom.className = "save-inline-btn saved";
            btnSaveBottom.title = "تم الحفظ";
        }

    } else if (selectedItem.type === 'marker') {
        const m = currentAyahData.ayah_markers[selectedItem.index];
        
        document.getElementById('meta-type').textContent = "علامة نهاية آية";
        if (document.activeElement !== document.getElementById('meta-sura')) document.getElementById('meta-sura').value = m.sura;
        if (document.activeElement !== document.getElementById('meta-ayah')) document.getElementById('meta-ayah').value = m.ayah;
        if (document.activeElement !== document.getElementById('meta-line')) document.getElementById('meta-line').value = m.line;

        document.getElementById('highlight-value-fields').style.display = 'none';
        document.getElementById('marker-value-fields').style.display = 'flex';

        // Input values
        if (document.activeElement !== document.getElementById('mk-cx')) {
            document.getElementById('mk-cx').value = m.center_x;
        }
        if (document.activeElement !== document.getElementById('mk-cy')) {
            document.getElementById('mk-cy').value = m.center_y || 0.5;
        }
        if (document.activeElement !== document.getElementById('mk-line')) {
            document.getElementById('mk-line').value = m.line;
        }
        const mkLineInput = document.getElementById('mk-line');
        if (currentLayoutData && currentLayoutData.lineBands) {
            mkLineInput.min = 1;
            mkLineInput.max = currentLayoutData.lineBands.length;
        }

        // Compare values
        const origCX = selectedItemOriginals ? selectedItemOriginals.center_x : m.center_x;
        const origCY = selectedItemOriginals ? selectedItemOriginals.center_y : (m.center_y || 0.5);
        const origLine = selectedItemOriginals ? selectedItemOriginals.line : m.line;
        const currCY = m.center_y || 0.5;

        document.getElementById('mk-cx-orig').textContent = origCX.toFixed(4);
        document.getElementById('mk-cx-curr').textContent = m.center_x.toFixed(4);
        document.getElementById('mk-cy-orig').textContent = origCY.toFixed(4);
        document.getElementById('mk-cy-curr').textContent = currCY.toFixed(4);
        document.getElementById('mk-line-orig').textContent = origLine;
        document.getElementById('mk-line-curr').textContent = m.line;

        const origSura = selectedItemOriginals ? selectedItemOriginals.sura : m.sura;
        const origAyah = selectedItemOriginals ? selectedItemOriginals.ayah : m.ayah;

        document.getElementById('meta-sura-orig').textContent = origSura;
        document.getElementById('meta-sura-curr').textContent = m.sura;
        document.getElementById('meta-ayah-orig').textContent = origAyah;
        document.getElementById('meta-ayah-curr').textContent = m.ayah;
        document.getElementById('meta-line-orig').textContent = origLine;
        document.getElementById('meta-line-curr').textContent = m.line;

        const isSuraChanged = m.sura !== origSura;
        const isAyahChanged = m.ayah !== origAyah;

        // Update badge state
        const isCXChanged = Math.abs(m.center_x - origCX) > 0.00001;
        const isCYChanged = Math.abs(currCY - origCY) > 0.00001;
        const isLineChanged = m.line !== origLine;
        const isChanged = isCXChanged || isCYChanged || isLineChanged || isSuraChanged || isAyahChanged;

        if (isChanged) {
            badge.textContent = "غير محفوظ ⚠️";
            badge.className = "badge badge-unsaved";
        } else {
            badge.textContent = "تم الحفظ ✓";
            badge.className = "badge badge-saved";
        }

        // Update inline save buttons
        const btnSaveCX = document.getElementById('save-mk-cx');
        const btnSaveCY = document.getElementById('save-mk-cy');
        const btnSaveLine = document.getElementById('save-mk-line');
        if (isCXChanged) {
            btnSaveCX.className = "save-inline-btn unsaved";
            btnSaveCX.title = "تغيير غير محفوظ - انقر للحفظ";
        } else {
            btnSaveCX.className = "save-inline-btn saved";
            btnSaveCX.title = "تم الحفظ";
        }
        if (isCYChanged) {
            btnSaveCY.className = "save-inline-btn unsaved";
            btnSaveCY.title = "تغيير غير محفوظ - انقر للحفظ";
        } else {
            btnSaveCY.className = "save-inline-btn saved";
            btnSaveCY.title = "تم الحفظ";
        }
        if (isLineChanged) {
            btnSaveLine.className = "save-inline-btn unsaved";
            btnSaveLine.title = "تغيير غير محفوظ - انقر للحفظ";
        } else {
            btnSaveLine.className = "save-inline-btn saved";
            btnSaveLine.title = "تم الحفظ";
        }

        // Meta fields
        const isSuraChangedMeta = selectedItem.type === 'highlight' ? currentAyahData.ayah_highlights[selectedItem.index].sura !== (selectedItemOriginals ? selectedItemOriginals.sura : currentAyahData.ayah_highlights[selectedItem.index].sura) : m.sura !== (selectedItemOriginals ? selectedItemOriginals.sura : m.sura);
        const isAyahChangedMeta = selectedItem.type === 'highlight' ? currentAyahData.ayah_highlights[selectedItem.index].ayah !== (selectedItemOriginals ? selectedItemOriginals.ayah : currentAyahData.ayah_highlights[selectedItem.index].ayah) : m.ayah !== (selectedItemOriginals ? selectedItemOriginals.ayah : m.ayah);
        const isLineChangedMeta = selectedItem.type === 'highlight' ? currentAyahData.ayah_highlights[selectedItem.index].line !== (selectedItemOriginals ? selectedItemOriginals.line : currentAyahData.ayah_highlights[selectedItem.index].line) : m.line !== (selectedItemOriginals ? selectedItemOriginals.line : m.line);

        const btnSaveMetaSura = document.getElementById('save-meta-sura');
        const btnSaveMetaAyah = document.getElementById('save-meta-ayah');
        const btnSaveMetaLine = document.getElementById('save-meta-line');

        if (isSuraChangedMeta) {
            btnSaveMetaSura.className = "save-inline-btn unsaved";
            btnSaveMetaSura.title = "تغيير غير محفوظ - انقر للحفظ";
        } else {
            btnSaveMetaSura.className = "save-inline-btn saved";
            btnSaveMetaSura.title = "تم الحفظ";
        }
        if (isAyahChangedMeta) {
            btnSaveMetaAyah.className = "save-inline-btn unsaved";
            btnSaveMetaAyah.title = "تغيير غير محفوظ - انقر للحفظ";
        } else {
            btnSaveMetaAyah.className = "save-inline-btn saved";
            btnSaveMetaAyah.title = "تم الحفظ";
        }
        if (isLineChangedMeta) {
            btnSaveMetaLine.className = "save-inline-btn unsaved";
            btnSaveMetaLine.title = "تغيير غير محفوظ - انقر للحفظ";
        } else {
            btnSaveMetaLine.className = "save-inline-btn saved";
            btnSaveMetaLine.title = "تم الحفظ";
        }
    }
}

function clearRightPanel() {
    const adjSection = document.getElementById('ayah-adjustment-section');
    if (adjSection) adjSection.style.display = 'none';

    document.getElementById('meta-type').textContent = "-";
    document.getElementById('meta-sura').value = "";
    document.getElementById('meta-ayah').value = "";
    document.getElementById('meta-line').value = "";

    const badge = document.getElementById('save-status-badge');
    badge.textContent = "لا يوجد اختيار";
    badge.className = "badge";
    badge.style.background = "rgba(255, 255, 255, 0.05)";
    badge.style.color = "#aaa";
    badge.style.border = "1px solid rgba(255, 255, 255, 0.1)";

    // Hide value fields when nothing is selected
    document.getElementById('highlight-value-fields').style.display = 'none';
    document.getElementById('marker-value-fields').style.display = 'none';

    document.getElementById('hl-left').value = "";
    document.getElementById('hl-right').value = "";
    document.getElementById('hl-line-top').value = "";
    document.getElementById('hl-line-bottom').value = "";
    document.getElementById('mk-cx').value = "";
    document.getElementById('mk-cy').value = "";
    document.getElementById('mk-line').value = "";

    // Reset comparison texts
    document.getElementById('hl-left-orig').textContent = "-";
    document.getElementById('hl-left-curr').textContent = "-";
    document.getElementById('hl-right-orig').textContent = "-";
    document.getElementById('hl-right-curr').textContent = "-";
    document.getElementById('mk-cx-orig').textContent = "-";
    document.getElementById('mk-cx-curr').textContent = "-";
    document.getElementById('mk-cy-orig').textContent = "-";
    document.getElementById('mk-cy-curr').textContent = "-";
    document.getElementById('mk-line-orig').textContent = "-";
    document.getElementById('mk-line-curr').textContent = "-";
    document.getElementById('meta-sura-orig').textContent = "-";
    document.getElementById('meta-sura-curr').textContent = "-";
    document.getElementById('meta-ayah-orig').textContent = "-";
    document.getElementById('meta-ayah-curr').textContent = "-";
    document.getElementById('meta-line-orig').textContent = "-";
    document.getElementById('meta-line-curr').textContent = "-";
    document.getElementById('line-height-orig').textContent = "-";
    document.getElementById('line-height-curr').textContent = "-";

    const ids = ['save-hl-left', 'save-hl-right', 'save-hl-line-top', 'save-hl-line-bottom', 'save-mk-cx', 'save-mk-cy', 'save-mk-line', 'save-meta-sura', 'save-meta-ayah', 'save-meta-line'];
    ids.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.className = "save-inline-btn saved";
            btn.title = "لا يوجد اختيار";
        }
    });

    const btnSave = document.getElementById('save-ayah-btn');
    btnSave.disabled = true;
    btnSave.style.opacity = 0.5;
    btnSave.style.cursor = 'not-allowed';

    const deleteHighlightBtn = document.getElementById('delete-highlight-btn');
    if (deleteHighlightBtn) deleteHighlightBtn.disabled = true;
}

function closeRightPanel() {
    selectedItem = null;
    selectedItemOriginals = null;
    renderBoxes();
    clearRightPanel();
}

document.getElementById('close-right-panel').addEventListener('click', closeRightPanel);
DOM.img.addEventListener('click', closeRightPanel); // clicking image deselects

// Meta inputs (Sura, Ayah, Line)
document.getElementById('meta-sura').addEventListener('input', (e) => {
    if (selectedItem) {
        const val = parseInt(e.target.value) || 1;
        if (selectedItem.type === 'highlight') {
            currentAyahData.ayah_highlights[selectedItem.index].sura = val;
        } else {
            currentAyahData.ayah_markers[selectedItem.index].sura = val;
        }
        renderBoxes();
        openRightPanel();
    }
});
document.getElementById('meta-ayah').addEventListener('input', (e) => {
    if (selectedItem) {
        const val = parseInt(e.target.value) || 1;
        if (selectedItem.type === 'highlight') {
            currentAyahData.ayah_highlights[selectedItem.index].ayah = val;
        } else {
            currentAyahData.ayah_markers[selectedItem.index].ayah = val;
        }
        renderBoxes();
        openRightPanel();
    }
});
document.getElementById('meta-line').addEventListener('input', (e) => {
    if (selectedItem) {
        const val = parseInt(e.target.value) || 1;
        if (selectedItem.type === 'highlight') {
            currentAyahData.ayah_highlights[selectedItem.index].line = val;
        } else {
            const m = currentAyahData.ayah_markers[selectedItem.index];
            const oldLine = m.line;
            const oldCenterX = m.center_x;
            m.line = val;
            if (oldLine !== m.line) {
                syncMarkerLineChange(m, oldLine, oldCenterX);
            }
            if (typeof syncHighlightWithMarker === 'function') {
                syncHighlightWithMarker(m, { allowCreateNext: shouldCreateNextHighlightOnMarkerMove() });
            }
            document.getElementById('mk-line').value = m.line;
        }
        renderBoxes();
        openRightPanel();
    }
});

document.getElementById('hl-left').addEventListener('input', (e) => {
    if (selectedItem && selectedItem.type === 'highlight') {
        currentAyahData.ayah_highlights[selectedItem.index].left = clampUnitValue(parseNumericInputValue(e.target.value));
        renderBoxes();
        openRightPanel();
    }
});
document.getElementById('hl-right').addEventListener('input', (e) => {
    if (selectedItem && selectedItem.type === 'highlight') {
        currentAyahData.ayah_highlights[selectedItem.index].right = clampUnitValue(parseNumericInputValue(e.target.value));
        renderBoxes();
        openRightPanel();
    }
});

// Highlight Line Layout Tweaks
document.getElementById('hl-line-top').addEventListener('input', (e) => {
    if (selectedItem && selectedItem.type === 'highlight') {
        const h = currentAyahData.ayah_highlights[selectedItem.index];
        const band = currentLayoutData.lineBands.find(b => b.line === h.line);
        if (band) {
            band.top = parseInt(e.target.value) || 0;
            renderBoxes();
            openRightPanel();
        }
    }
});
document.getElementById('hl-line-bottom').addEventListener('input', (e) => {
    if (selectedItem && selectedItem.type === 'highlight') {
        const h = currentAyahData.ayah_highlights[selectedItem.index];
        const band = currentLayoutData.lineBands.find(b => b.line === h.line);
        if (band) {
            band.bottom = parseInt(e.target.value) || 0;
            renderBoxes();
            openRightPanel();
        }
    }
});

// Trigger save on layout blur/change
document.getElementById('hl-line-top').addEventListener('change', autoSaveLayoutData);
document.getElementById('hl-line-bottom').addEventListener('change', autoSaveLayoutData);

document.getElementById('mk-cx').addEventListener('input', (e) => {
    if (selectedItem && selectedItem.type === 'marker') {
        const m = currentAyahData.ayah_markers[selectedItem.index];
        m.center_x = clampUnitValue(parseNumericInputValue(e.target.value));
        if (typeof syncHighlightWithMarker === 'function') {
            syncHighlightWithMarker(m, { allowCreateNext: shouldCreateNextHighlightOnMarkerMove() });
        }
        renderBoxes();
        openRightPanel();
    }
});
document.getElementById('mk-cy').addEventListener('input', (e) => {
    if (selectedItem && selectedItem.type === 'marker') {
        currentAyahData.ayah_markers[selectedItem.index].center_y = clampUnitValue(parseNumericInputValue(e.target.value));
        renderBoxes();
        openRightPanel();
    }
});

document.getElementById('mk-line').addEventListener('input', (e) => {
    if (selectedItem && selectedItem.type === 'marker') {
        const m = currentAyahData.ayah_markers[selectedItem.index];
        const oldLine = m.line;
        const oldCenterX = m.center_x;
        const maxLine = currentLayoutData && currentLayoutData.lineBands
            ? currentLayoutData.lineBands.length
            : 1;
        m.line = Math.min(maxLine, Math.max(1, parseInt(e.target.value) || 1));
        e.target.value = m.line;
        if (oldLine !== m.line) {
            syncMarkerLineChange(m, oldLine, oldCenterX);
        }
        if (typeof syncHighlightWithMarker === 'function') {
            syncHighlightWithMarker(m, { allowCreateNext: shouldCreateNextHighlightOnMarkerMove() });
        }
        document.getElementById('meta-line').textContent = m.line;
        renderBoxes();
        openRightPanel();
    }
});

function attachInputHistory(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('focus', () => beginHistoryTransaction(`edit ${id}`));
        el.addEventListener('blur', endHistoryTransaction);
        el.addEventListener('change', endHistoryTransaction);
    });
}

attachInputHistory([
    'hl-left',
    'hl-right',
    'hl-line-top',
    'hl-line-bottom',
    'mk-cx',
    'mk-cy',
    'mk-line',
    'meta-sura',
    'meta-ayah',
    'meta-line',
    'global-y-offset',
    'global-scale',
    'global-height',
    'global-pad-left',
    'global-pad-right',
    'global-first-line-pad',
    'global-last-line-pad'
]);

function getMarkerImageY(marker) {
    if (!currentLayoutData || !currentLayoutData.lineBands) return 0;
    const band = currentLayoutData.lineBands.find(b => b.line === marker.line);
    if (!band) return 0;
    const centerY = marker.center_y || 0.5;
    return band.top + (centerY * (band.bottom - band.top));
}

function setMarkerPositionFromImageY(marker, imageY) {
    const band = findLineBandForImageY(imageY);
    if (!band) return;

    marker.line = band.line;
    const height = Math.max(1, band.bottom - band.top);
    marker.center_y = Math.min(0.98, Math.max(0.02, (imageY - band.top) / height));
}

function findLineBandForImageY(imageY) {
    if (!currentLayoutData || !currentLayoutData.lineBands || currentLayoutData.lineBands.length === 0) return null;

    const containing = currentLayoutData.lineBands.find(b => imageY >= b.top && imageY <= b.bottom);
    if (containing) return containing;

    return currentLayoutData.lineBands
        .slice()
        .sort((a, b) => {
            const distanceA = Math.min(Math.abs(imageY - a.top), Math.abs(imageY - a.bottom));
            const distanceB = Math.min(Math.abs(imageY - b.top), Math.abs(imageY - b.bottom));
            return distanceA - distanceB;
        })[0];
}

function shouldCreateNextHighlightOnMarkerMove() {
    const checkbox = document.getElementById('sync-create-next-highlight');
    return Boolean(checkbox && checkbox.checked);
}

function shouldRenumberFollowingHighlights() {
    const checkbox = document.getElementById('renumber-following-highlights');
    return Boolean(checkbox && checkbox.checked);
}

function shouldSnapHighlightEdges() {
    const checkbox = document.getElementById('snap-highlight-edges');
    return Boolean(checkbox && checkbox.checked);
}

function collectHorizontalSnapTargets(highlight, highlightIndex) {
    const targets = [0, DEFAULT_LEFT_MARGIN, DEFAULT_RIGHT_MARGIN, 1];
    if (!currentAyahData || !highlight) return targets;

    if (Array.isArray(currentAyahData.ayah_markers)) {
        currentAyahData.ayah_markers
            .filter(m => m.line === highlight.line)
            .forEach(m => targets.push(clampUnitValue(parseNumericInputValue(m.center_x))));
    }

    if (Array.isArray(currentAyahData.ayah_highlights)) {
        currentAyahData.ayah_highlights.forEach((h, index) => {
            if (index === highlightIndex || h.line !== highlight.line) return;
            targets.push(clampUnitValue(parseNumericInputValue(h.left)));
            targets.push(clampUnitValue(parseNumericInputValue(h.right)));
        });
    }

    return [...new Set(targets.map(t => Number(t.toFixed(6))))];
}

function snapUnitValue(value, targets, threshold = HORIZONTAL_SNAP_THRESHOLD) {
    let bestValue = value;
    let bestDistance = threshold;
    targets.forEach(target => {
        const distance = Math.abs(value - target);
        if (distance <= bestDistance) {
            bestDistance = distance;
            bestValue = target;
        }
    });
    return bestValue;
}

function applyHighlightMagneticSnap(highlight, highlightIndex, mode) {
    if (!shouldSnapHighlightEdges() || !highlight) return;

    const targets = collectHorizontalSnapTargets(highlight, highlightIndex);
    if (mode === 'resize-left') {
        highlight.left = snapUnitValue(highlight.left, targets);
    } else if (mode === 'resize-right') {
        highlight.right = snapUnitValue(highlight.right, targets);
    } else if (mode === 'move') {
        const snappedLeft = snapUnitValue(highlight.left, targets);
        const leftDelta = snappedLeft - highlight.left;
        const snappedRight = snapUnitValue(highlight.right, targets);
        const rightDelta = snappedRight - highlight.right;

        if (Math.abs(leftDelta) > 0 && Math.abs(leftDelta) <= Math.abs(rightDelta || Infinity)) {
            highlight.left += leftDelta;
            highlight.right += leftDelta;
        } else if (Math.abs(rightDelta) > 0) {
            highlight.left += rightDelta;
            highlight.right += rightDelta;
        }
    }
}

function compareHighlightsReadingOrder(a, b) {
    if (a.line !== b.line) return a.line - b.line;
    const rightA = Math.max(a.left, a.right);
    const rightB = Math.max(b.left, b.right);
    if (Math.abs(rightA - rightB) > 0.000001) return rightB - rightA;
    return Math.min(a.left, a.right) - Math.min(b.left, b.right);
}

function renumberHighlightsFromIndex(startIndex, delta, sura) {
    if (!currentAyahData || !Array.isArray(currentAyahData.ayah_highlights)) return;
    for (let index = startIndex; index < currentAyahData.ayah_highlights.length; index++) {
        const h = currentAyahData.ayah_highlights[index];
        if (h.sura !== sura) continue;
        const nextAyah = h.ayah + delta;
        if (nextAyah < 1) continue;
        h.ayah = nextAyah;
        if (h.source !== 'manual_marker_sync' && !String(h.source || '').includes('renumbered')) {
            h.source = `${h.source || 'manual'}_renumbered`;
        }
    }
}

// Sync Highlight With Marker
function syncHighlightWithMarker(m, options = {}) {
    const syncCheckbox = document.getElementById('sync-marker-highlight');
    const syncNextCheckbox = document.getElementById('sync-next-ayah-highlight');
    const allowCreateNext = options.allowCreateNext === true;
    const shouldSyncNext = Boolean(syncNextCheckbox && syncNextCheckbox.checked) || allowCreateNext;
    
    // The text is RTL. The end of the ayah text is on the left side (h.left).
    // 1. Sync the left boundary of the current ayah highlight on the same line
    if (syncCheckbox && syncCheckbox.checked) {
        const currentHighlight = currentAyahData.ayah_highlights.find(h => 
            h.sura === m.sura && h.ayah === m.ayah && h.line === m.line
        ) || createCurrentHighlightOnLine(m);
        if (currentHighlight) {
            currentHighlight.left = clampHighlightBoundary(m.center_x, currentHighlight.right, 'left');
        }
    }

    // 2. Sync the boundary of the next ayah highlight on the same line.
    // In RTL page coordinates, the next ayah segment that starts after the
    // marker is visually to the marker's left, so the boundary touching the
    // marker is that segment's right edge.
    if (shouldSyncNext) {
        const nextHighlight = findNextHighlightOnLine(m) || (allowCreateNext ? createNextHighlightOnLine(m) : null);
        if (nextHighlight) {
            nextHighlight.right = clampHighlightBoundary(m.center_x, nextHighlight.left, 'right');
        }
    }
}

function syncMarkerLineChange(marker, oldLine, oldCenterX) {
    if (!currentAyahData || !currentAyahData.ayah_highlights || oldLine === marker.line) return;

    const syncCheckbox = document.getElementById('sync-marker-highlight');
    const syncNextCheckbox = document.getElementById('sync-next-ayah-highlight');

    if (syncCheckbox && syncCheckbox.checked) {
        removeMarkerBoundHighlight({
            sura: marker.sura,
            ayah: marker.ayah,
            line: oldLine,
            boundary: 'left',
            centerX: oldCenterX,
        });
        createCurrentHighlightOnLine(marker);
    }

    if (syncNextCheckbox && syncNextCheckbox.checked) {
        const oldNext = inferNextAyahIdentity(marker);
        removeMarkerBoundHighlight({
            sura: oldNext.sura,
            ayah: oldNext.ayah,
            line: oldLine,
            boundary: 'right',
            centerX: oldCenterX,
        });
        createNextHighlightOnLine(marker);
    }
}

function removeMarkerBoundHighlight({ sura, ayah, line, boundary, centerX }) {
    const highlights = currentAyahData.ayah_highlights;
    for (let index = highlights.length - 1; index >= 0; index--) {
        const h = highlights[index];
        const isMatch =
            h.sura === sura &&
            h.ayah === ayah &&
            h.line === line &&
            (
                h.source === 'manual_marker_sync' ||
                Math.abs((boundary === 'left' ? h.left : h.right) - centerX) <= 0.05
            );
        if (isMatch) {
            highlights.splice(index, 1);
        }
    }
}

function inferNextAyahIdentity(marker) {
    const nextMarker = currentAyahData.ayah_markers
        ? currentAyahData.ayah_markers
            .filter(m =>
                (m.sura === marker.sura && m.ayah === marker.ayah + 1) ||
                (m.sura === marker.sura + 1 && m.ayah === 1)
            )
            .sort((a, b) => a.line - b.line || b.center_x - a.center_x)[0]
        : null;

    return {
        sura: nextMarker ? nextMarker.sura : marker.sura,
        ayah: nextMarker ? nextMarker.ayah : marker.ayah + 1
    };
}

function clampHighlightBoundary(value, oppositeBoundary, side) {
    const safeValue = Math.min(0.99, Math.max(0.01, value));
    const safeOpposite = Number.isFinite(oppositeBoundary) ? oppositeBoundary : safeValue;
    const minWidth = 0.006;

    if (side === 'left') {
        return Math.max(0.01, Math.min(safeValue, safeOpposite - minWidth));
    }
    return Math.min(0.99, Math.max(safeValue, safeOpposite + minWidth));
}

function createCurrentHighlightOnLine(marker) {
    if (!currentAyahData || !currentAyahData.ayah_highlights) return null;

    const existing = currentAyahData.ayah_highlights.find(h =>
        h.sura === marker.sura && h.ayah === marker.ayah && h.line === marker.line
    );
    if (existing) return existing;

    const highlight = {
        page: currentPage,
        line: marker.line,
        sura: marker.sura,
        ayah: marker.ayah,
        left: marker.center_x,
        right: 0.97,
        confidence: 0.5,
        source: 'manual_marker_sync'
    };

    currentAyahData.ayah_highlights.push(highlight);
    return highlight;
}

function findNextHighlightOnLine(marker) {
    if (!currentAyahData || !currentAyahData.ayah_highlights) return null;

    const sameLine = currentAyahData.ayah_highlights.filter(h => h.line === marker.line);
    if (sameLine.length === 0) return null;
    const nextIdentity = inferNextAyahIdentity(marker);

    const logicalNext = sameLine.find(h =>
        h.sura === nextIdentity.sura && h.ayah === nextIdentity.ayah
    );
    if (logicalNext) return logicalNext;

    const markerX = marker.center_x;
    const leftSideCandidates = sameLine
        .filter(h => h.sura !== marker.sura || h.ayah !== marker.ayah)
        .filter(h => Math.max(h.left, h.right) <= markerX + 0.04)
        .sort((a, b) => Math.abs(Math.max(a.left, a.right) - markerX) - Math.abs(Math.max(b.left, b.right) - markerX));

    return leftSideCandidates[0] || null;
}

function createNextHighlightOnLine(marker) {
    if (!currentAyahData || !currentAyahData.ayah_highlights) return null;
    const nextIdentity = inferNextAyahIdentity(marker);

    const nextMarker = currentAyahData.ayah_markers
        ? currentAyahData.ayah_markers
            .filter(m => m.line === marker.line)
            .filter(m => m.center_x < marker.center_x)
            .filter(m => m.sura === nextIdentity.sura && m.ayah === nextIdentity.ayah)
            .sort((a, b) => Math.abs(a.center_x - marker.center_x) - Math.abs(b.center_x - marker.center_x))[0]
        : null;

    const hasVisibleSpaceForNextAyah = marker.center_x > (DEFAULT_LEFT_MARGIN + 0.02);
    if (!nextMarker && !hasVisibleSpaceForNextAyah) {
        return null;
    }

    const nextHighlight = {
        page: currentPage,
        line: marker.line,
        sura: nextIdentity.sura,
        ayah: nextIdentity.ayah,
        left: nextMarker ? nextMarker.center_x : DEFAULT_LEFT_MARGIN,
        right: marker.center_x,
        confidence: 0.5,
        source: 'manual_marker_sync'
    };

    currentAyahData.ayah_highlights.push(nextHighlight);
    currentAyahData.ayah_highlights.sort(compareHighlightsReadingOrder);
    const insertedIndex = currentAyahData.ayah_highlights.indexOf(nextHighlight);
    if (shouldRenumberFollowingHighlights()) {
        renumberHighlightsFromIndex(insertedIndex + 1, 1, nextHighlight.sura);
    }
    return nextHighlight;
}

async function deleteSelectedHighlight() {
    if (!currentAyahData || !Array.isArray(currentAyahData.ayah_highlights)) return;
    if (!selectedItem || selectedItem.type !== 'highlight') return;

    const index = selectedItem.index;
    const deleted = currentAyahData.ayah_highlights[index];
    if (!deleted) return;

    const shouldRenumber = shouldRenumberFollowingHighlights();
    const confirmed = await appConfirm(
        shouldRenumber
            ? 'سيتم حذف مربع التحديد وتخفيض أرقام مربعات نفس السورة التي بعده بواحد. هل تتابع؟'
            : 'سيتم حذف مربع التحديد المحدد فقط. هل تتابع؟'
    );
    if (!confirmed) return;

    pushUndoSnapshot('delete highlight');
    currentAyahData.ayah_highlights.splice(index, 1);
    if (shouldRenumber) {
        renumberHighlightsFromIndex(index, -1, deleted.sura);
    }

    if (currentAyahData.ayah_highlights.length > 0) {
        const nextIndex = Math.min(index, currentAyahData.ayah_highlights.length - 1);
        selectedItem = { type: 'highlight', index: nextIndex };
        const h = currentAyahData.ayah_highlights[nextIndex];
        selectedItemOriginals = { left: h.left, right: h.right };
    } else {
        selectedItem = null;
        selectedItemOriginals = null;
    }

    renderBoxes();
    if (selectedItem) openRightPanel();
    else clearRightPanel();
    autoSaveAyahData();
}

// Reset Button Listeners
document.getElementById('reset-hl-left').addEventListener('click', () => {
    if (selectedItem && selectedItem.type === 'highlight' && selectedItemOriginals) {
        pushUndoSnapshot('reset highlight left');
        const h = currentAyahData.ayah_highlights[selectedItem.index];
        h.left = selectedItemOriginals.left;
        document.getElementById('hl-left').value = h.left;
        renderBoxes();
        openRightPanel();
        autoSaveAyahData();
    }
});
document.getElementById('reset-hl-right').addEventListener('click', () => {
    if (selectedItem && selectedItem.type === 'highlight' && selectedItemOriginals) {
        pushUndoSnapshot('reset highlight right');
        const h = currentAyahData.ayah_highlights[selectedItem.index];
        h.right = selectedItemOriginals.right;
        document.getElementById('hl-right').value = h.right;
        renderBoxes();
        openRightPanel();
        autoSaveAyahData();
    }
});
document.getElementById('reset-mk-cx').addEventListener('click', () => {
    if (selectedItem && selectedItem.type === 'marker' && selectedItemOriginals) {
        pushUndoSnapshot('reset marker x');
        const m = currentAyahData.ayah_markers[selectedItem.index];
        m.center_x = selectedItemOriginals.center_x;
        document.getElementById('mk-cx').value = m.center_x;
        renderBoxes();
        openRightPanel();
        autoSaveAyahData();
    }
});
document.getElementById('reset-mk-cy').addEventListener('click', () => {
    if (selectedItem && selectedItem.type === 'marker' && selectedItemOriginals) {
        pushUndoSnapshot('reset marker y');
        const m = currentAyahData.ayah_markers[selectedItem.index];
        m.center_y = selectedItemOriginals.center_y;
        document.getElementById('mk-cy').value = m.center_y;
        renderBoxes();
        openRightPanel();
        autoSaveAyahData();
    }
});

document.getElementById('reset-mk-line').addEventListener('click', () => {
    if (selectedItem && selectedItem.type === 'marker' && selectedItemOriginals) {
        pushUndoSnapshot('reset marker line');
        const m = currentAyahData.ayah_markers[selectedItem.index];
        m.line = selectedItemOriginals.line;
        document.getElementById('mk-line').value = m.line;
        document.getElementById('meta-line').textContent = m.line;
        renderBoxes();
        openRightPanel();
        autoSaveAyahData();
    }
});

document.getElementById('reset-meta-sura').addEventListener('click', () => {
    if (selectedItem && selectedItemOriginals) {
        pushUndoSnapshot('reset meta sura');
        if (selectedItem.type === 'highlight') {
            currentAyahData.ayah_highlights[selectedItem.index].sura = selectedItemOriginals.sura;
        } else {
            currentAyahData.ayah_markers[selectedItem.index].sura = selectedItemOriginals.sura;
        }
        renderBoxes();
        openRightPanel();
        autoSaveAyahData();
    }
});
document.getElementById('reset-meta-ayah').addEventListener('click', () => {
    if (selectedItem && selectedItemOriginals) {
        pushUndoSnapshot('reset meta ayah');
        if (selectedItem.type === 'highlight') {
            currentAyahData.ayah_highlights[selectedItem.index].ayah = selectedItemOriginals.ayah;
        } else {
            currentAyahData.ayah_markers[selectedItem.index].ayah = selectedItemOriginals.ayah;
        }
        renderBoxes();
        openRightPanel();
        autoSaveAyahData();
    }
});
document.getElementById('reset-meta-line').addEventListener('click', () => {
    if (selectedItem && selectedItemOriginals) {
        pushUndoSnapshot('reset meta line');
        if (selectedItem.type === 'highlight') {
            currentAyahData.ayah_highlights[selectedItem.index].line = selectedItemOriginals.line;
        } else {
            const m = currentAyahData.ayah_markers[selectedItem.index];
            const oldLine = m.line;
            const oldCenterX = m.center_x;
            m.line = selectedItemOriginals.line;
            if (oldLine !== m.line) {
                syncMarkerLineChange(m, oldLine, oldCenterX);
            }
            if (typeof syncHighlightWithMarker === 'function') {
                syncHighlightWithMarker(m, { allowCreateNext: shouldCreateNextHighlightOnMarkerMove() });
            }
            document.getElementById('mk-line').value = m.line;
        }
        renderBoxes();
        openRightPanel();
        autoSaveAyahData();
    }
});

document.getElementById('reset-hl-line-top').addEventListener('click', () => {
    if (selectedItem && selectedItem.type === 'highlight' && originalLineBands) {
        pushUndoSnapshot('reset line top');
        const h = currentAyahData.ayah_highlights[selectedItem.index];
        const band = currentLayoutData.lineBands.find(b => b.line === h.line);
        const origBand = originalLineBands.find(b => b.line === h.line);
        if (band && origBand) {
            band.top = origBand.top;
            document.getElementById('hl-line-top').value = band.top;
            renderBoxes();
            openRightPanel();
            autoSaveLayoutData();
        }
    }
});
document.getElementById('reset-hl-line-bottom').addEventListener('click', () => {
    if (selectedItem && selectedItem.type === 'highlight' && originalLineBands) {
        pushUndoSnapshot('reset line bottom');
        const h = currentAyahData.ayah_highlights[selectedItem.index];
        const band = currentLayoutData.lineBands.find(b => b.line === h.line);
        const origBand = originalLineBands.find(b => b.line === h.line);
        if (band && origBand) {
            band.bottom = origBand.bottom;
            document.getElementById('hl-line-bottom').value = band.bottom;
            renderBoxes();
            openRightPanel();
            autoSaveLayoutData();
        }
    }
});

document.getElementById('reset-global-y-offset').addEventListener('click', () => {
    pushUndoSnapshot('reset global y');
    document.getElementById('global-y-offset').value = 0;
    applyGlobalLayoutTweaks();
    autoSaveLayoutData();
});
document.getElementById('reset-global-scale').addEventListener('click', () => {
    pushUndoSnapshot('reset global scale');
    document.getElementById('global-scale').value = 1.0;
    applyGlobalLayoutTweaks();
    autoSaveLayoutData();
});
document.getElementById('reset-global-height').addEventListener('click', () => {
    pushUndoSnapshot('reset global height');
    document.getElementById('global-height').value = "";
    applyGlobalLayoutTweaks();
    updateLeftPanelSaveButtons();
});

// Inline Save Button Listeners
document.getElementById('save-hl-left').addEventListener('click', () => {
    document.getElementById('save-ayah-btn').click();
});
document.getElementById('save-hl-right').addEventListener('click', () => {
    document.getElementById('save-ayah-btn').click();
});
document.getElementById('save-hl-line-top').addEventListener('click', () => {
    document.getElementById('save-layout-btn').click();
});
document.getElementById('save-hl-line-bottom').addEventListener('click', () => {
    document.getElementById('save-layout-btn').click();
});
document.getElementById('save-mk-cx').addEventListener('click', () => {
    document.getElementById('save-ayah-btn').click();
});
document.getElementById('save-mk-cy').addEventListener('click', () => {
    document.getElementById('save-ayah-btn').click();
});
document.getElementById('save-mk-line').addEventListener('click', () => {
    document.getElementById('save-ayah-btn').click();
});
document.getElementById('save-meta-sura').addEventListener('click', () => {
    document.getElementById('save-ayah-btn').click();
});
document.getElementById('save-meta-ayah').addEventListener('click', () => {
    document.getElementById('save-ayah-btn').click();
});
document.getElementById('save-meta-line').addEventListener('click', () => {
    document.getElementById('save-ayah-btn').click();
});

document.getElementById('save-global-y-offset').addEventListener('click', () => {
    document.getElementById('save-layout-btn').click();
});
document.getElementById('save-global-scale').addEventListener('click', () => {
    document.getElementById('save-layout-btn').click();
});
document.getElementById('save-global-height').addEventListener('click', () => {
    document.getElementById('save-layout-btn').click();
});

if (DOM.saveAllBtn) DOM.saveAllBtn.addEventListener('click', saveCurrentPageAll);
if (DOM.undoBtn) DOM.undoBtn.addEventListener('click', undoLastChange);
if (DOM.redoBtn) DOM.redoBtn.addEventListener('click', redoLastChange);
const deleteHighlightBtn = document.getElementById('delete-highlight-btn');
if (deleteHighlightBtn) deleteHighlightBtn.addEventListener('click', deleteSelectedHighlight);

// Save Actions
document.getElementById('save-ayah-btn').addEventListener('click', () => {
    if (currentAyahData) {
        normalizeAyahGeometry(currentAyahData);
        const pageStr = String(currentPage).padStart(3, '0');
        const path = `databases/ayahinfo/warsh_muthamman/pages_json/page_${pageStr}.json`;
        saveToServer(path, currentAyahData, () => {
            if (selectedItem) {
                if (selectedItem.type === 'highlight') {
                    const h = currentAyahData.ayah_highlights[selectedItem.index];
                    selectedItemOriginals = { left: h.left, right: h.right, sura: h.sura, ayah: h.ayah, line: h.line };
                } else if (selectedItem.type === 'marker') {
                    const m = currentAyahData.ayah_markers[selectedItem.index];
                    selectedItemOriginals = { center_x: m.center_x, center_y: m.center_y || 0.5, line: m.line, sura: m.sura, ayah: m.ayah };
                }
                openRightPanel();
                flashSavedFeedback();
            }
        });
    }
});

function flashSavedFeedback() {
    const badge = document.getElementById('save-status-badge');
    const cards = document.querySelectorAll('.val-compare-card');
    
    badge.style.background = 'rgba(76, 175, 80, 0.4)';
    badge.style.color = '#fff';
    
    cards.forEach(card => {
        card.classList.add('success-glow');
    });
    
    setTimeout(() => {
        badge.style.background = '';
        badge.style.color = '';
        cards.forEach(card => {
            card.classList.remove('success-glow');
        });
    }, 1000);
}

function syncSelectionOriginalsFromCurrent() {
    if (!selectedItem || !currentAyahData) return;
    if (selectedItem.type === 'highlight') {
        const h = currentAyahData.ayah_highlights[selectedItem.index];
        if (h) selectedItemOriginals = { left: h.left, right: h.right, sura: h.sura, ayah: h.ayah, line: h.line };
    } else if (selectedItem.type === 'marker') {
        const m = currentAyahData.ayah_markers[selectedItem.index];
        if (m) selectedItemOriginals = { center_x: m.center_x, center_y: m.center_y || 0.5, line: m.line, sura: m.sura, ayah: m.ayah };
    }
}

function syncLayoutOriginalsFromCurrent(resetInputs = false) {
    if (!currentLayoutData || !currentLayoutData.lineBands) return;
    originalLineBands = JSON.parse(JSON.stringify(currentLayoutData.lineBands));
    if (originalLineBands.length > 0) {
        const avgHeight = Math.round(originalLineBands.reduce((sum, b) => sum + (b.bottom - b.top), 0) / originalLineBands.length);
        document.getElementById('global-height-orig').textContent = `Ø§Ù„Ø£ØµÙ„ÙŠØ©: ~${avgHeight}`;
    } else {
        document.getElementById('global-height-orig').textContent = `Ø§Ù„Ø£ØµÙ„ÙŠØ©: -`;
    }

    if (resetInputs) {
        document.getElementById('global-y-offset').value = 0;
        document.getElementById('global-scale').value = 1.0;
        document.getElementById('global-height').value = "";
        updateLeftPanelSaveButtons();
    }
}

async function saveCurrentPageAll() {
    if (!currentAyahData && !currentLayoutData && !hasUnsavedDrawings) return;

    const pageStr = String(currentPage).padStart(3, '0');
    const oldDisabled = DOM.saveAllBtn ? DOM.saveAllBtn.disabled : false;
    if (DOM.saveAllBtn) DOM.saveAllBtn.disabled = true;

    let ok = true;
    if (currentAyahData) {
        normalizeAyahGeometry(currentAyahData);
        const ayahPath = `databases/ayahinfo/warsh_muthamman/pages_json/page_${pageStr}.json`;
        ok = await saveToServer(ayahPath, currentAyahData, syncSelectionOriginalsFromCurrent) && ok;
    }
    if (currentLayoutData) {
        const layoutPath = `databases/ayahinfo/warsh_muthamman/page_layout_json/page_${pageStr}.json`;
        ok = await saveToServer(layoutPath, currentLayoutData, () => syncLayoutOriginalsFromCurrent(true)) && ok;
    }

    if (hasUnsavedDrawings) {
        ok = await saveDrawingToServer() && ok;
    }

    if (selectedItem) openRightPanel();
    if (ok) {
        flashSavedFeedback();
        showToast('تم حفظ الصفحة والصورة بنجاح');
    }

    if (DOM.saveAllBtn) DOM.saveAllBtn.disabled = false; // أعد تفعيله مؤقتاً
    updateUndoRedoButtons(); // ثم دع المنطق الصحيح يقرر
}


document.getElementById('save-layout-btn').addEventListener('click', () => {
    if (currentLayoutData) {
        const pageStr = String(currentPage).padStart(3, '0');
        const path = `databases/ayahinfo/warsh_muthamman/page_layout_json/page_${pageStr}.json`;
        saveToServer(path, currentLayoutData, () => {
            // Sync originalLineBands to current layout and reset inputs to baseline
            if (currentLayoutData.lineBands) {
                originalLineBands = JSON.parse(JSON.stringify(currentLayoutData.lineBands));
                if (originalLineBands.length > 0) {
                    const avgHeight = Math.round(originalLineBands.reduce((sum, b) => sum + (b.bottom - b.top), 0) / originalLineBands.length);
                    document.getElementById('global-height-orig').textContent = `الأصلية: ~${avgHeight}`;
                } else {
                    document.getElementById('global-height-orig').textContent = `الأصلية: -`;
                }
            }
            document.getElementById('global-y-offset').value = 0;
            document.getElementById('global-scale').value = 1.0;
            document.getElementById('global-height').value = "";
            updateLeftPanelSaveButtons();
        });
    }
});

// Left Panel (Global Layout Tweaks)
function applyGlobalLayoutTweaks() {
    if (!originalLineBands || !currentLayoutData) return;
    const yOffset = parseInt(document.getElementById('global-y-offset').value) || 0;
    const scale = parseNumericInputValue(document.getElementById('global-scale').value, 1.0);
    const fixedHeight = parseInt(document.getElementById('global-height').value) || 0;

    currentLayoutData.lineBands = originalLineBands.map(orig => {
        const center = orig.center + yOffset;
        const baseHeight = fixedHeight > 0 ? fixedHeight : (orig.bottom - orig.top);
        const halfHeight = (baseHeight / 2) * scale;
        return {
            line: orig.line,
            top: Math.round(center - halfHeight),
            bottom: Math.round(center + halfHeight),
            center: center
        };
    });
    renderBoxes();
}

// Left Panel Save Buttons State Update
function updateLeftPanelSaveButtons() {
    const yOffset = parseInt(document.getElementById('global-y-offset').value) || 0;
    const scale = parseNumericInputValue(document.getElementById('global-scale').value, 1.0);
    const height = document.getElementById('global-height').value;

    const btnY = document.getElementById('save-global-y-offset');
    const btnS = document.getElementById('save-global-scale');
    const btnH = document.getElementById('save-global-height');

    if (yOffset !== 0) {
        btnY.className = "save-inline-btn unsaved";
        btnY.title = "تغيير غير محفوظ - انقر للحفظ";
    } else {
        btnY.className = "save-inline-btn saved";
        btnY.title = "تم الحفظ";
    }

    if (Math.abs(scale - 1.0) > 0.001) {
        btnS.className = "save-inline-btn unsaved";
        btnS.title = "تغيير غير محفوظ - انقر للحفظ";
    } else {
        btnS.className = "save-inline-btn saved";
        btnS.title = "تم الحفظ";
    }

    if (height !== "" && height !== "0") {
        btnH.className = "save-inline-btn unsaved";
        btnH.title = "تغيير غير محفوظ - انقر للحفظ";
    } else {
        btnH.className = "save-inline-btn saved";
        btnH.title = "تم الحفظ";
    }
}

document.getElementById('global-y-offset').addEventListener('input', () => {
    applyGlobalLayoutTweaks();
    updateLeftPanelSaveButtons();
});
document.getElementById('global-scale').addEventListener('input', () => {
    applyGlobalLayoutTweaks();
    updateLeftPanelSaveButtons();
});
document.getElementById('global-height').addEventListener('input', () => {
    applyGlobalLayoutTweaks();
    updateLeftPanelSaveButtons();
});

document.getElementById('reset-lines-count').addEventListener('click', () => {
    pushUndoSnapshot('reset lines count');
    if (originalLineBands && originalLineBands.length > 0) {
        document.getElementById('lines-count-input').value = originalLineBands.length;
        updateLineBandsCount(originalLineBands.length);
        autoSaveLayoutData();
    }
});

document.getElementById('save-lines-count').addEventListener('click', () => {
    document.getElementById('save-layout-btn').click();
});

document.getElementById('lines-count-input').addEventListener('change', (e) => {
    const newCount = parseInt(e.target.value);
    if (!isNaN(newCount) && newCount > 0) {
        pushUndoSnapshot('change lines count');
        updateLineBandsCount(newCount);
        autoSaveLayoutData();
    }
});

function updateLineBandsCount(newCount) {
    if (!currentLayoutData.lineBands) {
        currentLayoutData.lineBands = [];
    }
    const bands = currentLayoutData.lineBands;
    if (newCount > bands.length) {
        const lastLine = bands.length > 0 ? bands[bands.length - 1] : { top: 0, bottom: 50 };
        const h = lastLine.bottom - lastLine.top;
        for (let i = bands.length; i < newCount; i++) {
            const top = bands[i - 1] ? bands[i - 1].bottom : 0;
            const bottom = top + h;
            bands.push({
                line: i + 1,
                top: top,
                bottom: bottom,
                center: Math.round((top + bottom) / 2)
            });
        }
    } else if (newCount < bands.length) {
        bands.splice(newCount);
    }
    
    originalLineBands = JSON.parse(JSON.stringify(bands));
    
    const btnL = document.getElementById('save-lines-count');
    btnL.className = "save-inline-btn unsaved";
    btnL.title = "تغيير غير محفوظ - انقر للحفظ";
    
    renderBoxes();
}

// Keyboard Navigation and Shortcuts
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const cmd = e.ctrlKey || e.metaKey;
    if (e.shiftKey && !cmd && !e.altKey && key === 's') {
        e.preventDefault();
        saveCurrentPageAll();
        return;
    }
    if (cmd && !e.altKey && key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (isDrawingMode && typeof undoDrawing === 'function') {
            undoDrawing();
        } else {
            undoLastChange();
        }
        return;
    }
    if (cmd && !e.altKey && (key === 'y' || (key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redoLastChange();
        return;
    }

    const activeTag = document.activeElement.tagName.toLowerCase();
    if (activeTag === 'input' || activeTag === 'textarea') {
        if (e.key === 'Enter' && document.activeElement === DOM.jumpInput) {
            const val = parseInt(DOM.jumpInput.value);
            if (!isNaN(val) && val >= 1 && val <= TOTAL_PAGES) {
                updatePage(val);
                DOM.jumpInput.blur();
            }
        }
        return; // ignore arrow keys when typing
    }

    // Box shortcuts
    if (selectedItem) {
        
        if (e.key.startsWith('Arrow')) {
            if (e.key === 'ArrowUp' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                const arr = selectedItem.type === 'highlight' ? currentAyahData.ayah_highlights : currentAyahData.ayah_markers;
                let newIndex = selectedItem.index - 1;
                if (newIndex < 0) newIndex = arr.length - 1;
                selectItem(selectedItem.type, newIndex);
                e.preventDefault();
                return;
            }
            if (e.key === 'ArrowDown' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                const arr = selectedItem.type === 'highlight' ? currentAyahData.ayah_highlights : currentAyahData.ayah_markers;
                let newIndex = selectedItem.index + 1;
                if (newIndex >= arr.length) newIndex = 0;
                selectItem(selectedItem.type, newIndex);
                e.preventDefault();
                return;
            }
        }

        let updatedAyah = false;
        let updatedLayout = false;
        const isEditingKey = e.key === 'Delete' || e.key === 'Backspace' || e.key.toLowerCase() === 'd' || e.key === '+' || e.key === '=' || e.key === '-' || e.key === '_' || e.key === ' ';
        const shouldCaptureHistory = e.shiftKey || e.ctrlKey || e.altKey || isEditingKey;
        
        if (shouldCaptureHistory) pushUndoSnapshot('keyboard edit');

        if (selectedItem.type === 'highlight') {
            const h = currentAyahData.ayah_highlights[selectedItem.index];
            const lineBand = currentLayoutData.lineBands.find(b => b.line === h.line);
            
            if (e.key === 'Delete' || e.key === 'Backspace') {
                currentAyahData.ayah_highlights.splice(selectedItem.index, 1);
                selectedItem = null;
                updatedAyah = true;
                e.preventDefault();
            } else if ((e.key.toLowerCase() === 'd') && e.shiftKey && !e.ctrlKey && !e.altKey) {
                const newH = JSON.parse(JSON.stringify(h));
                currentAyahData.ayah_highlights.splice(selectedItem.index + 1, 0, newH);
                selectItem('highlight', selectedItem.index + 1);
                updatedAyah = true;
                e.preventDefault();
            } else if (e.key === '+' || e.key === '=') {
                h.ayah++;
                updatedAyah = true;
                e.preventDefault();
            } else if (e.key === '-' || e.key === '_') {
                h.ayah = Math.max(1, h.ayah - 1);
                updatedAyah = true;
                e.preventDefault();
            } else if (e.key.toLowerCase() === 'f' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                const nextLine = h.line + 1;
                if (currentLayoutData && currentLayoutData.lineBands && nextLine <= currentLayoutData.lineBands.length) {
                    const newH = {
                        page: currentPage,
                        line: nextLine,
                        sura: h.sura,
                        ayah: h.ayah,
                        left: DEFAULT_LEFT_MARGIN,
                        right: DEFAULT_RIGHT_MARGIN,
                        confidence: 0.8,
                        source: 'manual_fill'
                    };
                    currentAyahData.ayah_highlights.push(newH);
                    selectItem('highlight', currentAyahData.ayah_highlights.length - 1);
                    updatedAyah = true;
                    e.preventDefault();
                }
            } else if (e.ctrlKey && !e.shiftKey && !e.altKey) {
                if (e.key === 'ArrowRight') { h.right = DEFAULT_RIGHT_MARGIN; updatedAyah = true; e.preventDefault(); }
                else if (e.key === 'ArrowLeft') { h.left = DEFAULT_LEFT_MARGIN; updatedAyah = true; e.preventDefault(); }
                else if (e.key === ' ') { h.left = DEFAULT_LEFT_MARGIN; h.right = DEFAULT_RIGHT_MARGIN; updatedAyah = true; e.preventDefault(); }
            }
            
            if (e.shiftKey && !e.ctrlKey && !e.altKey) {
                // Move Highlight
                const step = 0.001;
                if (e.key === 'ArrowLeft') { h.left -= step; h.right -= step; updatedAyah = true; }
                else if (e.key === 'ArrowRight') { h.left += step; h.right += step; updatedAyah = true; }
                else if (e.key === 'ArrowUp') { 
                    h.line = Math.max(1, h.line - 1); 
                    updatedAyah = true; 
                }
                else if (e.key === 'ArrowDown') { 
                    const maxLine = currentLayoutData && currentLayoutData.lineBands ? currentLayoutData.lineBands.length : 15;
                    h.line = Math.min(maxLine, h.line + 1); 
                    updatedAyah = true; 
                }
            } else if (e.ctrlKey && e.shiftKey) {
                // Vertical Resizing of LineBand
                const step = 1;
                const bandIndex = currentLayoutData.lineBands.indexOf(lineBand);
                if (!e.altKey) {
                    // Expand
                    if (e.key === 'ArrowUp') { lineBand.top -= step; shiftPrecedingLines(bandIndex, -step); updatedLayout = true; }
                    else if (e.key === 'ArrowDown') { lineBand.bottom += step; shiftFollowingLines(bandIndex, step); updatedLayout = true; }
                } else {
                    // Shrink
                    if (e.key === 'ArrowUp') { lineBand.bottom -= step; shiftFollowingLines(bandIndex, -step); updatedLayout = true; }
                    else if (e.key === 'ArrowDown') { lineBand.top += step; shiftPrecedingLines(bandIndex, step); updatedLayout = true; }
                }
            }
        } else if (selectedItem.type === 'marker') {
            const m = currentAyahData.ayah_markers[selectedItem.index];
            const oldLine = m.line;
            const oldCenterX = m.center_x;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                currentAyahData.ayah_markers.splice(selectedItem.index, 1);
                selectedItem = null;
                updatedAyah = true;
                e.preventDefault();
            } else if ((e.key.toLowerCase() === 'd') && e.shiftKey && !e.ctrlKey && !e.altKey) {
                const newM = JSON.parse(JSON.stringify(m));
                currentAyahData.ayah_markers.splice(selectedItem.index + 1, 0, newM);
                selectItem('marker', selectedItem.index + 1);
                updatedAyah = true;
                e.preventDefault();
            } else if (e.key === '+' || e.key === '=') {
                m.ayah++;
                updatedAyah = true;
                e.preventDefault();
            } else if (e.key === '-' || e.key === '_') {
                m.ayah = Math.max(1, m.ayah - 1);
                updatedAyah = true;
                e.preventDefault();
            } else if (e.key.toLowerCase() === 'f' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                const nextLine = m.line + 1;
                if (currentLayoutData && currentLayoutData.lineBands && nextLine <= currentLayoutData.lineBands.length) {
                    const nextIdentity = inferNextAyahIdentity(m);
                    const newH = {
                        page: currentPage,
                        line: nextLine,
                        sura: nextIdentity.sura,
                        ayah: nextIdentity.ayah,
                        left: DEFAULT_LEFT_MARGIN,
                        right: DEFAULT_RIGHT_MARGIN,
                        confidence: 0.8,
                        source: 'manual_fill'
                    };
                    currentAyahData.ayah_highlights.push(newH);
                    selectItem('highlight', currentAyahData.ayah_highlights.length - 1);
                    updatedAyah = true;
                    e.preventDefault();
                }
            }

            if (e.shiftKey && !e.ctrlKey && !e.altKey) {
                const step = 0.001;
                if (e.key === 'ArrowLeft') { m.center_x -= step; updatedAyah = true; }
                else if (e.key === 'ArrowRight') { m.center_x += step; updatedAyah = true; }
                else if (e.key === 'ArrowUp') { m.center_y -= step; updatedAyah = true; }
                else if (e.key === 'ArrowDown') { m.center_y += step; updatedAyah = true; }
                normalizeMarkerLineAfterKeyboardMove(m, oldLine, oldCenterX);
                if (updatedAyah && typeof syncHighlightWithMarker === 'function') {
                    syncHighlightWithMarker(m, { allowCreateNext: shouldCreateNextHighlightOnMarkerMove() });
                }
            }
        }

        if (updatedAyah || updatedLayout) {
            e.preventDefault(); // Prevent page scroll
            renderBoxes();
            openRightPanel();
            if (updatedAyah) autoSaveAyahData();
            if (updatedLayout) {
                originalLineBands = JSON.parse(JSON.stringify(currentLayoutData.lineBands)); // Sync original
                autoSaveLayoutData();
            }
            return;
        }
    } else if (!selectedItem && e.key === 'ArrowDown' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        // If nothing selected, select first highlight
        if (currentAyahData && currentAyahData.ayah_highlights && currentAyahData.ayah_highlights.length > 0) {
            selectItem('highlight', 0);
            e.preventDefault();
            return;
        }
    }

    // Normal navigation
    if (e.key === 'ArrowLeft' && !e.shiftKey && !e.ctrlKey) updatePage(currentPage + 1);
    else if (e.key === 'ArrowRight' && !e.shiftKey && !e.ctrlKey) updatePage(currentPage - 1);
});

function shiftFollowingLines(bandIndex, shiftDelta) {
    if (shiftDelta === 0) return;
    const shiftFollowing = document.getElementById('shift-following-lines') && document.getElementById('shift-following-lines').checked;
    if (shiftFollowing && currentLayoutData && currentLayoutData.lineBands && bandIndex >= 0) {
        for (let i = bandIndex + 1; i < currentLayoutData.lineBands.length; i++) {
            currentLayoutData.lineBands[i].top += shiftDelta;
            currentLayoutData.lineBands[i].bottom += shiftDelta;
            currentLayoutData.lineBands[i].center = Math.round((currentLayoutData.lineBands[i].top + currentLayoutData.lineBands[i].bottom) / 2);
        }
    }
}

function shiftPrecedingLines(bandIndex, shiftDelta) {
    if (shiftDelta === 0) return;
    const shiftFollowing = document.getElementById('shift-following-lines') && document.getElementById('shift-following-lines').checked;
    if (shiftFollowing && currentLayoutData && currentLayoutData.lineBands && bandIndex >= 0) {
        for (let i = 0; i < bandIndex; i++) {
            currentLayoutData.lineBands[i].top += shiftDelta;
            currentLayoutData.lineBands[i].bottom += shiftDelta;
            currentLayoutData.lineBands[i].center = Math.round((currentLayoutData.lineBands[i].top + currentLayoutData.lineBands[i].bottom) / 2);
        }
    }
}

function normalizeMarkerLineAfterKeyboardMove(marker, oldLine, oldCenterX) {
    if (!currentLayoutData || !currentLayoutData.lineBands) return;

    while (marker.center_y < 0 && marker.line > 1) {
        marker.line -= 1;
        marker.center_y += 1;
    }
    while (marker.center_y > 1 && marker.line < currentLayoutData.lineBands.length) {
        marker.line += 1;
        marker.center_y -= 1;
    }
    marker.center_y = Math.min(0.98, Math.max(0.02, marker.center_y));

    if (oldLine !== marker.line) {
        syncMarkerLineChange(marker, oldLine, oldCenterX);
    }
}

document.getElementById('prev-page-btn').addEventListener('click', () => {
    updatePage(currentPage - 1);
});

document.getElementById('next-page-btn').addEventListener('click', () => {
    updatePage(currentPage + 1);
});

DOM.jumpInput.addEventListener('change', () => {
    const val = parseInt(DOM.jumpInput.value);
    if (!isNaN(val) && val >= 1 && val <= TOTAL_PAGES) updatePage(val);
});

document.getElementById('refresh-btn').addEventListener('click', () => {
    const pageStr = String(currentPage).padStart(3, '0');
    DOM.img.src = `${IMAGE_BASE_PATH}${pageStr}.png?t=${new Date().getTime()}`;
});

// Batch Pad Highlights
document.getElementById('global-pad-left').addEventListener('input', () => {
    renderBoxes();
});
document.getElementById('global-pad-right').addEventListener('input', () => {
    renderBoxes();
});

document.getElementById('save-ayah-pad-btn').addEventListener('click', () => {
    if (!currentAyahData) return;
    
    const padLeft = parseNumericInputValue(document.getElementById('global-pad-left').value);
    const padRight = parseNumericInputValue(document.getElementById('global-pad-right').value);
    
    if (padLeft !== 0 || padRight !== 0) {
        pushUndoSnapshot('apply page ayah padding');
        if (currentAyahData.ayah_highlights) {
            currentAyahData.ayah_highlights.forEach(h => {
                h.left = Math.max(0, h.left - padLeft);
                h.right = Math.min(1, h.right + padRight);
            });
        }
    }
    
    autoSaveAyahData();
    document.getElementById('global-pad-left').value = "0.00";
    document.getElementById('global-pad-right').value = "0.00";
    renderBoxes(); // re-render without visual padding since it's now permanent

    const btn = document.getElementById('save-ayah-pad-btn');
    const origText = btn.textContent;
    btn.textContent = "تم الحفظ!";
    setTimeout(() => {
        btn.textContent = origText;
    }, 1500);
});

document.getElementById('apply-pad-all-btn').addEventListener('click', async () => {
    const padLeft = parseNumericInputValue(document.getElementById('global-pad-left').value);
    const padRight = parseNumericInputValue(document.getElementById('global-pad-right').value);
    
    if (padLeft === 0 && padRight === 0) {
        appAlert("يرجى إدخال قيمة التمديد أولاً.");
        return;
    }

    const conf = await appConfirm(`هل أنت متأكد من رغبتك في تطبيق تمديد يمين (${padRight}) ويسار (${padLeft}) على جميع ملفات الآيات (485 صفحة)؟\nهذا الإجراء لا يمكن التراجع عنه بسهولة.`);
    if (!conf) return;

    try {
        const btn = document.getElementById('apply-pad-all-btn');
        btn.textContent = "جاري التطبيق...";
        btn.disabled = true;

        const res = await fetch('/api/batch-pad-highlights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ padLeft, padRight })
        });
        const data = await res.json();
        
        if (data.success) {
            appAlert(`تم تطبيق الإعدادات بنجاح على ${data.filesModified} صفحة.`, "نجاح");
            // Reset the inputs
            document.getElementById('global-pad-left').value = 0;
            document.getElementById('global-pad-right').value = 0;
            document.getElementById('apply-pad-all-btn').classList.remove('unsaved');
            document.getElementById('apply-pad-all-btn').classList.add('saved');
            
            // Reload page to fetch updated data
            updatePage(currentPage);
        } else {
            appAlert("حدث خطأ: " + (data.error || "خطأ مجهول"), "خطأ");
        }
    } catch (e) {
        console.error(e);
        appAlert("حدث خطأ أثناء الاتصال بالخادم.", "خطأ");
    } finally {
        const btn = document.getElementById('apply-pad-all-btn');
        btn.textContent = "تطبيق وحفظ في كل الصفحات";
        btn.disabled = false;
    }
});

// Live Preview for first and last line pad inputs
document.getElementById('global-first-line-pad').addEventListener('input', () => {
    renderBoxes();
});
document.getElementById('global-last-line-pad').addEventListener('input', () => {
    renderBoxes();
});

// Save first/last line adjustments locally on current page
document.getElementById('save-first-last-page-btn').addEventListener('click', () => {
    if (!currentLayoutData || !currentLayoutData.lineBands || currentLayoutData.lineBands.length === 0) return;
    
    const padFirstTop = parseInt(document.getElementById('global-first-line-pad').value) || 0;
    const padLastBottom = parseInt(document.getElementById('global-last-line-pad').value) || 0;
    
    if (padFirstTop === 0 && padLastBottom === 0) return;
    pushUndoSnapshot('apply first/last line padding');
    
    const bands = currentLayoutData.lineBands;
    const first = bands[0];
    const last = bands[bands.length - 1];
    
    first.top = Math.max(0, first.top - padFirstTop);
    first.center = Math.round((first.top + first.bottom) / 2);
    
    last.bottom = last.bottom + padLastBottom;
    last.center = Math.round((last.top + last.bottom) / 2);
    
    const pageStr = String(currentPage).padStart(3, '0');
    const path = `databases/ayahinfo/warsh_muthamman/page_layout_json/page_${pageStr}.json`;
    saveToServer(path, currentLayoutData, () => {
        originalLineBands = JSON.parse(JSON.stringify(currentLayoutData.lineBands));
        document.getElementById('global-first-line-pad').value = 0;
        document.getElementById('global-last-line-pad').value = 0;
        renderBoxes();
        
        // Show success visual feedback on the button
        const btn = document.getElementById('save-first-last-page-btn');
        const origText = btn.textContent;
        btn.textContent = "تم الحفظ!";
        setTimeout(() => { btn.textContent = origText; }, 1500);
    });
});

// Save first/last line adjustments globally on all pages
document.getElementById('apply-first-last-all-btn').addEventListener('click', async () => {
    const padFirstTop = parseInt(document.getElementById('global-first-line-pad').value) || 0;
    const padLastBottom = parseInt(document.getElementById('global-last-line-pad').value) || 0;
    
    if (padFirstTop === 0 && padLastBottom === 0) {
        appAlert("يرجى إدخال قيمة تمديد السطر الأول أو الأخير أولاً.");
        return;
    }

    const conf = await appConfirm(`هل أنت متأكد من رغبتك في تطبيق تمديد إضافي للسطر الأول (${padFirstTop}px) 
وتمديد إضافي للسطر الأخير (${padLastBottom}px) على جميع ملفات التخطيط (485 صفحة)؟\nهذا الإجراء لا يمكن التراجع عنه بسهولة.`);
    if (!conf) return;

    try {
        const btn = document.getElementById('apply-first-last-all-btn');
        btn.textContent = "جاري التطبيق...";
        btn.disabled = true;

        const res = await fetch('/api/batch-adjust-first-last-lines', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ padFirstTop, padLastBottom })
        });
        const data = await res.json();
        
        if (data.success) {
            appAlert(`تم تطبيق التعديلات بنجاح على ${data.filesModified} صفحة تخطيط.`, "نجاح");
            // Reset the inputs
            document.getElementById('global-first-line-pad').value = 0;
            document.getElementById('global-last-line-pad').value = 0;
            // Reload page to fetch updated data
            updatePage(currentPage);
        } else {
            appAlert("حدث خطأ: " + (data.error || "غير معروف"), "خطأ");
        }
    } catch (e) {
        console.error(e);
        appAlert("حدث خطأ أثناء الاتصال بالخادم.", "خطأ");
    } finally {
        const btn = document.getElementById('apply-first-last-all-btn');
        btn.textContent = "تطبيق وحفظ في كل الصفحات";
        btn.disabled = false;
    }
});

// Help Modal
document.getElementById('help-btn').addEventListener('click', () => {
    document.getElementById('help-modal').style.display = 'block';
});
document.getElementById('close-help-btn').addEventListener('click', () => {
    document.getElementById('help-modal').style.display = 'none';
});

// Sidebar Resizing Logic
(function() {
    const leftPanel = document.getElementById('left-panel');
    const rightPanel = document.getElementById('right-panel');
    const leftResizer = document.getElementById('left-resizer');
    const rightResizer = document.getElementById('right-resizer');
    const imageContainer = document.getElementById('image-container');

    let leftWidth = parseInt(localStorage.getItem('sidebar_left_width')) || 250;
    let rightWidth = parseInt(localStorage.getItem('sidebar_right_width')) || 340;

    leftWidth = Math.max(125, Math.min(375, leftWidth));
    rightWidth = Math.max(170, Math.min(510, rightWidth));

    function applySidebarWidths() {
        leftPanel.style.width = leftWidth + 'px';
        rightPanel.style.width = rightWidth + 'px';
        imageContainer.style.marginLeft = leftWidth + 'px';
        imageContainer.style.marginRight = rightWidth + 'px';
        imageContainer.style.width = `calc(100% - ${leftWidth + rightWidth}px)`;
    }

    applySidebarWidths();

    leftResizer.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        document.body.style.cursor = 'col-resize';
        leftResizer.classList.add('resizing');
        const startX = e.clientX;
        const startWidth = leftWidth;

        function onMouseMove(moveEvent) {
            const deltaX = moveEvent.clientX - startX;
            leftWidth = Math.max(125, Math.min(375, startWidth + deltaX));
            applySidebarWidths();
        }

        function onMouseUp() {
            document.body.style.cursor = '';
            leftResizer.classList.remove('resizing');
            localStorage.setItem('sidebar_left_width', leftWidth);
            document.removeEventListener('pointermove', onMouseMove);
            document.removeEventListener('pointerup', onMouseUp);
        }

        document.addEventListener('pointermove', onMouseMove);
        document.addEventListener('pointerup', onMouseUp);
    });

    rightResizer.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        document.body.style.cursor = 'col-resize';
        rightResizer.classList.add('resizing');
        const startX = e.clientX;
        const startWidth = rightWidth;

        function onMouseMove(moveEvent) {
            const deltaX = moveEvent.clientX - startX;
            rightWidth = Math.max(170, Math.min(510, startWidth - deltaX));
            applySidebarWidths();
        }

        function onMouseUp() {
            document.body.style.cursor = '';
            rightResizer.classList.remove('resizing');
            localStorage.setItem('sidebar_right_width', rightWidth);
            document.removeEventListener('pointermove', onMouseMove);
            document.removeEventListener('pointerup', onMouseUp);
        }

        document.addEventListener('pointermove', onMouseMove);
        document.addEventListener('pointerup', onMouseUp);
    });
})();

// Init Checkboxes
const syncCheckbox = document.getElementById('sync-marker-highlight');
const syncNextCheckbox = document.getElementById('sync-next-ayah-highlight');
const syncCreateNextCheckbox = document.getElementById('sync-create-next-highlight');
const renumberFollowingCheckbox = document.getElementById('renumber-following-highlights');
const snapHighlightEdgesCheckbox = document.getElementById('snap-highlight-edges');
if (syncCheckbox) {
    syncCheckbox.checked = localStorage.getItem('warsh_muthamman_sync_marker') === 'true';
    syncCheckbox.addEventListener('change', (e) => {
        localStorage.setItem('warsh_muthamman_sync_marker', e.target.checked);
    });
}
if (syncNextCheckbox) {
    syncNextCheckbox.checked = localStorage.getItem('warsh_muthamman_sync_next') === 'true';
    syncNextCheckbox.addEventListener('change', (e) => {
        localStorage.setItem('warsh_muthamman_sync_next', e.target.checked);
    });
}
if (syncCreateNextCheckbox) {
    syncCreateNextCheckbox.checked = localStorage.getItem('warsh_muthamman_sync_create_next') === 'true';
    syncCreateNextCheckbox.addEventListener('change', (e) => {
        localStorage.setItem('warsh_muthamman_sync_create_next', e.target.checked);
    });
}
if (renumberFollowingCheckbox) {
    renumberFollowingCheckbox.checked = localStorage.getItem('warsh_muthamman_renumber_following') === 'true';
    renumberFollowingCheckbox.addEventListener('change', (e) => {
        localStorage.setItem('warsh_muthamman_renumber_following', e.target.checked);
    });
}
if (snapHighlightEdgesCheckbox) {
    snapHighlightEdgesCheckbox.checked = localStorage.getItem('warsh_muthamman_snap_edges') === 'true';
    snapHighlightEdgesCheckbox.addEventListener('change', (e) => {
        localStorage.setItem('warsh_muthamman_snap_edges', e.target.checked);
    });
}

// Enable scroll adjustments on numeric inputs
document.addEventListener('wheel', (e) => {
    const target = e.target;
    if (target && target.tagName === 'INPUT' && target.type === 'number') {
        // Prevent default browser page scrolling
        e.preventDefault();

        // Focus the input to start history transaction if it has history tracking
        if (document.activeElement !== target) {
            target.focus();
        }

        let val = parseNumericInputValue(target.value);
        if (isNaN(val)) {
            val = 0;
        }

        const stepAttr = target.getAttribute('step');
        let step = 1;
        if (stepAttr && stepAttr !== 'any') {
            step = parseNumericInputValue(stepAttr, 1);
        } else if (stepAttr === 'any') {
            step = 0.0001;
        }

        // Adjust value based on scroll direction
        if (e.deltaY < 0) {
            val += step;
        } else {
            val -= step;
        }

        // Min/max constraints
        const minAttr = target.getAttribute('min');
        const maxAttr = target.getAttribute('max');
        if (minAttr !== null) {
            val = Math.max(parseNumericInputValue(minAttr), val);
        }
        if (maxAttr !== null) {
            val = Math.min(parseNumericInputValue(maxAttr), val);
        }

        // Format to correct decimal places to prevent floating-point precision errors
        let decimals = 0;
        if (stepAttr && stepAttr.includes('.')) {
            decimals = stepAttr.split('.')[1].length;
        } else if (stepAttr === 'any') {
            decimals = 4;
        } else if (step < 1) {
            decimals = -Math.floor(Math.log10(step));
        }

        target.value = val.toFixed(decimals);

        // Dispatch input event to update model and preview immediately
        target.dispatchEvent(new Event('input', { bubbles: true }));

        // Debounce the change event to commit history transaction after scrolling stops
        if (target._scrollTimeout) {
            clearTimeout(target._scrollTimeout);
        }
        target._scrollTimeout = setTimeout(() => {
            target.dispatchEvent(new Event('change', { bubbles: true }));
        }, 400);
    }
}, { passive: false });

// Ayah Offset Adjustment Logic
function adjustSuraAyahNumbers(delta) {
    if (!selectedItem || !currentAyahData) {
        appAlert("يرجى تحديد عنصر أولاً أو التأكد من تحميل الصفحة.");
        return;
    }

    // 1. Determine Sura and start Ayah
    let currentSura = 0;
    let startAyah = 0;
    const selectedIdx = selectedItem.index;

    if (selectedItem.type === 'highlight') {
        const h = currentAyahData.ayah_highlights[selectedIdx];
        currentSura = h.sura;
        startAyah = h.ayah;
    } else if (selectedItem.type === 'marker') {
        const m = currentAyahData.ayah_markers[selectedIdx];
        currentSura = m.sura;
        startAyah = m.ayah;
    }

    if (!currentSura) {
        appAlert("لم يتم العثور على السورة للعنصر.");
        return;
    }

    const scopeAll = document.getElementById('adj-scope-all').checked;

    // Start Undo/Redo history transaction
    beginHistoryTransaction(`shift sura ${currentSura} ayahs ${delta > 0 ? '+' : ''}${delta}`);

    // 2. Adjust highlights
    if (currentAyahData.ayah_highlights) {
        currentAyahData.ayah_highlights.forEach((h) => {
            if (h.sura === currentSura) {
                if (scopeAll || h.ayah >= startAyah) {
                    h.ayah = Math.max(1, h.ayah + delta);
                    if (h.source !== 'manual_marker_sync' && !String(h.source || '').includes('renumbered')) {
                        h.source = `${h.source || 'manual'}_renumbered`;
                    }
                }
            }
        });
    }

    // 3. Adjust markers
    if (currentAyahData.ayah_markers) {
        currentAyahData.ayah_markers.forEach((m) => {
            if (m.sura === currentSura) {
                if (scopeAll || m.ayah >= startAyah) {
                    m.ayah = Math.max(1, m.ayah + delta);
                }
            }
        });
    }

    // End history transaction
    endHistoryTransaction();

    // 4. Re-render and update UI
    renderBoxes();
    openRightPanel();
    
    // Automatically trigger save buttons update
    if (typeof updateLeftPanelSaveButtons === 'function') {
        updateLeftPanelSaveButtons();
    }
    
    showToast(`تمت إزاحة آيات السورة ${currentSura} بـ ${delta > 0 ? '+' : ''}${delta}`);
}

// Attach listeners for adjustment buttons
document.getElementById('btn-adj-ayah-minus').addEventListener('click', () => adjustSuraAyahNumbers(-1));
document.getElementById('btn-adj-ayah-plus').addEventListener('click', () => adjustSuraAyahNumbers(1));

// Init
clearRightPanel();

// ==========================================
// Progress Tracker Logic
// ==========================================
const progressModal = document.getElementById('progress-modal-overlay');
const progressGrid = document.getElementById('progress-grid');
const progressBtn = document.getElementById('progress-btn');
const closeProgressBtn = document.getElementById('close-progress-btn');

async function loadProgress() {
    try {
        const res = await fetch('/api/progress');
        const data = await res.json();
        renderProgressGrid(data.progress || []);
    } catch (err) {
        console.error("Failed to load progress", err);
        appAlert("حدث خطأ أثناء تحميل بيانات الإنجاز.", "خطأ");
    }
}

let lastClickedProgressPage = null;

function renderProgressGrid(completedPages) {
    const total = TOTAL_PAGES || 604;
    const completedCount = completedPages.length;
    const percent = Math.round((completedCount / total) * 100);
    
    const countEl = document.getElementById('progress-text-count');
    const percentEl = document.getElementById('progress-text-percent');
    const fillEl = document.getElementById('progress-bar-fill');
    
    if (countEl) countEl.textContent = `${completedCount} / ${total} صفحة`;
    if (percentEl) percentEl.textContent = `${percent}%`;
    if (fillEl) fillEl.style.width = `${percent}%`;

    progressGrid.innerHTML = '';
    for (let i = 1; i <= TOTAL_PAGES; i++) {
        const isCompleted = completedPages.includes(i);
        const card = document.createElement('div');
        card.className = `progress-card ${isCompleted ? 'completed' : ''}`;
        card.textContent = i;
        card.onclick = async (e) => {
            if (e.shiftKey && lastClickedProgressPage !== null && lastClickedProgressPage !== i) {
                const start = Math.min(lastClickedProgressPage, i);
                const end = Math.max(lastClickedProgressPage, i);
                const pagesToToggle = [];
                for (let p = start; p <= end; p++) {
                    pagesToToggle.push(p);
                }
                
                const forceState = !isCompleted; // Force all to the new state of the clicked page
                pagesToToggle.forEach(p => {
                    const el = progressGrid.children[p - 1];
                    if (el) {
                        el.style.opacity = '0.5';
                        el.style.pointerEvents = 'none';
                    }
                });
                
                lastClickedProgressPage = i;
                
                try {
                    const res = await fetch('/api/progress/toggle', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pages: pagesToToggle, forceState })
                    });
                    const data = await res.json();
                    renderProgressGrid(data.progress || []);
                } catch (err) {
                    console.error("Failed to batch toggle progress", err);
                }
            } else {
                lastClickedProgressPage = i;
                card.style.opacity = '0.5';
                card.style.pointerEvents = 'none';
                try {
                    const res = await fetch('/api/progress/toggle', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ page: i })
                    });
                    const data = await res.json();
                    renderProgressGrid(data.progress || []);
                } catch (err) {
                    console.error("Failed to toggle progress", err);
                }
            }
        };
        progressGrid.appendChild(card);
    }
}

progressBtn.addEventListener('click', () => {
    progressModal.style.display = 'flex';
    loadProgress();
});

closeProgressBtn.addEventListener('click', () => {
    progressModal.style.display = 'none';
});

// ==========================================
// Sync and Export Logic
// ==========================================
const syncWindowsCb = document.getElementById('sync-windows');
const syncAndroidCb = document.getElementById('sync-android');
const syncCurrentPageBtn = document.getElementById('sync-current-page-btn');
const syncAllPagesBtn = document.getElementById('sync-all-pages-btn');

const syncModalOverlay = document.getElementById('sync-modal-overlay');
const syncModalTitle = document.getElementById('sync-modal-title');
const syncModalMessage = document.getElementById('sync-modal-message');
const syncTerminalOutput = document.getElementById('sync-terminal-output');
const syncModalStartBtn = document.getElementById('sync-modal-start');
const syncModalCancelBtn = document.getElementById('sync-modal-cancel');

let currentSyncAbortController = null;

function translateSyncOutput(text) {
    if (!text) return "";
    return text
        .replace(/Rebuilding AyahInfo database for Page (.+)\.\.\./g, 'جاري بناء قاعدة بيانات الصفحة $1...')
        .replace(/Rebuilding AyahInfo database for ALL pages\.\.\./g, 'جاري بناء قاعدة بيانات جميع الصفحات (485 صفحة)...')
        .replace(/Database generated at: (.+)/g, 'تم إنشاء القاعدة في:\n$1')
        .replace(/Found Android devices:/g, 'تم العثور على أجهزة أندرويد متصلة:')
        .replace(/Syncing to Windows \((.+)\)\.\.\./g, 'جاري المزامنة مع ويندوز...')
        .replace(/Syncing to Android \((.+)\)\.\.\./g, 'جاري المزامنة مع أندرويد...')
        .replace(/Sync completed successfully!/g, '✅ اكتملت المزامنة بنجاح!')
        .replace(/Skipping Windows sync\.\.\./g, '⚠️ تم تخطي المزامنة مع ويندوز.')
        .replace(/Skipping Android sync\.\.\./g, '⚠️ تم تخطي المزامنة مع أندرويد.')
        .replace(/No Android devices found/g, '❌ لم يتم العثور على أجهزة أندرويد متصلة.')
        .replace(/Failed to copy to Windows/g, '❌ فشل النسخ إلى ويندوز')
        .replace(/Failed to push to Android/g, '❌ فشل النقل إلى أندرويد')
        .replace(/\[PROCESS_EXIT_CODE:(.+)\]/g, '\n[انتهت العملية برموز الخروج: $1]')
        .replace(/\[ERROR: (.+)\]/g, '\n[خطأ: $1]');
}

function openSyncModal(page) {
    const isAll = (page === 'all');
    syncModalTitle.textContent = isAll ? "مزامنة جميع الصفحات" : "مزامنة الصفحة الحالية";
    syncModalMessage.textContent = isAll 
        ? "تنبيه: هذه العملية ستقوم بإعادة بناء قاعدة البيانات لجميع الصفحات الـ 485 وتصديرها.\nقد تستغرق هذه العملية عدة ثوانٍ. هل أنت متأكد؟"
        : `هل أنت متأكد من رغبتك في مزامنة الصفحة ${currentPage} وإرسالها إلى الأجهزة المحددة؟`;
    
    syncTerminalOutput.style.display = 'none';
    syncTerminalOutput.textContent = '';
    
    syncModalStartBtn.textContent = 'بدأ';
    syncModalStartBtn.style.display = 'inline-block';
    syncModalStartBtn.disabled = false;
    syncModalCancelBtn.textContent = 'إلغاء';
    
    syncModalOverlay.style.display = 'flex';
    
    const skipWindows = !syncWindowsCb.checked;
    const skipAndroid = !syncAndroidCb.checked;
    
    syncModalStartBtn.onclick = async () => {
        syncModalStartBtn.disabled = true;
        syncTerminalOutput.style.display = 'block';
        syncTerminalOutput.textContent = 'جاري الاتصال بالسيرفر...\n';
        
        currentSyncAbortController = new AbortController();
        
        try {
            const res = await fetch('/api/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ page, skipWindows, skipAndroid }),
                signal: currentSyncAbortController.signal
            });
            
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let processExitCode = null;
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                const translatedChunk = translateSyncOutput(chunk);
                syncTerminalOutput.textContent += translatedChunk;
                syncTerminalOutput.scrollTop = syncTerminalOutput.scrollHeight;
                
                const match = chunk.match(/\[PROCESS_EXIT_CODE:(\d+)\]/);
                if (match) {
                    processExitCode = match[1];
                }
            }
            
            if (processExitCode === '0' && page !== 'all') {
                loadProgress();
            }
            
        } catch (err) {
            if (err.name === 'AbortError') {
                syncTerminalOutput.textContent += '\nتم الإلغاء.\n';
            } else {
                syncTerminalOutput.textContent += `\nخطأ: ${err.message}\n`;
            }
        } finally {
            syncModalStartBtn.style.display = 'none';
            syncModalCancelBtn.textContent = 'إغلاق';
            currentSyncAbortController = null;
        }
    };
    
    syncModalCancelBtn.onclick = () => {
        if (currentSyncAbortController) {
            currentSyncAbortController.abort();
        }
        syncModalOverlay.style.display = 'none';
    };
}

syncCurrentPageBtn.addEventListener('click', () => {
    openSyncModal(currentPage);
});

syncAllPagesBtn.addEventListener('click', () => {
    openSyncModal('all');
});


// ==========================================
// أدوات الرسم والتلوين ومسح النقاط (تعديل الصورة)
// ==========================================
let isDrawingMode = false;
let isPainting = false;
let hasUnsavedDrawings = false;
let brushColor = localStorage.getItem('warsh_muthamman_brush_color') || '#000000';
let lastBrushColor = localStorage.getItem('warsh_muthamman_brush_color') || '#000000';

function saveBrushColor(color) {
    localStorage.setItem('warsh_muthamman_brush_color', color);
}
let brushSize = 10;
let brushOpacity = 100;
let drawingHistory = []; // للاحتفاظ باللقطات المحلية للتراجع خطوة بخطوة
let committedImageData = null; // للاحتفاظ بالرسم الفعلي دون خطوط المعاينة المؤقتة
let enhancementBaseImageData = null; // للحفاظ على نسخة خام للتعديل والتحسين دون تراكم
let hasLastPoint = false; // لمزامنة البداية مع آخر موضع تم الرسم فيه

const drawingCanvas = document.getElementById('drawing-canvas');
const drawingModeToggle = document.getElementById('drawing-mode-toggle');
const drawingControlsPanel = document.getElementById('drawing-controls-panel');
const brushSizeSlider = document.getElementById('brush-size');
const brushOpacitySlider = document.getElementById('brush-opacity');
const brushSizeLabel = document.getElementById('val-brush-size');
const brushOpacityLabel = document.getElementById('val-brush-opacity');

// عناصر التحكم الجديدة (Segmented Control & Color Dots)
const segmentBtnBrush = document.getElementById('segment-btn-brush');
const segmentBtnEraser = document.getElementById('segment-btn-eraser');
const colorDotBlack = document.getElementById('color-dot-black');
const colorDotWhite = document.getElementById('color-dot-white');
const colorDotRed = document.getElementById('color-dot-red');
const colorDotYellow = document.getElementById('color-dot-yellow');
const colorDotGreen = document.getElementById('color-dot-green');
const colorDotBlue = document.getElementById('color-dot-blue');
const btnCustomColor = document.getElementById('btn-custom-color');
const enhanceColorPicker = document.getElementById('enhance-color-picker');

const btnDrawingUndo = document.getElementById('btn-drawing-undo');
const btnDrawingClear = document.getElementById('btn-drawing-clear');
const btnDrawingRestore = document.getElementById('btn-drawing-restore');

// تهيئة نظام الرسم
function initDrawingSystem() {
    if (!drawingCanvas) return;
    
    // ربط مستمعي الأحداث للماوس واللمس للرسم
    drawingCanvas.addEventListener('pointerdown', startDrawing);
    drawingCanvas.addEventListener('pointermove', draw);
    drawingCanvas.addEventListener('pointerup', stopDrawing);
    drawingCanvas.addEventListener('pointerleave', (e) => {
        stopDrawing();
        if (isDrawingMode && committedImageData) {
            const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });
            ctx.putImageData(committedImageData, 0, 0);
        }
    });
    
    // ربط تبديل وضع الرسم
    if (drawingModeToggle) {
        // استعادة الحالة المحفوظة من localStorage
        const savedMode = localStorage.getItem('warsh_muthamman_drawing_mode') === 'true';
        drawingModeToggle.checked = savedMode;
        isDrawingMode = savedMode;
        
        if (isDrawingMode) {
            drawingCanvas.style.display = 'block';
            if (drawingControlsPanel) drawingControlsPanel.style.display = 'flex';
            const zoomBar = document.getElementById('zoom-bar');
            if (zoomBar) zoomBar.style.display = 'flex';
            
            // تعطيل تفاعلات الفأرة مع المربعات لتسهيل الرسم
            document.getElementById('overlay-container').style.pointerEvents = 'none';
            
            // تهيئة الكانفاس بعد قليل للتأكد من تحميل أبعاد الصورة
            setTimeout(() => {
                setupDrawingCanvasForCurrentImage();
                updateActiveColorUI();
            }, 100);
        }

        drawingModeToggle.addEventListener('change', (e) => {
            isDrawingMode = e.target.checked;
            localStorage.setItem('warsh_muthamman_drawing_mode', isDrawingMode);
            if (isDrawingMode) {
                drawingCanvas.style.display = 'block';
                if (drawingControlsPanel) drawingControlsPanel.style.display = 'flex';
                const zoomBar = document.getElementById('zoom-bar');
                if (zoomBar) zoomBar.style.display = 'flex';
                
                // تعطيل تفاعلات الفأرة مع المربعات لتسهيل الرسم
                document.getElementById('overlay-container').style.pointerEvents = 'none';
                
                // تهيئة الكانفاس بالصورة الحالية
                setupDrawingCanvasForCurrentImage();
                
                // تحديث الواجهة لتطابق اللون والفرشاة الحاليين
                updateActiveColorUI();
                
                showToast('تم تفعيل وضع الرسم 🖌️ (تفاعل المربعات معطل حالياً)');
            } else {
                if (hasUnsavedDrawings) {
                    appConfirm('لديك تعديلات رسومية غير محفوظة. هل تريد الخروج دون حفظ؟', 'تعديلات غير محفوظة').then(confirmExit => {
                        if (confirmExit) {
                            disableDrawingModeUI();
                        } else {
                            drawingModeToggle.checked = true;
                            isDrawingMode = true;
                            localStorage.setItem('warsh_muthamman_drawing_mode', 'true');
                        }
                    });
                } else {
                    disableDrawingModeUI();
                }
            }
        });
    }
    
    // ربط منزلق الحجم
    if (brushSizeSlider) {
        brushSizeSlider.addEventListener('input', (e) => {
            brushSize = parseInt(e.target.value);
            if (brushSizeLabel) brushSizeLabel.textContent = `${brushSize}px`;
            updateCanvasCursor();
        });
    }
    
    // ربط منزلق الشفافية
    if (brushOpacitySlider) {
        brushOpacitySlider.addEventListener('input', (e) => {
            brushOpacity = parseInt(e.target.value);
            if (brushOpacityLabel) brushOpacityLabel.textContent = `${brushOpacity}%`;
        });
    }
    
    // ربط مفاتيح الأداة (قلم / ممحاة)
    if (segmentBtnBrush) {
        segmentBtnBrush.addEventListener('click', () => selectTool('brush'));
    }
    if (segmentBtnEraser) {
        segmentBtnEraser.addEventListener('click', () => selectTool('eraser'));
    }
    
    // ربط الألوان السريعة
    const quickColorDots = [
        { el: colorDotBlack, color: '#000000' },
        { el: colorDotWhite, color: '#ffffff' },
        { el: colorDotRed, color: '#f44336' },
        { el: colorDotYellow, color: '#ffeb3b' },
        { el: colorDotGreen, color: '#4caf50' },
        { el: colorDotBlue, color: '#2196f3' }
    ];
    
    quickColorDots.forEach(item => {
        if (item.el) {
            item.el.addEventListener('click', () => {
                lastBrushColor = item.color;
                saveBrushColor(lastBrushColor);
                selectTool('brush');
            });
        }
    });
    
    // ربط منتقي الألوان المتقدم
    if (enhanceColorPicker) {
        enhanceColorPicker.addEventListener('input', (e) => {
            lastBrushColor = e.target.value;
            saveBrushColor(lastBrushColor);
            selectTool('brush');
        });
        enhanceColorPicker.addEventListener('change', (e) => {
            lastBrushColor = e.target.value;
            saveBrushColor(lastBrushColor);
            selectTool('brush');
        });
    }
    // أزرار التحكم بالرسم
    const btnDrawingGimp = document.getElementById('btn-drawing-gimp');
    if (btnDrawingGimp) {
        btnDrawingGimp.addEventListener('click', async () => {
            const pageStr = String(currentPage).padStart(3, '0');
            const filepath = `pages/warsh_muthamman_png/page${pageStr}.png`;
            try {
                const res = await fetch('/api/open-in-gimp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filepath })
                });
                if (res.ok) {
                    showToast('تم إرسال أمر الفتح في GIMP');
                } else {
                    const err = await res.json();
                    showToast('خطأ: ' + (err.error || 'غير معروف'));
                }
            } catch (e) {
                console.error(e);
                showToast('فشل الاتصال بالسيرفر');
            }
        });
    }
    const btnDrawingSaveLocal = document.getElementById('btn-drawing-save-local');
    if (btnDrawingSaveLocal) {
        btnDrawingSaveLocal.addEventListener('click', async () => {
            const success = await saveDrawingToServer();
            if (success) showToast('تم الحفظ بنجاح');
        });
    }

    if (btnDrawingUndo) {
        btnDrawingUndo.addEventListener('click', undoDrawing);
    }
    if (btnDrawingClear) {
        btnDrawingClear.addEventListener('click', () => {
            appConfirm('هل أنت متأكد من مسح كافة الرسومات غير المحفوظة في الصفحة الحالية؟', 'مسح التعديلات الحالية').then(confirmed => {
                if (confirmed) clearDrawing();
            });
        });
    }
    if (btnDrawingRestore) {
        btnDrawingRestore.addEventListener('click', () => {
            appConfirm('⚠️ تحذير: سيتم استعادة الصورة الخام الأصلية من السيرفر وحذف جميع التعديلات المحفوظة سابقاً نهائياً. هل تتابع؟', 'استعادة الصورة الخام').then(confirmed => {
                if (confirmed) restoreOriginalImage();
            });
        });
    }
    
    // ==========================================
    // التبديل بين تبويبات لوحة الرسم (رسم / تعديل وتحسين)
    // ==========================================
    const tabBtnDraw = document.getElementById('panel-tab-draw-btn');
    const tabBtnEnhance = document.getElementById('panel-tab-enhance-btn');
    const tabContentDraw = document.getElementById('panel-tab-content-draw');
    const tabContentEnhance = document.getElementById('panel-tab-content-enhance');

    if (tabBtnDraw && tabBtnEnhance && tabContentDraw && tabContentEnhance) {
        tabBtnDraw.addEventListener('click', () => {
            tabBtnDraw.classList.add('active');
            tabBtnEnhance.classList.remove('active');
            tabContentDraw.style.display = 'flex';
            tabContentEnhance.style.display = 'none';
        });

        tabBtnEnhance.addEventListener('click', () => {
            tabBtnEnhance.classList.add('active');
            tabBtnDraw.classList.remove('active');
            tabContentEnhance.style.display = 'flex';
            tabContentDraw.style.display = 'none';
            
            if (!enhancementBaseImageData) {
                const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });
                enhancementBaseImageData = ctx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
            }
        });
    }

    // ==========================================
    // مستمعي منزلقات التعديل والتحسين (معاينة حية)
    // ==========================================
    const sliderContrast = document.getElementById('enhance-contrast');
    const sliderSaturation = document.getElementById('enhance-saturation');
    const sliderSharpness = document.getElementById('enhance-sharpness');
    const sliderStrength = document.getElementById('enhance-strength');

    const labelContrast = document.getElementById('val-enhance-contrast');
    const labelSaturation = document.getElementById('val-enhance-saturation');
    const labelSharpness = document.getElementById('val-enhance-sharpness');
    const labelStrength = document.getElementById('val-enhance-strength');

    const btnResetEnhance = document.getElementById('btn-reset-enhance');

    let enhanceAnimFrame = null;
    function triggerEnhancementPreview() {
        if (enhanceAnimFrame) cancelAnimationFrame(enhanceAnimFrame);
        enhanceAnimFrame = requestAnimationFrame(() => {
            const contrast = parseFloat(sliderContrast.value);
            const saturation = parseFloat(sliderSaturation.value);
            const sharpness = parseFloat(sliderSharpness.value);
            const cleanStrength = parseFloat(sliderStrength.value);

            if (labelContrast) labelContrast.textContent = contrast.toFixed(2);
            if (labelSaturation) labelSaturation.textContent = saturation.toFixed(2);
            if (labelSharpness) labelSharpness.textContent = sharpness.toFixed(2);
            if (labelStrength) labelStrength.textContent = cleanStrength.toFixed(2);

            if (!enhancementBaseImageData) {
                const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });
                enhancementBaseImageData = ctx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
            }

            // تطبيق التعديل على الكانفاس
            applyEnhancements(enhancementBaseImageData, contrast, saturation, sharpness, cleanStrength);

            hasUnsavedDrawings = true;
            updateDrawingSaveState();
        });
    }

    if (sliderContrast) sliderContrast.addEventListener('input', triggerEnhancementPreview);
    if (sliderSaturation) sliderSaturation.addEventListener('input', triggerEnhancementPreview);
    if (sliderSharpness) sliderSharpness.addEventListener('input', triggerEnhancementPreview);
    if (sliderStrength) sliderStrength.addEventListener('input', triggerEnhancementPreview);

    const btnApplyDefaults = document.getElementById('btn-apply-defaults');
    if (btnApplyDefaults) {
        btnApplyDefaults.addEventListener('click', () => {
            if (sliderContrast) sliderContrast.value = 1.10;
            if (sliderSaturation) sliderSaturation.value = 1.12;
            if (sliderSharpness) sliderSharpness.value = 1.07;
            if (sliderStrength) sliderStrength.value = 0.75;
            
            triggerEnhancementPreview();
            showToast('تم تطبيق قيم التحسين الافتراضية بنجاح');
        });
    }

    if (btnResetEnhance) {
        btnResetEnhance.addEventListener('click', () => {
            if (sliderContrast) sliderContrast.value = 1.00;
            if (sliderSaturation) sliderSaturation.value = 1.00;
            if (sliderSharpness) sliderSharpness.value = 1.00;
            if (sliderStrength) sliderStrength.value = 0.00;
            
            triggerEnhancementPreview();
            showToast('تم إعادة تعيين قيم التحسين إلى الوضع الأصلي');
        });
    }
}

// تطبيق تعديلات التباين والتشبع وتفتيح الخلفية والحدة بكسل بكسل في المتصفح
function applyEnhancements(baseData, contrast, saturation, sharpness, cleanStrength) {
    if (!drawingCanvas) return;
    const width = baseData.width;
    const height = baseData.height;
    const src = baseData.data;
    const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });
    const outData = ctx.createImageData(width, height);
    const dst = outData.data;
    
    // 1. التباين والتشبع وتفتيح الخلفية في ممر واحد فائق السرعة
    for (let i = 0; i < src.length; i += 4) {
        let r = src[i];
        let g = src[i+1];
        let b = src[i+2];
        let a = src[i+3];
        
        // تبييض الخلفية (clean background)
        if (cleanStrength > 0) {
            const high = Math.max(r, g, b);
            const low = Math.min(r, g, b);
            const spread = high - low;
            if (low >= 185) {
                if (high > 218 && spread < 38) isBg = true;
                else if (r > 205 && g > 202 && b > 178 && (r - b) < 55 && (g - b) < 55) isBg = true;
                else if (high > 230 && low > 195 && spread < 65) isBg = true;
            }
            
            if (isBg) {
                r = r + (255 - r) * cleanStrength;
                g = g + (255 - g) * cleanStrength;
                b = b + (255 - b) * cleanStrength;
            }
        }
        
        // التباين (Contrast)
        if (contrast !== 1.0) {
            r = (r - 128) * contrast + 128;
            g = (g - 128) * contrast + 128;
            b = (b - 128) * contrast + 128;
        }
        
        // التشبع (Saturation)
        if (saturation !== 1.0) {
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            r = lum + (r - lum) * saturation;
            g = lum + (g - lum) * saturation;
            b = lum + (b - lum) * saturation;
        }
        
        dst[i] = Math.max(0, Math.min(255, r));
        dst[i+1] = Math.max(0, Math.min(255, g));
        dst[i+2] = Math.max(0, Math.min(255, b));
        dst[i+3] = a;
    }
    
    // 2. حدة الحواف (Sharpness) باستخدام مصفوفة Convolution
    if (sharpness !== 1.0) {
        const s = sharpness - 1.0;
        const w4 = width * 4;
        const temp = new Uint8ClampedArray(dst); // أخذ نسخة من النتيجة السابقة
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                
                for (let c = 0; c < 3; c++) {
                    const val = temp[idx + c] * (1 + 4 * s)
                              - temp[idx - w4 + c] * s // البكسل الأعلى
                              - temp[idx + w4 + c] * s // البكسل الأسفل
                              - temp[idx - 4 + c] * s  // البكسل الأيسر
                              - temp[idx + 4 + c] * s; // البكسل الأيمن
                    dst[idx + c] = Math.max(0, Math.min(255, val));
                }
            }
        }
    }
    
    ctx.putImageData(outData, 0, 0);
}

function applyEnhancements(baseData, contrast, saturation, sharpness, cleanStrength) {
    if (!drawingCanvas) return;
    const width = baseData.width;
    const height = baseData.height;
    const src = baseData.data;
    const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });
    const outData = ctx.createImageData(width, height);
    const dst = outData.data;

    const pixelCount = width * height;
    const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
    const luminance = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

    let meanLum = 0;
    for (let i = 0; i < src.length; i += 4) {
        meanLum += luminance(src[i], src[i + 1], src[i + 2]);
    }
    meanLum /= pixelCount;

    let work = new Float32Array(src.length);
    for (let i = 0; i < src.length; i += 4) {
        let r = src[i];
        let g = src[i + 1];
        let b = src[i + 2];

        if (contrast !== 1.0) {
            r = meanLum + (r - meanLum) * contrast;
            g = meanLum + (g - meanLum) * contrast;
            b = meanLum + (b - meanLum) * contrast;
        }

        if (saturation !== 1.0) {
            const lum = luminance(r, g, b);
            r = lum + (r - lum) * saturation;
            g = lum + (g - lum) * saturation;
            b = lum + (b - lum) * saturation;
        }

        work[i] = r;
        work[i + 1] = g;
        work[i + 2] = b;
        work[i + 3] = src[i + 3];
    }

    const unsharp = (input, amount, threshold) => {
        const output = new Float32Array(input);
        const weights = [
            1, 2, 1,
            2, 4, 2,
            1, 2, 1,
        ];
        const offsets = [
            -width - 1, -width, -width + 1,
            -1, 0, 1,
            width - 1, width, width + 1,
        ];

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                let maxDiff = 0;
                const next = [0, 0, 0];

                for (let c = 0; c < 3; c++) {
                    let blurred = 0;
                    for (let k = 0; k < 9; k++) {
                        blurred += input[idx + offsets[k] * 4 + c] * weights[k];
                    }
                    blurred /= 16;
                    const diff = input[idx + c] - blurred;
                    maxDiff = Math.max(maxDiff, Math.abs(diff));
                    next[c] = input[idx + c] + diff * amount;
                }

                if (maxDiff > threshold) {
                    output[idx] = next[0];
                    output[idx + 1] = next[1];
                    output[idx + 2] = next[2];
                }
            }
        }

        return output;
    };

    if (sharpness !== 1.0) {
        work = unsharp(work, sharpness - 1.0, 0);
        work = unsharp(work, 0.45, 4);
    }

    for (let i = 0; i < work.length; i += 4) {
        let r = work[i];
        let g = work[i + 1];
        let b = work[i + 2];

        if (cleanStrength > 0) {
            const high = Math.max(r, g, b);
            const low = Math.min(r, g, b);
            const spread = high - low;
            let isBg = false;

            if (low >= 185) {
                if (high > 218 && spread < 38) isBg = true;
                else if (r > 205 && g > 202 && b > 178 && (r - b) < 55 && (g - b) < 55) isBg = true;
                else if (high > 230 && low > 195 && spread < 65) isBg = true;
            }

            if (isBg) {
                r = r + (255 - r) * cleanStrength;
                g = g + (255 - g) * cleanStrength;
                b = b + (255 - b) * cleanStrength;
            }
        }

        dst[i] = clamp(r);
        dst[i + 1] = clamp(g);
        dst[i + 2] = clamp(b);
        dst[i + 3] = src[i + 3];
    }

    ctx.putImageData(outData, 0, 0);
}

let customCursorDiv = null;

// تحديث مؤشر الرسم (علامة + مع هالة) أو الممحاة بناءً على حجم الفرشاة واللون
function updateCanvasCursor() {
    if (!drawingCanvas) return;
    
    if (!customCursorDiv) {
        customCursorDiv = document.createElement('div');
        customCursorDiv.id = 'custom-brush-cursor';
        customCursorDiv.style.position = 'fixed';
        customCursorDiv.style.pointerEvents = 'none';
        customCursorDiv.style.zIndex = '999999';
        customCursorDiv.style.display = 'none';
        customCursorDiv.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(customCursorDiv);
        
        document.addEventListener('pointermove', (e) => {
            if (customCursorDiv.style.display === 'block') {
                customCursorDiv.style.left = e.clientX + 'px';
                customCursorDiv.style.top = e.clientY + 'px';
            }
        }, { passive: true });
        
        const imageContainer = document.getElementById('image-container');
        if (imageContainer) {
            imageContainer.addEventListener('pointerenter', () => {
                // altHeld سيتم تعريفها لاحقا، نستخدم window.altHeld احتياطيا
                if (isDrawingMode && !window.altHeld) customCursorDiv.style.display = 'block';
            });
            imageContainer.addEventListener('pointerleave', () => {
                customCursorDiv.style.display = 'none';
            });
        }
    }
    
    if (window.altHeld || !isDrawingMode) {
        customCursorDiv.style.display = 'none';
        drawingCanvas.style.cursor = '';
        const imageWrapper = document.getElementById('image-wrapper');
        if (imageWrapper) imageWrapper.style.cursor = '';
        return;
    }
    
    const isEraser = segmentBtnEraser && segmentBtnEraser.classList.contains('active');
    
    const baseWidth = drawingCanvas.offsetWidth || drawingCanvas.getBoundingClientRect().width;
    const targetRenderedWidth = baseWidth * scale;
    const canvasWidth = drawingCanvas.width || 1265;
    const scaleFactor = canvasWidth > 0 ? (targetRenderedWidth / canvasWidth) : 1;
    
    const displayDiameter = Math.max(2, Math.round(brushSize * scaleFactor));
    
    const size = displayDiameter + 24;
    const center = size / 2;
    const radius = displayDiameter / 2;
    
    let svgContent = '';
    
    svgContent += `<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#000000" stroke-width="2.5" />`;
    svgContent += `<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-dasharray="3,3" />`;
    
    if (isEraser) {
        svgContent += `<rect x="${center-3}" y="${center-3}" width="6" height="6" fill="none" stroke="#000000" stroke-width="2.5" />`;
        svgContent += `<rect x="${center-3}" y="${center-3}" width="6" height="6" fill="none" stroke="#ffffff" stroke-width="1.2" />`;
    } else {
        svgContent += `<line x1="${center-5}" y1="${center}" x2="${center+5}" y2="${center}" stroke="#000000" stroke-width="2.5" stroke-linecap="square" />`;
        svgContent += `<line x1="${center}" y1="${center-5}" x2="${center}" y2="${center+5}" stroke="#000000" stroke-width="2.5" stroke-linecap="square" />`;
        
        svgContent += `<line x1="${center-4}" y1="${center}" x2="${center+4}" y2="${center}" stroke="${brushColor}" stroke-width="1.2" stroke-linecap="square" />`;
        svgContent += `<line x1="${center}" y1="${center-4}" x2="${center}" y2="${center+4}" stroke="${brushColor}" stroke-width="1.2" stroke-linecap="square" />`;
    }
    
    customCursorDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${svgContent}</svg>`;
    
    const imageContainer = document.getElementById('image-container');
    if (imageContainer && imageContainer.matches(':hover')) {
        customCursorDiv.style.display = 'block';
    }
    
    drawingCanvas.style.cursor = 'none';
    const imageWrapper = document.getElementById('image-wrapper');
    if (imageWrapper) imageWrapper.style.cursor = 'none';
}

// التحكم في الأداة والربط البصري
function selectTool(tool) {
    if (tool === 'brush') {
        if (segmentBtnBrush) segmentBtnBrush.classList.add('active');
        if (segmentBtnEraser) segmentBtnEraser.classList.remove('active');
        brushColor = lastBrushColor;
    } else if (tool === 'eraser') {
        if (segmentBtnEraser) segmentBtnEraser.classList.add('active');
        if (segmentBtnBrush) segmentBtnBrush.classList.remove('active');
        brushColor = '#ffffff';
    }
    updateActiveColorUI();
}

// تحديث الأنماط البصرية للألوان النشطة
function updateActiveColorUI() {
    const dots = [
        colorDotBlack, colorDotWhite, colorDotRed,
        colorDotYellow, colorDotGreen, colorDotBlue
    ];
    
    dots.forEach(dot => {
        if (dot) {
            dot.classList.remove('active');
        }
    });
    if (btnCustomColor) {
        btnCustomColor.classList.remove('active');
        btnCustomColor.style.borderColor = 'rgba(255,255,255,0.15)';
        btnCustomColor.style.boxShadow = 'none';
    }

    // إذا كنا نستخدم الممحاة، فلا نحدد أي لون كنشط عدا لو كان يطابق الأبيض
    if (segmentBtnEraser && segmentBtnEraser.classList.contains('active')) {
        updateCanvasCursor();
        return; // لا نظهر أي لون نشط أثناء استخدام الممحاة
    }

    const matchedDot = dots.find(dot => dot && dot.getAttribute('data-color') === brushColor);
    if (matchedDot) {
        matchedDot.classList.add('active');
    } else {
        if (btnCustomColor) {
            btnCustomColor.classList.add('active');
            btnCustomColor.style.borderColor = '#FF9800';
            btnCustomColor.style.boxShadow = '0 0 8px rgba(255, 152, 0, 0.5)';
        }
    }
    updateCanvasCursor();
}

// تحديث مؤشر الفأرة (الكروس هير +) مع هالة تبين الحجم الفعلي للفرشاة
function updateCanvasCursor() {
    if (!drawingCanvas) return;
    
    const isEraser = segmentBtnEraser && segmentBtnEraser.classList.contains('active');
    
    const rect = drawingCanvas.getBoundingClientRect();
    const canvasWidth = drawingCanvas.width || 1265;
    const scaleFactor = rect.width ? (rect.width / canvasWidth) : 1;
    const displayDiameter = Math.max(2, brushSize * scaleFactor);
    
    const outlineWidth = 1.5;
    const dashWidth = 1;
    const size = Math.ceil(displayDiameter + 16);
    const center = size / 2;
    const radius = Math.max(0.5, (displayDiameter - outlineWidth) / 2);
    
    // بناء محتوى SVG بدون تعليقات عربية لتجنب خطأ btoa()
    let svgContent = '';
    
    // 1. رسم الهالة (دائرة سوداء مستمرة ودائرة بيضاء متقطعة لضمان الوضوح على أي خلفية)
    svgContent += `<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#000000" stroke-width="${outlineWidth}" />`;
    svgContent += `<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#ffffff" stroke-width="${dashWidth}" stroke-dasharray="3,3" />`;
    
    // 2. رسم المؤشر المركزي (علامة + للفرشاة ومربع للممحاة) مع تحديد أسود عالي التباين
    if (isEraser) {
        // مؤشر الممحاة: مربع صغير بدبل ستير
        svgContent += `<rect x="${center-3}" y="${center-3}" width="6" height="6" fill="none" stroke="#000000" stroke-width="2.5" />`;
        svgContent += `<rect x="${center-3}" y="${center-3}" width="6" height="6" fill="none" stroke="#ffffff" stroke-width="1.2" />`;
    } else {
        // مؤشر الفرشاة: كروس هير (+) بلون الفرشاة مع حدود سوداء واضحة جداً
        svgContent += `<line x1="${center-4}" y1="${center}" x2="${center+4}" y2="${center}" stroke="#000000" stroke-width="2.5" stroke-linecap="square" />`;
        svgContent += `<line x1="${center}" y1="${center-4}" x2="${center}" y2="${center+4}" stroke="#000000" stroke-width="2.5" stroke-linecap="square" />`;
        
        svgContent += `<line x1="${center-4}" y1="${center}" x2="${center+4}" y2="${center}" stroke="${brushColor}" stroke-width="1.2" stroke-linecap="square" />`;
        svgContent += `<line x1="${center}" y1="${center-4}" x2="${center}" y2="${center+4}" stroke="${brushColor}" stroke-width="1.2" stroke-linecap="square" />`;
    }
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${svgContent}</svg>`;
    
    try {
        const encoded = btoa(svg);
        drawingCanvas.style.cursor = `url('data:image/svg+xml;base64,${encoded}') ${center} ${center}, crosshair`;
    } catch (err) {
        console.error('Failed to encode SVG cursor:', err);
    }
}

function disableDrawingModeUI() {
    isDrawingMode = false;
    localStorage.setItem('warsh_muthamman_drawing_mode', 'false');
    drawingCanvas.style.display = 'none';
    if (drawingControlsPanel) drawingControlsPanel.style.display = 'none';
    const zoomBar = document.getElementById('zoom-bar');
    if (zoomBar) zoomBar.style.display = 'none';
    const overlayContainer = document.getElementById('overlay-container');
    overlayContainer.style.pointerEvents = 'auto';
    overlayContainer.style.opacity = '1';
    hasUnsavedDrawings = false;
    updateDrawingSaveState();
    if (drawingModeToggle) drawingModeToggle.checked = false;
    
    // Reload original image to ensure no local canvas remnants
    const pageStr = String(currentPage).padStart(3, '0');
    DOM.img.src = `${IMAGE_BASE_PATH}${pageStr}.png?v=${Date.now()}`;
}

// رسم الصورة الحالية في الكانفاس
function setupDrawingCanvasForCurrentImage() {
    if (!drawingCanvas || !DOM.img) return;
    const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });
    
    // ضبط حجم الكانفاس الحقيقي ليطابق أبعاد الصورة الفعلية
    drawingCanvas.width = DOM.img.naturalWidth || DOM.img.width || 1265;
    drawingCanvas.height = DOM.img.naturalHeight || DOM.img.height || 2004;
    
    ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    ctx.drawImage(DOM.img, 0, 0, drawingCanvas.width, drawingCanvas.height);
    
    // تفريغ التاريخ للرسم الحالي وحفظ الحالة الأولى
    drawingHistory = [ctx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height)];
    committedImageData = ctx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
    enhancementBaseImageData = null;
    hasLastPoint = false;
    hasUnsavedDrawings = false;
    updateDrawingSaveState();
}

// إحداثيات الفأرة/اللمس الحقيقية داخل الكانفاس
function getCanvasMousePos(e) {
    const rect = drawingCanvas.getBoundingClientRect();
    
    // تحويل إحداثيات الحدث (e.clientX, e.clientY) بدقة بناء على حجم الشاشة المعروض والحجم الفعلي
    const x = (e.clientX - rect.left) / rect.width * drawingCanvas.width;
    const y = (e.clientY - rect.top) / rect.height * drawingCanvas.height;
    
    return { x, y };
}

let lastX = 0;
let lastY = 0;

function startDrawing(e) {
    if (!isDrawingMode || e.button !== 0 || e.altKey) return; // رسم باليسار فقط وبشرط عدم ضغط Alt (للسحب والتحريك)
    const pos = getCanvasMousePos(e);
    const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });
    
    // استعادة النسخة النظيفة أولاً لإزالة خط المعاينة الوهمي قبل الحفظ في السجل وقبل الرسم
    if (committedImageData) {
        ctx.putImageData(committedImageData, 0, 0);
    }

    // حفظ اللقطة الحالية قبل الرسم الجديد للتراجع
    if (drawingHistory.length >= 25) {
        drawingHistory.shift(); // حد أقصى للذاكرة
    }
    drawingHistory.push(ctx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height));

    if (e.shiftKey && hasLastPoint) {
        // رسم خط مستقيم من آخر نقطة إلى الموضع الحالي (ميزة على غرار GIMP)
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = brushOpacity / 100;
        ctx.stroke();

        lastX = pos.x;
        lastY = pos.y;
        hasLastPoint = true;
        
        committedImageData = ctx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
        hasUnsavedDrawings = true;
        updateDrawingSaveState();
        isPainting = false;
    } else {
        // رسم حر عادي
        isPainting = true;
        lastX = pos.x;
        lastY = pos.y;
        hasLastPoint = true;
    }
}

function draw(e) {
    if (!isDrawingMode) return;
    const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });
    const pos = getCanvasMousePos(e);
    
    if (isPainting) {
        // وضع الرسم الحر
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = brushOpacity / 100;
        
        ctx.stroke();
        
        lastX = pos.x;
        lastY = pos.y;
    } else {
        // معاينة الخط المستقيم عند الضغط على Shift وتحريك الماوس (ميزة على غرار GIMP)
        if (e.shiftKey && hasLastPoint) {
            if (committedImageData) {
                ctx.putImageData(committedImageData, 0, 0);
            }
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(pos.x, pos.y);

            ctx.strokeStyle = '#000000';
            ctx.lineWidth = brushSize + 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.globalAlpha = 0.45;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(pos.x, pos.y);
            
            ctx.strokeStyle = brushColor;
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.globalAlpha = (brushOpacity / 100) * 0.5; // شفافية 50% للمعاينة
            
            ctx.stroke();
            ctx.globalAlpha = 1;
        } else {
            // تنظيف خط المعاينة في حال ترك زر Shift
            if (committedImageData) {
                ctx.putImageData(committedImageData, 0, 0);
            }
        }
    }
}

function stopDrawing() {
    if (isPainting) {
        isPainting = false;
        hasUnsavedDrawings = true;
        updateDrawingSaveState();
        
        // حفظ الحالة الرسمية المعتمدة
        const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });
        committedImageData = ctx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
        enhancementBaseImageData = null;
    }
}

// تراجع خطوة
function undoDrawing() {
    if (drawingHistory.length === 0 || !isDrawingMode) return;
    const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });
    const lastState = drawingHistory.pop();
    ctx.putImageData(lastState, 0, 0);
    
    // تحديث الحالة المعتمدة
    committedImageData = ctx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
    enhancementBaseImageData = null;
    
    // إذا كان المتبقي هو الحالة الابتدائية فقط، نحدد أنه لا توجد تعديلات غير محفوظة
    if (drawingHistory.length === 0) {
        hasUnsavedDrawings = false;
        hasLastPoint = false;
        // أعد إدخال الحالة الابتدائية
        drawingHistory.push(ctx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height));
    } else {
        hasUnsavedDrawings = true;
    }
    updateDrawingSaveState();
    showToast('تم التراجع عن خطوة الرسم');
}

// مسح الكانفاس والرجوع للصورة الحالية
function clearDrawing() {
    setupDrawingCanvasForCurrentImage();
    showToast('تم مسح الرسومات المضافة');
}

// تحديث البادج وأزرار الحفظ لتنبيه المستخدم بالتعديلات
function updateDrawingSaveState() {
    const badge = document.getElementById('save-status-badge');
    if (badge) {
        if (hasUnsavedDrawings) {
            badge.textContent = "صورة غير محفوظة ⚠️";
            badge.className = "badge badge-unsaved";
        } else {
            // الحالة الطبيعية سيتحكم فيها العارض للمربعات
            if (selectedItem) {
                openRightPanel();
            } else {
                badge.textContent = "تم الحفظ ✓";
                badge.className = "badge badge-saved";
            }
        }
    }
    updateUndoRedoButtons();
}

// إرسال الصورة للسيرفر
async function saveDrawingToServer() {
    if (!drawingCanvas) return false;
    
    const pageStr = String(currentPage).padStart(3, '0');
    const filepath = `pages/warsh_muthamman_png/page${pageStr}.png`;
    const image = drawingCanvas.toDataURL('image/png');
    
    try {
        const res = await fetch('/api/save-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filepath, image })
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.error || 'Save image failed');
        
        hasUnsavedDrawings = false;
        updateDrawingSaveState();
        
        // تحديث الصورة في المتصفح
        const cacheBust = Date.now();
        DOM.img.src = `../pages/warsh_muthamman_png/page${pageStr}.png?v=${cacheBust}`;
        
        // إعادة تهيئة الكانفاس بالصورة الجديدة لتكون الأساس الجديد
        setTimeout(setupDrawingCanvasForCurrentImage, 100);
        
        return true;
    } catch (err) {
        console.error(err);
        showToast('خطأ أثناء حفظ الصورة! هل السيرفر يعمل؟', true);
        return false;
    }
}

// استعادة الصورة الأصلية الخام
async function restoreOriginalImage() {
    const pageStr = String(currentPage).padStart(3, '0');
    const filepath = `pages/warsh_muthamman_png/page${pageStr}.png`;
    
    try {
        const res = await fetch('/api/restore-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filepath })
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.error || 'Restore image failed');
        
        showToast('✅ تم استعادة الصورة الخام الأصلية بنجاح!');
        
        // تحديث وعرض الصورة الخام
        const cacheBust = Date.now();
        DOM.img.src = `../pages/warsh_muthamman_png/page${pageStr}.png?v=${cacheBust}`;
        
        // إعادة تهيئة الكانفاس بالصورة الخام
        setTimeout(setupDrawingCanvasForCurrentImage, 100);
        
    } catch (err) {
        console.error(err);
        showToast(err.message || 'خطأ أثناء استعادة الصورة الأصلية! هل توجد نسخة احتياطية؟', true);
    }
}

// State tracking to reliably detect Alt key
window.altHeld = false;
let altIdleTimer = null;

function clearAltState() {
    window.altHeld = false;
    document.body.classList.remove('alt-held');
    if (isDrawingMode && typeof updateCanvasCursor === 'function') {
        updateCanvasCursor();
    }
    if (altIdleTimer) {
        clearTimeout(altIdleTimer);
        altIdleTimer = null;
    }
}

function scheduleAltIdleReset() {
    if (altIdleTimer) clearTimeout(altIdleTimer);
    altIdleTimer = setTimeout(() => {
        altIdleTimer = null;
        if (window.altHeld) {
            clearAltState();
        }
    }, 1500);
}

function checkAltState(e) {
    if (!window.altHeld) {
        // Keys might be held without us knowing (e.g., after blur -> refocus)
        if (e.altKey && (typeof e.buttons === 'undefined' || e.buttons === 0)) {
            window.altHeld = true;
            document.body.classList.add('alt-held');
            if (isDrawingMode && typeof updateCanvasCursor === 'function') {
                updateCanvasCursor();
            }
            scheduleAltIdleReset();
        }
        return;
    }
    if (!e.altKey) {
        clearAltState();
    } else {
        scheduleAltIdleReset();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Alt') {
        checkAltState(e);
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Alt') {
        clearAltState();
    }
});

window.addEventListener('blur', clearAltState);

// Passive listeners on pointer events to catch state changes safely
document.addEventListener('pointermove', checkAltState, { passive: true });
document.addEventListener('pointerup', checkAltState, { passive: true });
document.addEventListener('pointerdown', checkAltState, { passive: true });
document.addEventListener('wheel', checkAltState, { passive: true });

// استدعاء التهيئة والربط لحدث onload
DOM.img.addEventListener('load', () => {
    if (isDrawingMode) {
        setupDrawingCanvasForCurrentImage();
    }
});

// تفعيل النظام
initDrawingSystem();


// ==========================================
// نظام التكبير/التصغير (Zoom) والتحريك (Pan)
// Shift + Scroll => Zoom  |  Alt + Drag => Pan
// ==========================================
(function initZoomPan() {
    const imageContainer = document.getElementById('image-container');
    const imageWrapper   = document.getElementById('image-wrapper');
    const zoomSlider     = document.getElementById('zoom-slider');
    const zoomLabel      = document.getElementById('zoom-label');
    const zoomInBtn      = document.getElementById('zoom-in-btn');
    const zoomOutBtn     = document.getElementById('zoom-out-btn');

    if (!imageContainer || !imageWrapper || !zoomSlider) return;

    // حالة التحويل الحالية
    let scale   = 1.0; // 100%
    let panX    = 0;
    let panY    = 0;

    // حالة السحب للتحريك
    let isPanning   = false;
    let panStartX   = 0;
    let panStartY   = 0;
    let panStartOX  = 0;
    let panStartOY  = 0;

    // حالة Shift
    let shiftHeld = false;

    // حدود الزوم
    const MIN_SCALE = 0.25;
    const MAX_SCALE = 4.0;
    const ZOOM_STEP = 0.1;
    const ZOOM_PRESETS = [0.5, 0.75, 1.0, 1.5, 2.0];

    function applyTransform(animate = false) {
        if (animate) {
            imageWrapper.style.transition = 'transform 0.15s ease';
            setTimeout(() => { imageWrapper.style.transition = 'none'; }, 160);
        }
        imageWrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
        const pct = Math.round(scale * 100);
        if (zoomLabel)  zoomLabel.textContent = `${pct}%`;
        if (zoomSlider) zoomSlider.value = pct;
    }

    function clampPan() {
        // السماح بتحريك حتى 80% من أبعاد الغلاف بعد التكبير
        const wRect = imageWrapper.getBoundingClientRect();
        const cRect = imageContainer.getBoundingClientRect();
        const maxX = Math.max(0, (wRect.width  * scale - cRect.width)  / 2 + 100);
        const maxY = Math.max(0, (wRect.height * scale - cRect.height) / 2 + 100);
        panX = Math.max(-maxX, Math.min(maxX, panX));
        panY = Math.max(-maxY, Math.min(maxY, panY));
    }

    function setZoom(newScale, animate = false) {
        scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
        if (scale <= 1.01 && scale >= 0.99) {
            scale = 1.0; panX = 0; panY = 0;
        }
        clampPan();
        applyTransform(animate);
        
        // إظهار أشرطة التمرير عند التكبير لنسبة أكبر من 50% (أي scale > 0.5)
        if (scale > 0.5) {
            imageContainer.classList.add('has-scrollbars');
        } else {
            imageContainer.classList.remove('has-scrollbars');
        }

        // تحديث هالة مؤشر الفرشاة/الممحاة لتناسب التكبير الجديد
        if (typeof updateCanvasCursor === 'function') {
            updateCanvasCursor();
        }
    }

    function resetZoom() { setZoom(1.0, true); panX = 0; panY = 0; applyTransform(true); }

    // Ctrl + Scroll => Zoom
    imageContainer.addEventListener('wheel', (e) => {
        if (!e.ctrlKey) return;
        e.preventDefault();

        const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
        setZoom(scale + delta);
    }, { passive: false });

    // تعطيل تكبير صفحة المتصفح الافتراضية عند استخدام Ctrl + Scroll
    document.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });

    // Alt + Drag => Pan
    imageContainer.addEventListener('pointerdown', (e) => {
        if (!e.altKey || e.button !== 0) return;

        isPanning = true;
        panStartX = e.clientX;
        panStartY = e.clientY;
        panStartOX = panX;
        panStartOY = panY;
        imageWrapper.classList.add('is-panning');
        e.stopPropagation();
        e.preventDefault();
    }, { capture: true });

    document.addEventListener('pointermove', (e) => {
        if (!isPanning) return;
        panX = panStartOX + (e.clientX - panStartX);
        panY = panStartOY + (e.clientY - panStartY);
        clampPan();
        applyTransform();
    });

    document.addEventListener('pointerup', () => {
        if (isPanning) {
            isPanning = false;
            imageWrapper.classList.remove('is-panning');
        }
    });

    // Alt key => cursor feedback (pan mode)
    let altHeld = false;
    let altIdleTimer = null;

    function clearAltState() {
        if (!altHeld) return;
        altHeld = false;
        document.body.classList.remove('alt-held');
        if (isDrawingMode && typeof updateCanvasCursor === 'function') {
            updateCanvasCursor();
        }
        if (altIdleTimer) {
            clearTimeout(altIdleTimer);
            altIdleTimer = null;
        }
    }

    function scheduleAltIdleReset() {
        if (altIdleTimer) clearTimeout(altIdleTimer);
        altIdleTimer = setTimeout(() => {
            altIdleTimer = null;
            if (altHeld) {
                clearAltState();
            }
        }, 1500);
    }

    function checkAltState(e) {
        if (!altHeld) {
            if (e.altKey && (typeof e.buttons === 'undefined' || e.buttons === 0)) {
                altHeld = true;
                document.body.classList.add('alt-held');
                if (isDrawingMode && drawingCanvas) {
                    drawingCanvas.style.cursor = 'move';
                }
                scheduleAltIdleReset();
            }
            return;
        }
        if (!e.altKey) {
            clearAltState();
        } else {
            scheduleAltIdleReset();
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.altKey && !e.ctrlKey && !e.shiftKey) {
            if (!altHeld) {
                altHeld = true;
                document.body.classList.add('alt-held');
                
                if (isDrawingMode && drawingCanvas) {
                    drawingCanvas.style.cursor = 'move';
                }
            }
            scheduleAltIdleReset();
        }
    });

    document.addEventListener('keyup', checkAltState);
    document.addEventListener('pointermove', checkAltState, { passive: true });
    document.addEventListener('pointerup', checkAltState, { passive: true });
    document.addEventListener('pointerdown', checkAltState, { passive: true });
    document.addEventListener('wheel', checkAltState, { passive: true });
    window.addEventListener('keyup', checkAltState, true);

    window.addEventListener('blur', clearAltState);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) clearAltState();
    });

    // Zoom Bar controls
    if (zoomInBtn)  zoomInBtn.addEventListener('click',  () => setZoom(scale + ZOOM_STEP, true));
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => setZoom(scale - ZOOM_STEP, true));

    if (zoomLabel) {
        zoomLabel.addEventListener('click', resetZoom);
    }

    if (zoomSlider) {
        zoomSlider.addEventListener('input', (e) => {
            const newScale = parseInt(e.target.value) / 100;
            setZoom(newScale);
        });
    }

    // Preset buttons
    document.querySelectorAll('.zoom-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const z = parseInt(btn.dataset.zoom) / 100;
            if (z === 1.0) { panX = 0; panY = 0; }
            setZoom(z, true);
        });
    });

    // إعادة التهيئة عند تغيير الصفحة
    const origUpdatePage = window.updatePage;
    if (typeof updatePage === 'function') {
        const _origUpdatePage = updatePage;
        window.updatePage = function(page) {
            _origUpdatePage(page);
            resetZoom();
        };
    }

    // تطبيق مبدئي
    applyTransform();
})();

// ==========================================
// استعادة مواقع التمرير (Scroll) للقوائم الجانبية
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    ['left-panel', 'right-panel'].forEach(id => {
        const panel = document.getElementById(id);
        if (panel) {
            const savedScroll = localStorage.getItem(`warsh_muthamman_${id}_scroll`);
            if (savedScroll) {
                // نستخدم setTimeout لضمان تطبيق السكرول بعد تحميل المحتوى الداخلي إن وُجد
                setTimeout(() => { panel.scrollTop = parseInt(savedScroll, 10); }, 50);
            }
            panel.addEventListener('scroll', () => {
                localStorage.setItem(`warsh_muthamman_${id}_scroll`, panel.scrollTop);
            }, { passive: true });
        }
    });

    // ==========================================
    // قسم القيم الجغرافية قابل للطي
    // ==========================================
    const geoHeader = document.getElementById('geo-values-header');
    const geoContent = document.getElementById('geo-values-content');
    const geoIcon = document.getElementById('geo-values-icon');

    if (geoHeader && geoContent && geoIcon) {
        const isCollapsed = localStorage.getItem('warsh_muthamman_geo_collapsed') === 'true';
        if (isCollapsed) {
            geoContent.style.display = 'none';
            geoIcon.style.transform = 'rotate(-90deg)';
        }

        geoHeader.addEventListener('click', () => {
            const currentlyCollapsed = geoContent.style.display === 'none';
            if (currentlyCollapsed) {
                geoContent.style.display = 'block';
                geoIcon.style.transform = 'rotate(0deg)';
                localStorage.setItem('warsh_muthamman_geo_collapsed', 'false');
            } else {
                geoContent.style.display = 'none';
                geoIcon.style.transform = 'rotate(-90deg)';
                localStorage.setItem('warsh_muthamman_geo_collapsed', 'true');
            }
        });
    }

    // ==========================================================================
    // Integration of Quality Radar & Validation Panel
    // ==========================================================================
    const valBtn = document.getElementById('validation-status-btn');
    const valPanel = document.getElementById('validation-panel');
    const closeValPanelBtn = document.getElementById('close-validation-panel-btn');

    if (valBtn && valPanel) {
        valBtn.addEventListener('click', () => {
            valPanel.classList.toggle('open');
            if (valPanel.classList.contains('open')) {
                validateCurrentPage();
            }
        });
    }

    if (closeValPanelBtn && valPanel) {
        closeValPanelBtn.addEventListener('click', () => {
            valPanel.classList.remove('open');
        });
    }

    // Tab filtering listeners
    document.querySelectorAll('.validation-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.validation-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentValidationActiveTab = tab.dataset.tab;
            updateValidationListUI();
        });
    });

    // Attach input event listeners for manual input debounce
    [
        'hl-left', 'hl-right', 'hl-line-top', 'hl-line-bottom',
        'mk-cx', 'mk-cy', 'mk-line',
        'meta-sura', 'meta-ayah', 'meta-line'
    ].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', debouncedValidate);
        }
    });

    // Hook validation to page load: intercept loadOverlayData
    if (typeof loadOverlayData === 'function') {
        const _origLoadOverlayData = loadOverlayData;
        loadOverlayData = async function(page) {
            await _origLoadOverlayData(page);
            validateCurrentPage();
        };
    }

    // Hook validation to saveToServer
    if (typeof saveToServer === 'function') {
        const _origSaveToServer = saveToServer;
        saveToServer = async function(filepath, content, onSuccessCallback) {
            return _origSaveToServer(filepath, content, () => {
                validateCurrentPage();
                if (onSuccessCallback) onSuccessCallback();
            });
        };
    }

    // Call updatePage to load the initial page once all listeners and hooks are registered
    updatePage(currentPage);
});

let currentValidationRequestController = null;
let currentValidationIssues = [];
let currentValidationDiagnostics = [];
let currentValidationActiveTab = 'all';
let validationDebounceTimer = null;

async function validateCurrentPage() {
    if (!currentAyahData || !currentLayoutData) return;

    const requestPage = currentPage;
    if (currentValidationRequestController) {
        currentValidationRequestController.abort();
    }
    currentValidationRequestController = new AbortController();
    const signal = currentValidationRequestController.signal;

    try {
        const response = await fetch('/api/validate-page', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pageData: currentAyahData,
                layoutData: currentLayoutData,
                pageNumber: currentPage,
                numberingMode: 'hafs_tolerant'
            }),
            signal
        });

        if (!response.ok) throw new Error('Validation API failed');
        const result = await response.json();

        if (signal.aborted || currentPage !== requestPage) return;

        currentValidationIssues = result.issues || [];
        currentValidationDiagnostics = result.diagnostics || [];

        // Redraw boxes to apply overlay classes (validation-fatal, validation-warning, etc.)
        // This is safe because renderBoxes preserves selectedItem state
        renderBoxes();
        
        // Update UI panels
        updateValidationStatusUI();
        updateValidationListUI();

    } catch (err) {
        if (err.name === 'AbortError') return;
        console.error("Validation error:", err);
    }
}

function debouncedValidate() {
    if (validationDebounceTimer) clearTimeout(validationDebounceTimer);
    validationDebounceTimer = setTimeout(() => {
        validateCurrentPage();
    }, 300);
}

function updateValidationStatusUI() {
    const btn = document.getElementById('validation-status-btn');
    if (!btn) return;

    const fatalCount = currentValidationIssues.filter(x => x.severity === 'fatal').length;
    const warningCount = currentValidationIssues.filter(x => x.severity === 'warning').length;
    const suspiciousCount = currentValidationIssues.filter(x => x.severity === 'suspicious').length;
    const diagnosticCount = currentValidationDiagnostics.length;

    btn.className = 'icon-btn'; // reset class
    
    let titleMsg = '';
    if (fatalCount > 0) {
        btn.classList.add('status-red');
        titleMsg = `رادار الجودة: يوجد ${fatalCount} أخطاء حرجة!`;
    } else if (warningCount > 0) {
        btn.classList.add('status-yellow');
        titleMsg = `رادار الجودة: يوجد ${warningCount} تحذيرات.`;
    } else if (suspiciousCount > 0) {
        btn.classList.add('status-blue');
        titleMsg = `رادار الجودة: يوجد ${suspiciousCount} حالات مريبة.`;
    } else {
        btn.classList.add('status-green');
        titleMsg = `رادار الجودة: لا توجد مشاكل.`;
    }

    if (diagnosticCount > 0) {
        titleMsg += ` (${diagnosticCount} تشخيصات متوفرة)`;
    }
    btn.title = titleMsg;
}

function translateValidationItem(item) {
    let codeAr = item.code;
    let msgAr = item.message;

    const codeTranslations = {
        'MARKER_BOUNDARY_MISMATCH': 'عدم تطابق حدود العلامة',
        'LAYOUT_VERTICAL_OVERLAP': 'تداخل رأسي في الأسطر',
        'HEADER_PAGE_MISMATCH': 'خطأ في رقم صفحة الترويسة',
        'HEADER_SURA_OUT_OF_RANGE': 'رقم سورة الترويسة خارج النطاق',
        'HEADER_COORDS_OUT_OF_RANGE': 'إحداثيات الترويسة خارج النطاق',
        'HIGHLIGHT_PAGE_MISMATCH': 'صفحة التظليل غير مطابقة',
        'HIGHLIGHT_LINE_OUT_OF_RANGE': 'سطر التظليل خارج حدود الصفحة',
        'HIGHLIGHT_SURA_OUT_OF_RANGE': 'سورة التظليل خارج النطاق',
        'HIGHLIGHT_AYAH_OUT_OF_RANGE': 'آية التظليل خارج النطاق',
        'HIGHLIGHT_COORDS_OUT_OF_RANGE': 'إحداثيات التظليل خارج النطاق',
        'HIGHLIGHT_MARGIN_DEVIATION': 'انحراف التظليل عن الهامش',
        'MARKER_PAGE_MISMATCH': 'صفحة العلامة غير مطابقة',
        'MARKER_LINE_OUT_OF_RANGE': 'سطر العلامة خارج حدود الصفحة',
        'MARKER_SURA_OUT_OF_RANGE': 'سورة العلامة خارج النطاق',
        'MARKER_AYAH_OUT_OF_RANGE': 'آية العلامة خارج النطاق',
        'MARKER_COORDS_OUT_OF_RANGE': 'إحداثيات العلامة خارج النطاق',
        'MARKER_Y_OUT_OF_MARGINS': 'العلامة خارج الهوامش الرأسية',
        'DUPLICATE_HIGHLIGHT': 'تظليل مكرر',
        'DUPLICATE_MARKER': 'علامة مكررة',
        'HIGHLIGHT_ORDER_OSCILLATION': 'تذبذب في ترتيب الآيات',
        'HIGHLIGHT_ORDER_REGRESSION': 'تراجع في ترتيب الآيات',
        'HIGHLIGHT_ORDER_JUMP': 'قفز في ترتيب الآيات',
        'SAME_LINE_GAP': 'فجوة أفقية في نفس السطر',
        'SAME_LINE_OVERLAP': 'تداخل أفقي في نفس السطر',
        'MARKER_Y_CLOSE_TO_EDGE': 'العلامة قريبة جداً من حافة السطر',
        'MARKER_NO_HIGHLIGHT': 'علامة بلا تظليل',
        'MARKER_NOT_ON_HIGHLIGHT_LINE': 'العلامة والتظليل في أسطر مختلفة',
        'DUPLICATE_MARKER_AYAH': 'علامات متعددة لنفس الآية',
        'MARKER_ORDER_REGRESSION': 'تراجع في ترتيب العلامات',
        'ORPHAN_HIGHLIGHT_NO_MARKER': 'تظليل بلا علامة نهاية الآية'
    };

    if (codeTranslations[item.code]) {
        codeAr = codeTranslations[item.code];
    }

    if (item.code === 'MARKER_BOUNDARY_MISMATCH') {
        const markerMatch = item.message.match(/Marker center \(([^)]+)\) differs from highlight left \(([^)]+)\) by ([0-9.-]+)\./);
        const nextAyahMatch = item.message.match(/Marker center \(([^)]+)\) differs from next ayah right \(([^)]+)\) by ([0-9.-]+)\./);
        
        if (markerMatch) {
            const [, markerVal, hlVal, diffVal] = markerMatch;
            msgAr = `مركز الدائرة (${markerVal}) يختلف عن بداية التظليل (${hlVal}) بمقدار ${diffVal}. (هذا للتشخيص البصري فقط في الصفحة ${currentPage})`;
        } else if (nextAyahMatch) {
            const [, markerVal, hlVal, diffVal] = nextAyahMatch;
            msgAr = `مركز الدائرة (${markerVal}) يختلف عن نهاية تظليل الآية التالية (${hlVal}) بمقدار ${diffVal}. (هذا للتشخيص البصري فقط في الصفحة ${currentPage})`;
        } else {
            msgAr = item.message.replace(/differs from highlight left/g, 'يختلف عن بداية التظليل')
                                .replace(/differs from next ayah right/g, 'يختلف عن نهاية الآية التالية')
                                .replace(/This is diagnostic only; do not auto-fix JSON from it\./g, `(هذا للتشخيص البصري فقط في الصفحة ${currentPage})`);
        }
    } else {
        msgAr = item.message
            .replace(/Marker exists for (.+?) but no highlight found on page/g, 'توجد علامة للآية $1 ولكن لا يوجد لها تظليل في الصفحة')
            .replace(/Marker exists on line (.+?) for (.+?) but highlight is on different line/g, 'العلامة موجودة في السطر $1 للآية $2 ولكن التظليل في سطر آخر')
            .replace(/Minor vertical overlap with previous line band by (.+?)px/g, 'تداخل رأسي طفيف مع السطر السابق بمقدار $1 بكسل')
            .replace(/Highlight left boundary \((.+?)\) deviates from typical margin 0.03/g, 'حافة التظليل اليمنى ($1) منحرفة عن الهامش النموذجي 0.03')
            .replace(/Highlight right boundary \((.+?)\) deviates from typical margin 0.97/g, 'حافة التظليل اليسرى ($1) منحرفة عن الهامش النموذجي 0.97')
            .replace(/Horizontal gap on same line by (.+?)/g, 'فجوة أفقية في نفس السطر بمقدار $1')
            .replace(/Horizontal overlap on same line by (.+?)/g, 'تداخل أفقي في نفس السطر بمقدار $1')
            .replace(/Highlight page \((.+?)\) does not match actual page \((.+?)\)/g, 'صفحة التظليل ($1) لا تطابق الصفحة الحالية ($2)')
            .replace(/Marker page \((.+?)\) does not match actual page \((.+?)\)/g, 'صفحة العلامة ($1) لا تطابق الصفحة الحالية ($2)');
            
        if (!msgAr.includes(String(currentPage))) {
            msgAr += ` (صفحة ${currentPage})`;
        }
    }

    return { code: codeAr, message: msgAr };
}

function updateValidationListUI() {
    const listEl = document.getElementById('validation-issues-list');
    if (!listEl) return;

    listEl.innerHTML = '';

    const fatalCount = currentValidationIssues.filter(x => x.severity === 'fatal').length;
    const warningCount = currentValidationIssues.filter(x => x.severity === 'warning').length;
    const suspiciousCount = currentValidationIssues.filter(x => x.severity === 'suspicious').length;
    const diagnosticCount = currentValidationDiagnostics.length;

    // Update tab counters
    document.getElementById('val-count-all').textContent = fatalCount + warningCount + suspiciousCount;
    document.getElementById('val-count-fatal').textContent = fatalCount;
    document.getElementById('val-count-warning').textContent = warningCount;
    document.getElementById('val-count-suspicious').textContent = suspiciousCount;
    document.getElementById('val-count-diagnostic').textContent = diagnosticCount;

    // Filter issues based on active tab
    let itemsToDisplay = [];
    if (currentValidationActiveTab === 'all') {
        itemsToDisplay = currentValidationIssues;
    } else if (currentValidationActiveTab === 'diagnostic') {
        itemsToDisplay = currentValidationDiagnostics.map(x => ({ ...x, severity: 'diagnostic' }));
    } else {
        itemsToDisplay = currentValidationIssues.filter(x => x.severity === currentValidationActiveTab);
    }

    if (itemsToDisplay.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'validation-empty';
        empty.textContent = currentValidationActiveTab === 'diagnostic' 
            ? 'لا توجد تشخيصات حدود للعلامات في هذه الصفحة.'
            : 'لا توجد مشاكل في هذا التبويب.';
        listEl.appendChild(empty);
        return;
    }

    itemsToDisplay.forEach(item => {
        const card = document.createElement('div');
        card.className = `validation-card ${item.severity}`;
        
        let targetText = '-';
        if (item.target) {
            if (item.target.kind === 'highlight') {
                targetText = `تظليل [س:${item.target.sura} آ:${item.target.ayah}]`;
            } else if (item.target.kind === 'marker') {
                targetText = `علامة [س:${item.target.sura} آ:${item.target.ayah}]`;
            } else if (item.target.kind === 'line') {
                targetText = `سطر ${item.target.line}`;
            } else {
                targetText = `صفحة`;
            }
        }

        const header = document.createElement('div');
        header.className = 'validation-card-header';
        
        const translated = translateValidationItem(item);

        const code = document.createElement('span');
        code.className = 'validation-card-code';
        code.textContent = translated.code;

        const target = document.createElement('span');
        target.className = 'validation-card-target';
        target.textContent = targetText;

        header.appendChild(code);
        header.appendChild(target);

        const msg = document.createElement('div');
        msg.className = 'validation-card-msg';
        msg.textContent = translated.message;

        card.appendChild(header);
        card.appendChild(msg);

        if (item.severity === 'diagnostic') {
            const note = document.createElement('div');
            note.className = 'validation-card-diagnostic-note';
            note.textContent = 'للمراجعة البصرية فقط، ليس مدخلاً للإصلاح الآلي';
            card.appendChild(note);
        }

        const action = document.createElement('span');
        action.className = 'validation-card-action';
        action.textContent = 'وميض مؤقت للعنصر 🎯';
        card.appendChild(action);

        card.addEventListener('click', (e) => {
            e.stopPropagation();
            flashValidationTarget(item);
        });

        listEl.appendChild(card);
    });
}

function flashValidationTarget(item) {
    if (!item || !item.target) return;
    const target = item.target;

    let el = null;
    let color = '#2196F3';
    if (item.severity === 'fatal') color = '#f44336';
    else if (item.severity === 'warning') color = '#FF9800';

    if (target.kind === 'highlight' && target.highlightIndex !== undefined) {
        el = DOM.overlay.querySelector(`[data-highlight-index="${target.highlightIndex}"]`);
    } else if (target.kind === 'marker' && target.markerIndex !== undefined) {
        el = DOM.overlay.querySelector(`[data-marker-index="${target.markerIndex}"]`);
    } else if (target.kind === 'line') {
        // Flash both prev/next highlights if they exist
        if (target.prevHighlightIndex !== undefined) {
            const el1 = DOM.overlay.querySelector(`[data-highlight-index="${target.prevHighlightIndex}"]`);
            if (el1) {
                el1.classList.add('selected-error');
                el1.style.color = color;
                setTimeout(() => { el1.classList.remove('selected-error'); el1.style.color = ''; }, 3000);
            }
        }
        if (target.nextHighlightIndex !== undefined) {
            const el2 = DOM.overlay.querySelector(`[data-highlight-index="${target.nextHighlightIndex}"]`);
            if (el2) {
                el2.classList.add('selected-error');
                el2.style.color = color;
                setTimeout(() => { el2.classList.remove('selected-error'); el2.style.color = ''; }, 3000);
            }
        }
        return;
    }

    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('selected-error');
        el.style.color = color;
        setTimeout(() => {
            el.classList.remove('selected-error');
            el.style.color = '';
        }, 3000);
    }
}
