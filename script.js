document.addEventListener('DOMContentLoaded', () => {

// ========== Parallax ==========

const wrapper = document.getElementById('imageWrapper');
const frame = document.querySelector('.image-frame');
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

frame.addEventListener('mousemove', (e) => {
    const rect = frame.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const maxShift = 12;
    targetX = (x - 0.5) * maxShift;
    targetY = (y - 0.5) * maxShift;
});

frame.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
});

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function animate() {
    currentX = lerp(currentX, targetX, 0.08);
    currentY = lerp(currentY, targetY, 0.08);
    wrapper.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(animate);
}

animate();

// ========== Wardrobe Parallax ==========

const modalLeft = document.getElementById('modalLeft');
const wardrobeBg = document.getElementById('wardrobeBg');
let wTargetX = 0, wTargetY = 0, wCurrentX = 0, wCurrentY = 0;

if (modalLeft && wardrobeBg) {
    modalLeft.addEventListener('mousemove', (e) => {
        const rect = modalLeft.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        wTargetX = (x - 0.5) * 16;
        wTargetY = (y - 0.5) * 16;
    });

    modalLeft.addEventListener('mouseleave', () => {
        wTargetX = 0;
        wTargetY = 0;
    });

    function wardrobeAnimate() {
        wCurrentX = lerp(wCurrentX, wTargetX, 0.06);
        wCurrentY = lerp(wCurrentY, wTargetY, 0.06);
        wardrobeBg.style.transform = `translate(${wCurrentX}px, ${wCurrentY}px)`;
        requestAnimationFrame(wardrobeAnimate);
    }

    wardrobeAnimate();
}

// ========== Character Creator ==========

const SKIN = '#f0c8a0';
const HAIR_COLORS = ['#1a1a1a', '#5c3a1e', '#e8c547', '#b22222', '#4a90d9'];
const CLOTHING_COLORS = ['#4a90d9', '#6b8e23', '#8b5e3c', '#e8e8e0', '#dc143c'];

const state = {
    faceShape: 0,
    hairStyle: 0,
    hairColor: 0,
    ears: 0,
    eyes: 0,
    nose: 0,
    mouth: 0,
    clothing: 0,
    name: '',
    surname: '',
    age: ''
};

const CE = ' shape-rendering="crispEdges"';

function svgFace(style) {
    if (style === 0) return `<path d="M62,56 L138,56 L144,62 L144,148 L138,154 L62,154 L56,148 L56,62 Z" fill="${SKIN}"${CE}/>`;
    if (style === 1) return `<path d="M66,48 L134,48 L140,54 L140,156 L134,162 L66,162 L60,156 L60,54 Z" fill="${SKIN}"${CE}/>`;
    return `<rect x="52" y="56" width="96" height="100" fill="${SKIN}"${CE}/>`;
}

function svgEars(style) {
    if (style === 0) return `<rect x="40" y="96" width="12" height="12" fill="${SKIN}"${CE}/><rect x="148" y="96" width="12" height="12" fill="${SKIN}"${CE}/>`;
    if (style === 1) return `<rect x="42" y="92" width="8" height="20" fill="${SKIN}"${CE}/><rect x="150" y="92" width="8" height="20" fill="${SKIN}"${CE}/>`;
    return `<path d="M40,96 L34,102 L40,108 Z" fill="${SKIN}"${CE}/><path d="M160,96 L166,102 L160,108 Z" fill="${SKIN}"${CE}/>`;
}

function svgEyes(style) {
    if (style === 0) return `<rect x="74" y="90" width="8" height="8" fill="#fff"${CE}/><rect x="118" y="90" width="8" height="8" fill="#fff"${CE}/><rect x="76" y="92" width="4" height="4" fill="#333"${CE}/><rect x="120" y="92" width="4" height="4" fill="#333"${CE}/>`;
    if (style === 1) return `<rect x="70" y="92" width="12" height="6" fill="#fff"${CE}/><rect x="118" y="92" width="12" height="6" fill="#fff"${CE}/><rect x="74" y="93" width="6" height="4" fill="#333"${CE}/><rect x="120" y="93" width="6" height="4" fill="#333"${CE}/>`;
    return `<path d="M72,92 h4 l4,-4 l4,4 h4" fill="none" stroke="#333" stroke-width="2" stroke-linejoin="miter"${CE}/><path d="M112,92 h4 l4,-4 l4,4 h4" fill="none" stroke="#333" stroke-width="2" stroke-linejoin="miter"${CE}/>`;
}

function svgNose(style) {
    if (style === 0) return `<rect x="97" y="107" width="6" height="4" fill="#d4a882"${CE}/>`;
    if (style === 1) return `<rect x="96" y="107" width="8" height="6" fill="#d4a882"${CE}/>`;
    return `<path d="M97,106 L103,106 L100,114 Z" fill="#d4a882"${CE}/>`;
}

function svgMouth(style) {
    if (style === 0) return `<path d="M86,128 h6 l4,4 l4,-4 h6" fill="none" stroke="#c47a7a" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"${CE}/>`;
    if (style === 1) return `<line x1="88" y1="131" x2="112" y2="131" stroke="#c47a7a" stroke-width="3" stroke-linecap="square"${CE}/>`;
    return `<rect x="90" y="126" width="20" height="8" fill="#c47a7a"${CE}/>`;
}

function svgHair(style, color) {
    if (style === 0) return `<path d="M44,72 L42,64 L46,56 L52,50 L60,44 L72,40 L86,36 L100,34 L114,36 L128,40 L140,44 L148,50 L154,56 L158,64 L156,72 L148,66 L136,62 L122,58 L100,56 L78,58 L64,62 L52,66 Z" fill="${color}"${CE}/>`;
    if (style === 1) return `<path d="M44,72 L42,64 L46,56 L52,50 L60,44 L72,40 L86,36 L100,34 L114,36 L128,40 L140,44 L148,50 L154,56 L158,64 L156,80 L152,100 L148,118 L144,126 L138,126 L142,108 L144,90 L140,72 L130,64 L118,58 L100,56 L82,58 L70,64 L60,72 L56,90 L58,108 L62,126 L56,126 L52,118 L48,100 L44,80 Z" fill="${color}"${CE}/>`;
    return `<path d="M56,68 L52,44 L64,58 L68,34 L80,52 L86,26 L94,46 L100,20 L106,46 L114,26 L120,52 L132,34 L136,58 L148,44 L144,68 L156,72 L44,72 Z" fill="${color}"${CE}/>`;
}

function svgClothing(style) {
    const c = CLOTHING_COLORS[style];
    if (style === 0) return `<path d="M56,166 L144,166 L150,260 L50,260 Z" fill="${c}"${CE}/><path d="M56,166 L38,200 L50,210 L66,178 Z" fill="${c}"${CE}/><path d="M144,166 L162,200 L150,210 L134,178 Z" fill="${c}"${CE}/><path d="M80,166 L120,166 L120,174 L80,174 Z" fill="${SKIN}"${CE}/>`;
    if (style === 1) return `<path d="M52,166 L148,166 L152,260 L48,260 Z" fill="${c}"${CE}/><path d="M76,154 L124,154 L124,166 L76,166 Z" fill="${c}"${CE}/><path d="M80,172 L120,172 L120,182 L80,182 Z" fill="${SKIN}"${CE}/><line x1="90" y1="190" x2="90" y2="210" stroke="#444" stroke-width="2"${CE}/><line x1="110" y1="190" x2="110" y2="210" stroke="#444" stroke-width="2"${CE}/>`;
    if (style === 2) return `<path d="M54,166 L146,166 L152,260 L48,260 Z" fill="${c}"${CE}/><path d="M54,166 L34,200 L48,212 L66,178 Z" fill="${c}"${CE}/><path d="M146,166 L166,200 L152,212 L134,178 Z" fill="${c}"${CE}/><path d="M76,166 L100,194 L124,166 Z" fill="${SKIN}"${CE}/><line x1="100" y1="194" x2="100" y2="260" stroke="#222" stroke-width="2"${CE}/>`;
    if (style === 3) return `<path d="M56,166 L144,166 L150,260 L50,260 Z" fill="${c}"${CE}/><path d="M56,166 L38,200 L50,212 L66,178 Z" fill="${c}"${CE}/><path d="M144,166 L162,200 L150,212 L134,178 Z" fill="${c}"${CE}/><path d="M72,158 L86,166 L100,158 L114,166 L128,158 L126,166 L74,166 Z" fill="${c}"${CE}/><path d="M80,166 L100,194 L120,166 Z" fill="${SKIN}"${CE}/><rect x="86" y="188" width="4" height="4" fill="#444"${CE}/><rect x="94" y="202" width="4" height="4" fill="#444"${CE}/><rect x="100" y="216" width="4" height="4" fill="#444"${CE}/><rect x="106" y="202" width="4" height="4" fill="#444"${CE}/><rect x="112" y="188" width="4" height="4" fill="#444"${CE}/>`;
    return `<path d="M56,180 L144,180 L150,260 L50,260 Z" fill="${c}"${CE}/><path d="M56,180 L44,210 L54,216 L66,188 Z" fill="${c}"${CE}/><path d="M144,180 L156,210 L146,216 L134,188 Z" fill="${c}"${CE}/><path d="M72,166 L100,210 L128,166 Z" fill="${SKIN}"${CE}/>`;
}

function renderAvatar() {
    const hc = HAIR_COLORS[state.hairColor];
    const parts = [
        svgEars(state.ears),
        svgFace(state.faceShape),
        svgClothing(state.clothing),
        svgEyes(state.eyes),
        svgNose(state.nose),
        svgMouth(state.mouth),
        svgHair(state.hairStyle, hc)
    ];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" shape-rendering="crispEdges">${parts.join('')}</svg>`;
}

function updatePreview() {
    const container = document.getElementById('avatarPreview');
    if (container) container.innerHTML = renderAvatar();
}

// ========== Modal Logic ==========

const modal = document.getElementById('customizationModal');
const newGameBtn = document.getElementById('newGameBtn');

if (newGameBtn && modal) {
    newGameBtn.addEventListener('click', () => {
        modal.classList.add('open');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });
}

// Option buttons
document.querySelectorAll('.option-row').forEach((row) => {
    const part = row.dataset.part;
    row.querySelectorAll('.opt-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            row.querySelectorAll('.opt-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            state[part] = parseInt(btn.dataset.value);
            updatePreview();
        });
    });
});

// Color buttons
document.querySelectorAll('.color-row').forEach((row) => {
    const part = row.dataset.part;
    row.querySelectorAll('.color-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            row.querySelectorAll('.color-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            state[part] = parseInt(btn.dataset.value);
            updatePreview();
        });
    });
});

// Text inputs
const nameInput = document.getElementById('nameInput');
const surnameInput = document.getElementById('surnameInput');
const ageInput = document.getElementById('ageInput');

if (nameInput) nameInput.addEventListener('input', (e) => { state.name = e.target.value; });
if (surnameInput) surnameInput.addEventListener('input', (e) => { state.surname = e.target.value; });
if (ageInput) ageInput.addEventListener('input', (e) => { state.age = e.target.value; });

// Start button
const startBtn = document.getElementById('startGameBtn');
if (startBtn) {
    startBtn.addEventListener('click', () => {
        const name = state.name.trim();
        const surname = state.surname.trim();
        const age = state.age.trim();
        if (!name || !surname || !age) {
            showGameAlert('Пожалуйста, заполните имя, фамилию и возраст!');
            return;
        }
        modal.classList.remove('open');
        startGame();
    });
}

updatePreview();

// ========== Game Screen ==========

const MAP_W = 16;
const MAP_H = 12;
const TILE = {
    EMPTY: 0, ROAD: 1, BUILDING: 2,
    MARKET: 3, PARK: 4, WATER: 5
};

function generateMap() {
    const map = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(TILE.EMPTY));

    const hRoads = [2, 6, 9];
    const vRoads = [3, 7, 12];

    for (const y of hRoads) {
        for (let x = 0; x < MAP_W; x++) map[y][x] = TILE.ROAD;
    }
    for (const x of vRoads) {
        for (let y = 0; y < MAP_H; y++) map[y][x] = TILE.ROAD;
    }

    for (let y = 3; y <= 5; y++) {
        for (let x = 4; x <= 6; x++) {
            if (map[y][x] !== TILE.ROAD) map[y][x] = TILE.MARKET;
        }
    }

    for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
            if (map[y][x] !== TILE.EMPTY) continue;
            const r = Math.random();
            if (r < 0.55) map[y][x] = TILE.BUILDING;
            else if (r < 0.75) map[y][x] = TILE.PARK;
            else if (r < 0.9) map[y][x] = TILE.WATER;
        }
    }

    return map;
}

const TILE_CLASS = {
    [TILE.EMPTY]: 'tile-empty',
    [TILE.ROAD]: 'tile-road',
    [TILE.BUILDING]: 'tile-building',
    [TILE.MARKET]: 'tile-market',
    [TILE.PARK]: 'tile-park',
    [TILE.WATER]: 'tile-water'
};

const TILE_LABEL = {
    [TILE.EMPTY]: '',
    [TILE.ROAD]: '',
    [TILE.BUILDING]: '<svg viewBox="0 0 20 20" width="20" height="20"><rect x="2" y="5" width="16" height="13" fill="#6a5a4a" stroke="#5a4a3a" stroke-width=".5"/><polygon points="10,1 0,7 20,7" fill="#8a7a6a" stroke="#6a5a4a" stroke-width=".5"/><rect x="8" y="12" width="4" height="6" fill="#4a3a2a" rx=".5"/><rect x="4" y="7" width="3.5" height="3" fill="#a8c8d8" opacity=".7" rx=".3"/><rect x="12.5" y="7" width="3.5" height="3" fill="#a8c8d8" opacity=".7" rx=".3"/></svg>',
    [TILE.MARKET]: '',
    [TILE.PARK]: '<svg viewBox="0 0 20 20" width="20" height="20"><rect x="8" y="11" width="4" height="8" fill="#5a4a3a" rx="1"/><ellipse cx="10" cy="7" rx="8" ry="5" fill="#4a8a4a"/><ellipse cx="10" cy="5" rx="5.5" ry="4" fill="#5a9a5a"/><ellipse cx="10" cy="3" rx="3.5" ry="3" fill="#6aaa6a"/><ellipse cx="10" cy="7" rx="8" ry="5" fill="none" stroke="#3a6a3a" stroke-width=".5"/></svg>',
    [TILE.WATER]: '<svg viewBox="0 0 20 20" width="20" height="20"><path d="M1 9 Q5 7 10 9 Q15 11 19 9" fill="none" stroke="#5a9aba" stroke-width="1.5" stroke-linecap="round" opacity=".7"/><path d="M1 12 Q5 10 10 12 Q15 14 19 12" fill="none" stroke="#4a8aaa" stroke-width="1.5" stroke-linecap="round" opacity=".5"/></svg>'
};

let gameMap = null;
let shops = [];
let currentShopId = null;
const marketCoords = [];
const SHOP_COST = 6000;

function renderMap() {
    const container = document.getElementById('cityMap');
    if (!container) return;
    container.querySelectorAll('.tile').forEach(t => t.remove());
    container.style.gridTemplateColumns = `repeat(${MAP_W}, 40px)`;
    marketCoords.length = 0;

    for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
            const type = gameMap[y][x];
            const tile = document.createElement('div');
            tile.className = `tile ${TILE_CLASS[type]}`;
            tile.dataset.x = x;
            tile.dataset.y = y;

            const label = TILE_LABEL[type];
            if (label) {
                tile.innerHTML = label;
            }

            if (type === TILE.MARKET) {
                marketCoords.push({ x, y });
                tile.addEventListener('mouseenter', onMarketHover);
                tile.addEventListener('mouseleave', onMarketLeave);
                tile.addEventListener('mousemove', onMarketMove);
                tile.addEventListener('click', onMarketClick);
            }

            container.appendChild(tile);
        }
    }

    // Re-apply shop visuals after map render
    shops.forEach(s => {
        const idx = s.y * MAP_W + s.x;
        const tile = container.querySelectorAll('.tile')[idx];
        if (tile) {
            tile.classList.add('shop-placed');
            tile.innerHTML = shopSvg(s.name);
        }
    });
}

function shopSvg(name) {
    return `<div class="shop-icon" title="${name}"><svg viewBox="0 0 26 26" width="26" height="26"><rect x="4" y="10" width="18" height="13" fill="#c8a050" stroke="#9a7a40" stroke-width=".8" rx="1"/><rect x="4" y="5" width="18" height="7" fill="#a08030" stroke="#8a6a30" stroke-width=".8" rx="1"/><polygon points="4,5 13,1 22,5" fill="#b8964a" stroke="#8a6a30" stroke-width=".8"/><rect x="10" y="16" width="6" height="7" fill="#5a4a2a" rx=".5"/><rect x="5" y="11" width="3" height="3" fill="#d8b870" rx=".3"/><rect x="18" y="11" width="3" height="3" fill="#d8b870" rx=".3"/><line x1="13" y1="5" x2="13" y2="1" stroke="#8a6a30" stroke-width="1.5"/></svg></div>`;
}

const tooltip = document.getElementById('marketTooltip');

function findShopAt(x, y) {
    return shops.find(s => s.x === x && s.y === y) || null;
}

function onMarketHover(e) {
    const tile = e.currentTarget;
    const x = parseInt(tile.dataset.x);
    const y = parseInt(tile.dataset.y);
    if (findShopAt(x, y)) return;
    if (playerMoney < SHOP_COST) return;
    tooltip.classList.add('visible');
}

function onMarketLeave() {
    tooltip.classList.remove('visible');
}

function onMarketMove(e) {
    if (!tooltip.classList.contains('visible')) return;
    const rect = document.querySelector('.game-map-container').getBoundingClientRect();
    let x = e.clientX - rect.left + 14;
    let y = e.clientY - rect.top - 10;
    if (x + tooltip.offsetWidth > rect.width - 10) {
        x = e.clientX - rect.left - tooltip.offsetWidth - 14;
    }
    if (y < 10) y = 10;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

function updateMoneyDisplay() {
    const el = document.getElementById('moneyCount');
    if (el) el.textContent = playerMoney.toLocaleString('ru');
}

async function onMarketClick(e) {
    const tile = e.currentTarget;
    const x = parseInt(tile.dataset.x);
    const y = parseInt(tile.dataset.y);

    const existing = findShopAt(x, y);
    if (existing) {
        currentShopId = existing.id;
        updateShopModal();
        shopModal.classList.add('open');
        showShopPricesPanel();
        return;
    }

    if (playerMoney < SHOP_COST) {
        await showGameAlert('Недостаточно средств! Установка лавки стоит ' + SHOP_COST.toLocaleString('ru') + '₽');
        return;
    }

    // Prompt for shop name using a styled modal
    const name = await new Promise(resolve => {
        showGameDialog('Название лавки', `
            <input class="dialog-input" id="gameShopNameInput" type="text" value="Лавка №${shops.length + 1}" autofocus>
        `, [
            { label: 'Построить', val: 'ok', cls: 'confirm' },
            { label: 'Отмена', val: 'cancel', cls: 'cancel' }
        ]).then(() => {
            const inp = document.getElementById('gameShopNameInput');
            resolve(inp ? inp.value.trim() : '');
        });
    });
    if (!name) return;

    playerMoney -= SHOP_COST;
    updateMoneyDisplay();

    const shop = {
        id: Date.now(),
        name: name.trim(),
        x, y,
        storage: { level: 1, capacity: 20, used: 0, items: {} },
        shelf: { level: 1, capacity: 10, used: 0, items: {} },
        sellingPrices: {}
    };
    shops.push(shop);
    currentShopId = shop.id;
    updateSidebarBtns();
    tile.classList.add('shop-placed');
    tile.innerHTML = shopSvg(shop.name);

    const hint = document.getElementById('gameHint');
    if (hint) {
        hint.innerHTML = '<svg viewBox="0 0 18 18" width="14" height="14"><path d="M3 9l4 4 8-8" fill="none" stroke="#6db86d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> «' + shop.name + '» построена! Остаток: ' + playerMoney.toLocaleString('ru') + '₽';
        hint.classList.add('success');
    }
}

function startGame() {
    const container = document.querySelector('.container');
    if (container) container.style.display = 'none';

    const avatar = document.getElementById('gameAvatar');
    if (avatar) avatar.innerHTML = renderAvatar();

    const details = document.getElementById('gameCharacterDetails');
    if (details) details.textContent = `${state.name} ${state.surname} (${state.age})`;

    playerLevel = 1;
    playerMoney = 10000;
    playerXP = 0;
    xpToNext = 20;
    initShop();

    const levelEl = document.getElementById('playerLevel');
    if (levelEl) levelEl.textContent = playerLevel;

    updateMoneyDisplay();
    updateXPDisplay();
    initGameTime();
    initProductPrices();
    initMarketPrices();

    gameMap = generateMap();
    shops = [];

    const hint = document.getElementById('gameHint');
    if (hint) {
        hint.innerHTML = '<svg viewBox="0 0 18 18" width="14" height="14"><path d="M9 2C6.2 2 4 4.2 4 7c0 3 5 9 5 9s5-6 5-9c0-2.8-2.2-5-5-5zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#aaa"/></svg> Выберите место для лавки на рынке';
        hint.classList.remove('success');
    }

    renderMap();

    const screen = document.getElementById('gameScreen');
    if (screen) screen.classList.add('active');
}

const loadBtn = document.getElementById('loadGameBtn');
if (loadBtn) {
    loadBtn.addEventListener('click', () => {
        showGameAlert('Нет сохранённых игр.');
    });
}

// ========== Game State ==========

let playerLevel = 1;
let playerMoney = 10000;
let playerXP = 0;
let xpToNext = 20;

function addXP(amount) {
    playerXP += amount;
    while (playerXP >= xpToNext) {
        playerXP -= xpToNext;
        playerLevel++;
        xpToNext *= 2;
        const levelEl = document.getElementById('playerLevel');
        if (levelEl) levelEl.textContent = playerLevel;
    }
    updateXPDisplay();
}

function updateXPDisplay() {
    const fill = document.getElementById('xpBarFill');
    const text = document.getElementById('xpText');
    if (fill) fill.style.width = Math.min(100, (playerXP / xpToNext) * 100) + '%';
    if (text) text.textContent = playerXP + ' / ' + xpToNext;
}

// ========== Game Dialog (styled alert/prompt/select) ==========

function showGameDialog(title, bodyHTML, actions) {
    // Re-query to get fresh references after any clone/replace
    const dlg = document.getElementById('gameDialog');
    const dlgTitle = document.getElementById('gameDialogTitle');
    const dlgBody = document.getElementById('gameDialogBody');
    const dlgActions = document.getElementById('gameDialogActions');

    // Clone and replace to strip old event listeners
    const newActions = dlgActions.cloneNode(false);
    dlgActions.parentNode.replaceChild(newActions, dlgActions);
    const newBody = dlgBody.cloneNode(false);
    dlgBody.parentNode.replaceChild(newBody, dlgBody);

    newActions.innerHTML = actions.map(a =>
        `<button class="dialog-btn ${a.cls || ''}" data-val="${a.val}">${a.label}</button>`
    ).join('');
    newBody.innerHTML = bodyHTML;

    dlgTitle.textContent = title;
    dlg.classList.add('open');

    return new Promise((resolve) => {
        let settled = false;
        function close(val) {
            if (settled) return;
            settled = true;
            dlg.classList.remove('open');
            resolve(val);
        }

        newActions.addEventListener('click', function handler(e) {
            const btn = e.target.closest('.dialog-btn');
            if (!btn) return;
            close(btn.dataset.val);
        });

        newBody.addEventListener('click', function handler(e) {
            const item = e.target.closest('.dialog-select-item');
            if (!item) return;
            close(item.dataset.idx);
        });

        dlg.addEventListener('click', function handler(e) {
            if (e.target === dlg) close(null);
        });

        setTimeout(() => {
            const inp = newBody.querySelector('.dialog-input');
            if (inp) inp.focus();
        }, 50);
    });
}

// Quick quantity buttons for buy dialog
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;
    const input = document.getElementById('gamePromptInput');
    if (!input) return;
    const add = parseInt(btn.dataset.add, 10);
    if (!add) return;
    input.value = (parseInt(input.value, 10) || 0) + add;
});

function showGameAlert(msg) {
    return showGameDialog('', `<div class="dialog-label">${msg}</div>`, [
        { label: 'OK', val: 'ok', cls: 'confirm' }
    ]);
}

async function showGamePrompt(msg, defaultValue) {
    const result = await showGameDialog('', `
        <label class="dialog-label">${msg}</label>
        <input class="dialog-input" id="gamePromptInput" type="number" min="1" value="${defaultValue}" autofocus>
    `, [
        { label: 'OK', val: 'ok', cls: 'confirm' },
        { label: 'Отмена', val: 'cancel', cls: 'cancel' }
    ]);
    if (result === 'cancel' || result == null) return null;
    const input = document.getElementById('gamePromptInput');
    return input ? parseInt(input.value, 10) : null;
}

async function showGameSelect(msg, items) {
    const listHtml = items.map((item, i) =>
        `<button class="dialog-select-item" data-idx="${i}">${item.label}</button>`
    ).join('');
    const idx = await showGameDialog('', `
        <label class="dialog-label">${msg}</label>
        ${listHtml}
    `, [
        { label: 'Отмена', val: 'cancel', cls: 'cancel' }
    ]);
    if (idx == null || idx === 'cancel') return -1;
    return parseInt(idx, 10);
}

// ========== Suppliers ==========

const SUPPLIERS = {
    food: [
        { name: 'ФрешМаркет', desc: 'Свежие овощи и фрукты', levelReq: 1, hasProducts: true },
        { name: 'Хлебный Дом', desc: 'Хлебобулочные изделия', levelReq: 4 },
        { name: 'Мясная Лавка', desc: 'Мясо и мясные продукты', levelReq: 16 },
        { name: 'Молочный Мир', desc: 'Молочная продукция', levelReq: 27 },
        { name: 'НапиткиPlus', desc: 'Напитки и соки', levelReq: 45 }
    ],
    nonFood: [
        { name: 'БытХим', desc: 'Бытовая химия' },
        { name: 'ОдеждаОпт', desc: 'Одежда и аксессуары' },
        { name: 'Электроника', desc: 'Электротовары' },
        { name: 'КанцТовары', desc: 'Канцелярия' },
        { name: 'СтройМир', desc: 'Стройматериалы' }
    ]
};

const FRESH_PRODUCTS = [
    { name: 'Яблоки', levelReq: 1, basePrice: 80 },
    { name: 'Бананы', levelReq: 2, basePrice: 95 },
    { name: 'Апельсины', levelReq: 4, basePrice: 120 },
    { name: 'Лимоны', levelReq: 5, basePrice: 140 },
    { name: 'Томаты', levelReq: 6, basePrice: 160 },
    { name: 'Огурцы', levelReq: 7, basePrice: 130 },
    { name: 'Картофель', levelReq: 8, basePrice: 45 },
    { name: 'Морковь', levelReq: 9, basePrice: 55 },
    { name: 'Капуста', levelReq: 9, basePrice: 40 },
    { name: 'Лук', levelReq: 10, basePrice: 50 },
    { name: 'Чеснок', levelReq: 10, basePrice: 180 },
    { name: 'Перец', levelReq: 10, basePrice: 200 },
    { name: 'Брокколи', levelReq: 11, basePrice: 170 },
    { name: 'Авокадо', levelReq: 11, basePrice: 250 },
    { name: 'Клубника', levelReq: 12, basePrice: 300 },
    { name: 'Виноград', levelReq: 12, basePrice: 220 },
    { name: 'Мандарины', levelReq: 13, basePrice: 150 },
    { name: 'Груши', levelReq: 13, basePrice: 135 },
    { name: 'Свекла', levelReq: 14, basePrice: 45 },
    { name: 'Кабачки', levelReq: 14, basePrice: 110 }
];

// ========== Pricing System ==========

let productPrices = {};
let currentSupplierPeriod = -1;

function initProductPrices() {
    productPrices = {};
    currentSupplierPeriod = getSupplierPeriod();
    FRESH_PRODUCTS.forEach(p => {
        const mult = 0.3 + Math.random() * 1.4;
        productPrices[p.name] = {
            basePrice: p.basePrice,
            currentMult: mult,
            targetMult: mult,
            currentPrice: Math.round(p.basePrice * mult)
        };
    });
}

function getSupplierPeriod() {
    const start = new Date(2026, 0, 1, 8, 0, 0);
    const diff = gameDate - start;
    return Math.floor(diff / (3 * 24 * 60 * 60 * 1000));
}

function updatePrices(gameMinutesPassed) {
    if (!gameDate) return;

    const period = getSupplierPeriod();
    if (period !== currentSupplierPeriod) {
        currentSupplierPeriod = period;
        FRESH_PRODUCTS.forEach(p => {
            const pp = productPrices[p.name];
            if (!pp) return;
            pp.targetMult = 0.3 + Math.random() * 1.4;
        });
    }

    const hoursPassed = gameMinutesPassed / 60;
    if (hoursPassed <= 0) return;

    FRESH_PRODUCTS.forEach(p => {
        const pp = productPrices[p.name];
        if (!pp) return;
        const diff = pp.targetMult - pp.currentMult;
        if (Math.abs(diff) < 0.0001) {
            pp.currentMult = pp.targetMult;
        } else {
            pp.currentMult += diff * Math.min(1, 0.008 * hoursPassed);
        }
        pp.currentPrice = Math.round(pp.basePrice * pp.currentMult);
    });
}

// ========== Market Prices (Consumer) ==========

let marketPrices = {};
let currentMarketPeriod = -1;

// ========== Price History (for charts) ==========

let priceHistory = {};
let priceSnapshotTimer = 0;

function recordPriceSnapshot() {
    if (!gameDate) return;
    FRESH_PRODUCTS.forEach(p => {
        const name = p.name;
        if (!priceHistory[name]) priceHistory[name] = [];
        const entry = {
            time: gameDate.getTime(),
            supplierPrice: productPrices[name] ? productPrices[name].currentPrice : 0,
            marketPrice: marketPrices[name] ? marketPrices[name].currentPrice : 0
        };
        priceHistory[name].push(entry);
        if (priceHistory[name].length > 200) priceHistory[name].splice(0, 1);
    });
}

function initMarketPrices() {
    marketPrices = {};
    currentMarketPeriod = getMarketPeriod();
    FRESH_PRODUCTS.forEach(p => {
        const mult = 0.3 + Math.random() * 1.4;
        marketPrices[p.name] = {
            basePrice: p.basePrice,
            currentMult: mult,
            targetMult: mult,
            currentPrice: Math.round(p.basePrice * mult)
        };
    });
}

function getMarketPeriod() {
    const start = new Date(2026, 0, 1, 8, 0, 0);
    const diff = gameDate - start;
    return Math.floor(diff / (24 * 60 * 60 * 1000));
}

function updateMarketPrices(gameMinutesPassed) {
    if (!gameDate) return;
    const period = getMarketPeriod();
    if (period !== currentMarketPeriod) {
        currentMarketPeriod = period;
        FRESH_PRODUCTS.forEach(p => {
            const mp = marketPrices[p.name];
            if (!mp) return;
            mp.targetMult = 0.3 + Math.random() * 1.4;
        });
    }
    const hoursPassed = gameMinutesPassed / 60;
    if (hoursPassed <= 0) return;
    FRESH_PRODUCTS.forEach(p => {
        const mp = marketPrices[p.name];
        if (!mp) return;
        const diff = mp.targetMult - mp.currentMult;
        if (Math.abs(diff) < 0.0001) {
            mp.currentMult = mp.targetMult;
        } else {
            mp.currentMult += diff * Math.min(1, 0.008 * hoursPassed);
        }
        mp.currentPrice = Math.round(mp.basePrice * mp.currentMult);
    });
}

function getSellingPrice(shop, productName) {
    if (shop.sellingPrices && shop.sellingPrices[productName] != null) {
        return shop.sellingPrices[productName];
    }
    const mp = marketPrices[productName];
    return mp ? mp.currentPrice : 0;
}

// ========== Customers ==========

let customerTimer = 0;

function processCustomers(gameMinutesPassed) {
    if (!gameDate || shops.length === 0) return;
    customerTimer += gameMinutesPassed;
    const threshold = 240 + Math.random() * 240;
    if (customerTimer < threshold) return;
    customerTimer = 0;

    const count = 1 + Math.floor(Math.random() * 3);
    for (let c = 0; c < count; c++) {
        const shop = shops[Math.floor(Math.random() * shops.length)];
        if (!shop) continue;
        const available = Object.entries(shop.shelf.items).filter(([, q]) => q > 0);
        if (available.length === 0) continue;

        const [name, qty] = available[Math.floor(Math.random() * available.length)];
        const mp = marketPrices[name];
        if (!mp) continue;

        const sellPrice = getSellingPrice(shop, name);
        const ratio = sellPrice / mp.currentPrice;
        let buyQty = 0;
        if (ratio < 0.3) buyQty = Math.min(qty, 2 + Math.floor(Math.random() * 6));
        else if (ratio < 0.7) buyQty = Math.min(qty, 1 + Math.floor(Math.random() * 4));
        else if (ratio < 1.0) buyQty = Math.min(qty, 1 + Math.floor(Math.random() * 2));
        else if (ratio < 1.3 && Math.random() < 0.3) buyQty = Math.min(qty, 1);

        if (buyQty > 0) {
            shop.shelf.items[name] -= buyQty;
            shop.shelf.used -= buyQty;
            playerMoney += sellPrice * buyQty;
            addXP(4 * buyQty);
        }
    }
    updateMoneyDisplay();
    if (shopModal.classList.contains('open') && currentShopId) updateShopModal();
}

// ========== Price Editor Modal ==========

const pricesModal = document.getElementById('pricesModal');
const pricesBtn = document.getElementById('pricesBtn');
const pricesClose = document.getElementById('pricesClose');

function renderPrices() {
    const body = document.getElementById('pricesBody');
    if (!body) return;

    const allItems = {};
    shops.forEach(s => {
        if (s.sellingPrices) {
            Object.entries(s.sellingPrices).forEach(([name, price]) => {
                if (!allItems[name]) allItems[name] = { price, shops: [] };
                allItems[name].shops.push(s.name);
            });
        }
        Object.entries(s.storage.items).forEach(([name]) => {
            if (!allItems[name]) {
                const mp = marketPrices[name];
                allItems[name] = { price: mp ? mp.currentPrice : 0, shops: [] };
            }
            if (!allItems[name].shops.includes(s.name)) allItems[name].shops.push(s.name);
        });
        Object.entries(s.shelf.items).forEach(([name]) => {
            if (!allItems[name]) {
                const mp = marketPrices[name];
                allItems[name] = { price: mp ? mp.currentPrice : 0, shops: [] };
            }
            if (!allItems[name].shops.includes(s.name)) allItems[name].shops.push(s.name);
        });
    });

    const names = Object.keys(allItems);
    if (names.length === 0) {
        body.innerHTML = '<div class="shop-items-empty">Нет товаров в наличии</div>';
        return;
    }

    body.innerHTML = names.map(n => {
        const mp = marketPrices[n];
        const marketPrice = mp ? mp.currentPrice : '—';
        const item = allItems[n];
        const val = item.price || '';
        return `<div class="price-row">
            <span class="price-name">${n}</span>
            <span class="price-market">${marketPrice}₽</span>
            <input class="price-input" data-product="${n}" type="number" min="1" value="${val}" placeholder="—">
            <span class="price-shops">${item.shops.join(', ')}</span>
        </div>`;
    }).join('');
}

function savePrices() {
    document.querySelectorAll('.price-input').forEach(inp => {
        const name = inp.dataset.product;
        const val = parseInt(inp.value, 10);
        if (!val || val <= 0) return;
        shops.forEach(s => {
            if (!s.sellingPrices) s.sellingPrices = {};
            s.sellingPrices[name] = val;
        });
    });
}

if (pricesBtn && pricesModal) {
    pricesBtn.addEventListener('click', async () => {
        if (shops.length === 0) { await showGameAlert('Сначала постройте лавку!'); return; }
        // Reset to editor tab
        document.querySelectorAll('.prices-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.prices-tab-content').forEach(c => c.style.display = 'none');
        const editorTab = document.querySelector('.prices-tab[data-tab="editor"]');
        if (editorTab) editorTab.classList.add('active');
        const editorContent = document.getElementById('pricesTabEditor');
        if (editorContent) editorContent.style.display = 'flex';
        renderPrices();
        pricesModal.classList.add('open');
    });
    pricesModal.addEventListener('click', (e) => {
        if (e.target === pricesModal) {
            savePrices();
            pricesModal.classList.remove('open');
        }
    });
    if (pricesClose) {
        pricesClose.addEventListener('click', () => {
            savePrices();
            pricesModal.classList.remove('open');
        });
    }
    // Save on Enter key
    pricesModal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            savePrices();
            pricesModal.classList.remove('open');
        }
    });
}

// ========== Monitoring Tab ==========

function renderMonitorTab() {
    const body = document.getElementById('monitorBody');
    if (!body) return;

    const names = FRESH_PRODUCTS.map(p => p.name);
    if (names.length === 0) {
        body.innerHTML = '<div class="shop-items-empty">Нет данных</div>';
        return;
    }

    body.innerHTML = names.map(name => {
        const pp = productPrices[name];
        const mp = marketPrices[name];
        const supplierPrice = pp ? pp.currentPrice + '₽' : '—';
        const marketPrice = mp ? mp.currentPrice + '₽' : '—';
        const hasHistory = priceHistory[name] && priceHistory[name].length > 1;
        return `<div class="monitor-item" data-product="${name}"${hasHistory ? '' : ' style="opacity:0.6" title="Нет данных графика"}'}>
            <span class="monitor-name">${name}</span>
            <span class="monitor-price supplier">${supplierPrice}</span>
            <span class="monitor-price market">${marketPrice}</span>
        </div>`;
    }).join('');
}

function renderChart(productName) {
    const body = document.getElementById('chartBody');
    const title = document.getElementById('chartModalTitle');
    if (!body || !title) return;
    title.textContent = 'График цен: ' + productName;

    const hist = priceHistory[productName];
    if (!hist || hist.length < 2) {
        body.innerHTML = '<div class="chart-no-data">Недостаточно данных для графика</div>';
        return;
    }

    const W = 500, H = 220;
    const pad = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;

    let minPrice = Infinity, maxPrice = -Infinity;
    let minTime = Infinity, maxTime = -Infinity;
    hist.forEach(d => {
        if (d.supplierPrice < minPrice) minPrice = d.supplierPrice;
        if (d.supplierPrice > maxPrice) maxPrice = d.supplierPrice;
        if (d.marketPrice < minPrice) minPrice = d.marketPrice;
        if (d.marketPrice > maxPrice) maxPrice = d.marketPrice;
        if (d.time < minTime) minTime = d.time;
        if (d.time > maxTime) maxTime = d.time;
    });

    if (minPrice === maxPrice) { maxPrice = minPrice + 10; }
    const priceRange = maxPrice - minPrice;

    function xPos(time) {
        return pad.left + ((time - minTime) / (maxTime - minTime)) * chartW;
    }
    function yPos(price) {
        return pad.top + chartH - ((price - minPrice) / priceRange) * chartH;
    }

    const supplierLine = hist.map(d => `${xPos(d.time)},${yPos(d.supplierPrice)}`).join(' ');
    const marketLine = hist.map(d => `${xPos(d.time)},${yPos(d.marketPrice)}`).join(' ');

    // Y-axis ticks (5 ticks)
    let yTicksHtml = '';
    for (let i = 0; i <= 4; i++) {
        const val = Math.round(minPrice + (priceRange * i) / 4);
        const yy = pad.top + chartH - (chartH * i) / 4;
        yTicksHtml += `<text x="${pad.left - 6}" y="${yy + 3}" text-anchor="end" font-size="8" fill="#888">${val}</text>`;
        yTicksHtml += `<line x1="${pad.left}" y1="${yy}" x2="${W - pad.right}" y2="${yy}" stroke="#333" stroke-width="1"/>`;
    }

    // X-axis ticks (show day labels)
    const dayMs = 24 * 60 * 60 * 1000;
    const startDay = Math.floor(minTime / dayMs) * dayMs;
    let xTicksHtml = '';
    for (let t = startDay; t <= maxTime; t += dayMs) {
        if (t < minTime || t > maxTime) continue;
        const xx = xPos(t);
        const d = new Date(t);
        const label = DAY_NAMES[d.getDay()] + ' ' + d.getDate();
        xTicksHtml += `<text x="${xx}" y="${H - pad.bottom + 16}" text-anchor="middle" font-size="7" fill="#888">${label}</text>`;
        xTicksHtml += `<line x1="${xx}" y1="${pad.top}" x2="${xx}" y2="${H - pad.bottom}" stroke="#2a2a2a" stroke-width="1"/>`;
    }

    body.innerHTML = `<div class="chart-legend">
        <div class="chart-legend-item"><div class="chart-legend-color" style="background:#d4a060"></div>Закупка</div>
        <div class="chart-legend-item"><div class="chart-legend-color" style="background:#e8c547"></div>Рынок</div>
    </div>
    <svg class="chart-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect x="0" y="0" width="${W}" height="${H}" fill="#1a1a1a"/>
        ${yTicksHtml}
        ${xTicksHtml}
        <polyline points="${supplierLine}" fill="none" stroke="#d4a060" stroke-width="2" stroke-linejoin="round"/>
        <polyline points="${marketLine}" fill="none" stroke="#e8c547" stroke-width="2" stroke-linejoin="round"/>
    </svg>`;
}

// ========== Tab Switching + Chart Modal Handlers ==========

const chartModal = document.getElementById('chartModal');
const chartClose = document.getElementById('chartClose');

// Tab switching
document.querySelectorAll('.prices-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.prices-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const tabName = tab.dataset.tab;
        document.querySelectorAll('.prices-tab-content').forEach(c => c.style.display = 'none');
        const target = document.getElementById('pricesTab' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
        if (target) target.style.display = 'flex';
        if (tabName === 'monitor') renderMonitorTab();
    });
});

// Click monitor item → show chart
document.addEventListener('click', (e) => {
    const item = e.target.closest('.monitor-item');
    if (item && chartModal) {
        const product = item.dataset.product;
        renderChart(product);
        chartModal.classList.add('open');
    }
});

// Chart modal close
if (chartModal && chartClose) {
    chartModal.addEventListener('click', (e) => {
        if (e.target === chartModal) {
            chartModal.classList.remove('open');
        }
    });
    chartClose.addEventListener('click', () => {
        chartModal.classList.remove('open');
    });
}

function renderSuppliers() {
    const foodGrid = document.getElementById('foodSuppliers');
    const nonFoodGrid = document.getElementById('nonFoodSuppliers');

    const lockSvg = '<svg viewBox="0 0 12 12" width="10" height="10"><rect x="2" y="5" width="8" height="6" fill="#c47a7a" rx="1"/><path d="M4 5V3a2 2 0 114 0v2" fill="none" stroke="#c47a7a" stroke-width="1.2"/></svg>';
    const checkSvg = '<svg viewBox="0 0 12 12" width="10" height="10"><path d="M2.5 6l2.5 2.5 4.5-5" fill="none" stroke="#6db86d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const lockSm = '<svg viewBox="0 0 10 10" width="8" height="8"><rect x="1.5" y="4" width="7" height="5" fill="#555" rx=".8"/><path d="M3 4V2.5a2 2 0 114 0V4" fill="none" stroke="#555" stroke-width="1"/></svg>';

    if (foodGrid) {
        foodGrid.innerHTML = SUPPLIERS.food.map(s => {
            const locked = playerLevel < s.levelReq;
            let productsHtml = '';
            if (s.hasProducts && !locked) {
                productsHtml = '<div class="product-grid">' +
                    FRESH_PRODUCTS.map(p => {
                        const pLocked = playerLevel < p.levelReq;
                        const pp = productPrices[p.name];
                        const price = pp ? pp.currentPrice + '₽' : '—';
                        return `<div class="product-item${pLocked ? ' locked' : ''}"${!pLocked ? ' data-product="' + p.name + '"' : ''}>
                            <span class="product-name">${pLocked ? lockSm : ''} ${p.name}</span>
                            <span class="product-price">${price}</span>
                            <span class="product-lvl">ур.${p.levelReq}</span>
                        </div>`;
                    }).join('') + '</div>';
            }
            if (s.hasProducts && locked) {
                productsHtml = '<div class="product-grid faded">' +
                    FRESH_PRODUCTS.map(p => {
                        return `<div class="product-item locked">
                            <span class="product-name">${lockSm} ${p.name}</span>
                            <span class="product-price">—</span>
                            <span class="product-lvl">ур.${p.levelReq}</span>
                        </div>`;
                    }).join('') + '</div>';
            }
            return `<div class="supplier-card${locked ? ' locked' : ''}${s.hasProducts ? ' has-products' : ''}">
                <div class="supplier-name">${locked ? lockSvg : checkSvg} ${s.name}</div>
                <div class="supplier-desc">${s.desc}</div>
                ${locked ? `<div class="supplier-level-req">Требуется ${s.levelReq} уровень</div>` : '<div class="supplier-level-req" style="color:#6db86d">Доступен</div>'}
                ${productsHtml}
            </div>`;
        }).join('');
    }

    if (nonFoodGrid) {
        nonFoodGrid.innerHTML = SUPPLIERS.nonFood.map(s =>
            `<div class="supplier-card locked">
                <div class="supplier-name">${lockSvg} ${s.name}</div>
                <div class="supplier-desc">${s.desc}</div>
                <div class="supplier-premises-badge">Требуется помещение</div>
                <div class="supplier-lock-reason">Нельзя торговать с ларька. Необходимо арендовать отдельное помещение.</div>
            </div>`
        ).join('');
    }
}

// ========== Deliveries ==========

let deliveries = [];

function processDeliveries() {
    if (!gameDate) return;
    const now = gameDate.getTime();
    const arrived = deliveries.filter(d => d.arriveAt <= now);
    if (arrived.length === 0) return;
    deliveries = deliveries.filter(d => d.arriveAt > now);

    arrived.forEach(d => {
        const shop = shops.find(s => s.id === d.shopId);
        if (!shop) return;
        shop.storage.items[d.productName] = (shop.storage.items[d.productName] || 0) + d.qty;
        shop.storage.used += d.qty;
    });

    if (shopModal.classList.contains('open') && currentShopId) {
        updateShopModal();
    }
}

// ========== Supplier Modal ==========

const suppliersModal = document.getElementById('suppliersModal');
const suppliersBtn = document.getElementById('suppliersBtn');
const suppliersClose = document.getElementById('suppliersClose');

function updateSidebarBtns() {
    if (suppliersBtn) {
        if (shops.length > 0) {
            suppliersBtn.classList.remove('locked');
            suppliersBtn.innerHTML = '<svg viewBox="0 0 20 20" width="18" height="18"><rect x="3" y="3" width="14" height="14" fill="none" stroke="#e0e0e0" stroke-width="1.5" rx="2"/><path d="M6 7h8M6 10h8M6 13h5" fill="none" stroke="#e0e0e0" stroke-width="1.5" stroke-linecap="round"/></svg>\nПоставщики';
        } else {
            suppliersBtn.classList.add('locked');
            suppliersBtn.innerHTML = '<svg viewBox="0 0 20 20" width="18" height="18"><rect x="5" y="9" width="10" height="8" fill="#666" rx="1"/><path d="M7 9V6a3 3 0 116 0v3" fill="none" stroke="#666" stroke-width="1.5"/></svg>\nПоставщики';
        }
    }
    if (pricesBtn) {
        if (shops.length > 0) {
            pricesBtn.classList.remove('locked');
        } else {
            pricesBtn.classList.add('locked');
        }
    }
}

async function buyProduct(productName) {
    const pp = productPrices[productName];
    if (!pp) return;

    if (shops.length === 0) {
        await showGameAlert('Сначала постройте лавку!');
        return;
    }

    const mp = marketPrices[productName];
    const marketPrice = mp ? mp.currentPrice : '—';
    const supplierPrice = pp.currentPrice;

    const result = await showGameDialog('', `
        <div style="font-size:10px;color:#e0e0e0;text-align:center;margin-bottom:8px;text-shadow:1px 1px 0 #000">${productName}</div>
        <div style="display:flex;justify-content:space-between;font-size:7px;margin-bottom:10px">
            <span style="color:#d4a060">Закупка: ${supplierPrice}₽</span>
            <span style="color:#e8c547">Рынок: ${marketPrice}₽</span>
        </div>
        <label class="dialog-label">Количество:</label>
        <input class="dialog-input" id="gamePromptInput" type="number" min="0" value="0" autofocus>
        <div style="display:flex;gap:4px;margin-top:6px;justify-content:center">
            <button class="qty-btn" data-add="5">+5</button>
            <button class="qty-btn" data-add="10">+10</button>
            <button class="qty-btn" data-add="50">+50</button>
        </div>
    `, [
        { label: 'Купить', val: 'ok', cls: 'confirm' },
        { label: 'Отмена', val: 'cancel', cls: 'cancel' }
    ]);
    if (result === 'cancel' || result == null) return;
    const input = document.getElementById('gamePromptInput');
    const qty = input ? parseInt(input.value, 10) : 0;
    if (!qty || qty <= 0) return;

    const total = pp.currentPrice * qty;
    if (playerMoney < total) {
        await showGameAlert('Недостаточно средств! Нужно: ' + total.toLocaleString('ru') + '₽, есть: ' + playerMoney.toLocaleString('ru') + '₽');
        return;
    }

    // Choose which shop to deliver to
    let shop = null;
    if (shops.length === 1) {
        shop = shops[0];
    } else {
        const items = shops.map(s => ({ label: s.name }));
        const idx = await showGameSelect('В какую лавку доставить?', items);
        if (idx < 0 || idx >= shops.length) return;
        shop = shops[idx];
    }

    const free = shop.storage.capacity - shop.storage.used;
    if (free < qty) {
        await showGameAlert('Недостаточно места на складе в «' + shop.name + '»! Свободно: ' + free + ' ед., нужно: ' + qty + ' ед.');
        return;
    }

    playerMoney -= total;
    updateMoneyDisplay();

    const hours = 4 + Math.floor(Math.random() * 4);
    const arriveAt = gameDate.getTime() + hours * 60 * 60 * 1000;
    deliveries.push({ shopId: shop.id, productName, qty, arriveAt });

    renderSuppliers();
    await showGameAlert('Заказ оформлен! Доставка в «' + shop.name + '» через ' + hours + ' ч.');
}

if (suppliersBtn && suppliersModal) {
    updateSidebarBtns();

    suppliersBtn.addEventListener('click', async () => {
        if (shops.length === 0) {
            await showGameAlert('Сначала установите лавку!');
            return;
        }
        renderSuppliers();
        suppliersModal.classList.add('open');
    });

    suppliersModal.addEventListener('click', (e) => {
        if (e.target === suppliersModal) {
            suppliersModal.classList.remove('open');
            return;
        }
        const item = e.target.closest('.product-item:not(.locked)');
        if (item && item.dataset.product) {
            buyProduct(item.dataset.product);
        }
    });

    if (suppliersClose) {
        suppliersClose.addEventListener('click', () => {
            suppliersModal.classList.remove('open');
        });
    }
}

// ========== Shop Modal (Лавка) ==========

function initShop() {
    // Shops are created per-tile via onMarketClick
}

function getCurrentShop() {
    return shops.find(s => s.id === currentShopId);
}

const shopModal = document.getElementById('shopModal');
const shopModalClose = document.getElementById('shopModalClose');

function updateShopModal() {
    const shop = getCurrentShop();
    if (!shop) return;
    const st = shop.storage;
    const sh = shop.shelf;

    document.getElementById('shopModalTitle').textContent = shop.name;
    document.getElementById('storageUsed').textContent = st.used;
    document.getElementById('storageMax').textContent = st.capacity;
    document.getElementById('storageBar').style.width = (st.capacity > 0 ? (st.used / st.capacity * 100) : 0) + '%';
    document.getElementById('storageLevel').textContent = st.level + ' / 6';

    const stItems = document.getElementById('storageItems');
    if (stItems) {
        const entries = Object.entries(st.items).filter(e => e[1] > 0);
        if (entries.length === 0) {
            stItems.innerHTML = '<div class="shop-items-empty">Склад пуст</div>';
        } else {
            stItems.innerHTML = entries.map(([name, qty]) =>
                `<div class="shop-item" data-product="${name}" data-location="storage">
                    <span class="shop-item-name">${name}</span>
                    <span class="shop-item-qty">${qty} ед.</span>
                </div>`
            ).join('');
        }
    }

    document.getElementById('shelfUsed').textContent = sh.used;
    document.getElementById('shelfMax').textContent = sh.capacity;
    document.getElementById('shelfBar').style.width = (sh.capacity > 0 ? (sh.used / sh.capacity * 100) : 0) + '%';
    document.getElementById('shelfLevel').textContent = sh.level + ' / 6';

    const shItems = document.getElementById('shelfItems');
    if (shItems) {
        const entries = Object.entries(sh.items).filter(e => e[1] > 0);
        if (entries.length === 0) {
            shItems.innerHTML = '<div class="shop-items-empty">Полка пуста</div>';
        } else {
            shItems.innerHTML = entries.map(([name, qty]) =>
                `<div class="shop-item" data-product="${name}" data-location="shelf">
                    <span class="shop-item-name">${name}</span>
                    <span class="shop-item-qty">${qty} ед.</span>
                </div>`
            ).join('');
        }
    }

    // Delivery count
    const shopDeliveries = deliveries.filter(d => d.shopId === shop.id);
    const delEl = document.getElementById('shopDeliveries');
    if (delEl) {
        if (shopDeliveries.length === 0) {
            delEl.innerHTML = '<div class="shop-items-empty">Нет активных поставок</div>';
        } else {
            delEl.innerHTML = shopDeliveries.map(d => {
                const remaining = Math.max(0, Math.ceil((d.arriveAt - gameDate.getTime()) / (60 * 60 * 1000)));
                return `<div class="shop-item"><span class="shop-item-name">${d.productName}</span><span class="shop-item-qty">${d.qty} ед. (${remaining} ч.)</span></div>`;
            }).join('');
        }
    }

    const stBtn = document.getElementById('upgradeStorageBtn');
    const shBtn = document.getElementById('upgradeShelfBtn');

    if (st.level >= 6) {
        stBtn.disabled = true;
        stBtn.textContent = 'Максимум';
        stBtn.classList.add('maxed');
    } else {
        stBtn.disabled = playerMoney < 5000;
        stBtn.textContent = '+ Складское место 5 000₽';
        stBtn.classList.remove('maxed');
    }

    if (sh.level >= 6) {
        shBtn.disabled = true;
        shBtn.textContent = 'Максимум';
        shBtn.classList.add('maxed');
    } else {
        shBtn.disabled = playerMoney < 5000;
        shBtn.textContent = '+ Полка 5 000₽';
        shBtn.classList.remove('maxed');
    }

    if (spp.classList.contains('open')) updateShopPricesPanel();
}

// ========== Item Context Menu (Storage/Shelf) ==========

const itemMenu = document.getElementById('itemMenu');
const itemMenuTitle = document.getElementById('itemMenuTitle');

let itemMenuContext = null; // { product, location, sourceShopId }

function hideItemMenu() {
    itemMenu.classList.remove('open');
    itemMenuContext = null;
}

function showItemMenu(e, product, location) {
    itemMenuContext = { product, location, sourceShopId: currentShopId };
    const shop = getCurrentShop();
    const fromStorage = location === 'storage';

    itemMenuTitle.textContent = product + ' (' + (fromStorage ? 'склад' : 'полка') + ')';

    // Show/hide buttons based on location
    itemMenu.querySelector('[data-action="toShelf"]').style.display = fromStorage ? '' : 'none';
    itemMenu.querySelector('[data-action="toStorage"]').style.display = fromStorage ? 'none' : '';

    // Disable "to other shop" if only 1 shop
    const otherBtn = itemMenu.querySelector('[data-action="toOtherShop"]');
    otherBtn.disabled = shops.length < 2;

    // Position near click
    const x = Math.min(e.clientX, window.innerWidth - 160);
    const y = Math.min(e.clientY, window.innerHeight - 180);
    itemMenu.style.left = Math.max(4, x) + 'px';
    itemMenu.style.top = Math.max(4, y) + 'px';

    itemMenu.classList.add('open');
}

// Click on shop item → show menu
document.addEventListener('click', (e) => {
    const item = e.target.closest('.shop-item');
    if (item && item.dataset.product) {
        const product = item.dataset.product;
        const location = item.dataset.location;
        const shop = getCurrentShop();
        if (!shop) return;
        const qty = location === 'storage'
            ? (shop.storage.items[product] || 0)
            : (shop.shelf.items[product] || 0);
        if (qty <= 0) return;
        e.stopPropagation();
        showItemMenu(e, product, location);
    }
});

// Click on menu action
itemMenu.addEventListener('click', async (e) => {
    const btn = e.target.closest('.item-menu-btn');
    if (!btn || btn.disabled) return;
    const action = btn.dataset.action;
    const ctx = itemMenuContext;
    if (!ctx) return;
    hideItemMenu();

    const shop = shops.find(s => s.id === ctx.sourceShopId);
    if (!shop) return;

    const source = ctx.location === 'storage' ? shop.storage : shop.shelf;
    const available = source.items[ctx.product] || 0;
    if (available <= 0) return;

    if (action === 'discard') {
        const qty = await showGamePrompt('Сколько выбросить? (есть: ' + available + ')', '1');
        if (!qty || qty <= 0) return;
        const toRemove = Math.min(qty, available);
        source.items[ctx.product] -= toRemove;
        source.used -= toRemove;
        if (source.items[ctx.product] <= 0) delete source.items[ctx.product];
        updateShopModal();
        return;
    }

    if (action === 'toShelf') {
        const free = shop.shelf.capacity - shop.shelf.used;
        if (free <= 0) { await showGameAlert('Полка заполнена!'); return; }
        const maxQty = Math.min(available, free);
        const qty = await showGamePrompt('Сколько переместить на полку? (доступно: ' + maxQty + ')', String(maxQty));
        if (!qty || qty <= 0) return;
        const toMove = Math.min(qty, maxQty);
        source.items[ctx.product] -= toMove;
        source.used -= toMove;
        shop.shelf.items[ctx.product] = (shop.shelf.items[ctx.product] || 0) + toMove;
        shop.shelf.used += toMove;
        updateShopModal();
        return;
    }

    if (action === 'toStorage') {
        const free = shop.storage.capacity - shop.storage.used;
        if (free <= 0) { await showGameAlert('Склад заполнен!'); return; }
        const maxQty = Math.min(available, free);
        const qty = await showGamePrompt('Сколько убрать на склад? (доступно: ' + maxQty + ')', String(maxQty));
        if (!qty || qty <= 0) return;
        const toMove = Math.min(qty, maxQty);
        source.items[ctx.product] -= toMove;
        source.used -= toMove;
        shop.storage.items[ctx.product] = (shop.storage.items[ctx.product] || 0) + toMove;
        shop.storage.used += toMove;
        updateShopModal();
        return;
    }

    if (action === 'toOtherShop') {
        // Pick target shop
        const others = shops.filter(s => s.id !== ctx.sourceShopId);
        if (others.length === 0) { await showGameAlert('Нет других лавок!'); return; }
        const items = others.map(s => ({ label: s.name }));
        const idx = await showGameSelect('В какую лавку переместить?', items);
        if (idx < 0 || idx >= others.length) return;
        const target = others[idx];

        const free = target.storage.capacity - target.storage.used;
        if (free <= 0) { await showGameAlert('Склад получателя заполнен!'); return; }
        const maxQty = Math.min(available, free);
        const qty = await showGamePrompt('Сколько переместить? (доступно: ' + maxQty + ')', String(maxQty));
        if (!qty || qty <= 0) return;
        const toMove = Math.min(qty, maxQty);
        source.items[ctx.product] -= toMove;
        source.used -= toMove;
        target.storage.items[ctx.product] = (target.storage.items[ctx.product] || 0) + toMove;
        target.storage.used += toMove;
        updateShopModal();
        return;
    }
});

// Close menu on click outside
document.addEventListener('click', (e) => {
    if (itemMenu.classList.contains('open') && !itemMenu.contains(e.target) && !e.target.closest('.shop-item')) {
        hideItemMenu();
    }
});

// Close menu on scroll inside shop modal
document.getElementById('storageItems').addEventListener('scroll', hideItemMenu);
document.getElementById('shelfItems').addEventListener('scroll', hideItemMenu);

// ========== Shop Prices Panel (side panel) ==========

const spp = document.getElementById('shopPricesPanel');
const sppBody = document.getElementById('sppBody');
const sppShopName = document.getElementById('sppShopName');
const sppClose = document.getElementById('sppClose');

function updateShopPricesPanel() {
    const shop = getCurrentShop();
    if (!shop) { sppBody.innerHTML = ''; return; }
    sppShopName.textContent = shop.name;

    const st = shop.storage;
    const sh = shop.shelf;
    const productNames = new Set();
    Object.keys(st.items).forEach(k => { if (st.items[k] > 0) productNames.add(k); });
    Object.keys(sh.items).forEach(k => { if (sh.items[k] > 0) productNames.add(k); });
    const names = [...productNames];

    if (names.length === 0) {
        sppBody.innerHTML = '<div class="shop-items-empty">Нет товаров</div>';
        return;
    }

    sppBody.innerHTML = names.map(n => {
        const mp = marketPrices[n];
        const marketPrice = mp ? mp.currentPrice : '—';
        const val = shop.sellingPrices ? (shop.sellingPrices[n] || '') : '';
        return `<div class="spp-row">
            <div class="spp-row-top">
                <span class="spp-name">${n}</span>
                <span class="spp-market">Рынок: ${marketPrice}₽</span>
            </div>
            <div class="spp-row-bottom">
                <input class="spp-input" data-product="${n}" type="number" min="1" value="${val}" placeholder="—">
                <button class="spp-equal" data-product="${n}" title="Приравнять к рыночной цене">= рынку</button>
            </div>
        </div>`;
    }).join('');
}

// Save price on input
sppBody.addEventListener('input', (e) => {
    const inp = e.target.closest('.spp-input');
    if (!inp) return;
    const shop = getCurrentShop();
    if (!shop) return;
    const name = inp.dataset.product;
    const val = parseInt(inp.value, 10);
    if (!shop.sellingPrices) shop.sellingPrices = {};
    if (val > 0) {
        shop.sellingPrices[name] = val;
    } else {
        delete shop.sellingPrices[name];
    }
});

// Equal to market button
sppBody.addEventListener('click', (e) => {
    const btn = e.target.closest('.spp-equal');
    if (!btn) return;
    const name = btn.dataset.product;
    const mp = marketPrices[name];
    if (!mp) return;
    const shop = getCurrentShop();
    if (!shop) return;
    if (!shop.sellingPrices) shop.sellingPrices = {};
    shop.sellingPrices[name] = mp.currentPrice;
    const inp = sppBody.querySelector(`.spp-input[data-product="${name}"]`);
    if (inp) inp.value = mp.currentPrice;
});

sppClose.addEventListener('click', () => { hideShopPricesPanel(); });

function showShopPricesPanel() {
    if (!shopModal.classList.contains('open')) return;
    updateShopPricesPanel();
    spp.classList.add('open');
}

function hideShopPricesPanel() {
    spp.classList.remove('open');
}

function upgradeStorage() {
    const shop = getCurrentShop();
    if (!shop) return;
    if (shop.storage.level >= 6) return;
    if (playerMoney < 5000) return;
    playerMoney -= 5000;
    shop.storage.level++;
    shop.storage.capacity += 10;
    updateMoneyDisplay();
    updateShopModal();
}

function upgradeShelf() {
    const shop = getCurrentShop();
    if (!shop) return;
    if (shop.shelf.level >= 6) return;
    if (playerMoney < 5000) return;
    playerMoney -= 5000;
    shop.shelf.level++;
    shop.shelf.capacity += 10;
    updateMoneyDisplay();
    updateShopModal();
}

document.getElementById('upgradeStorageBtn').addEventListener('click', upgradeStorage);
document.getElementById('upgradeShelfBtn').addEventListener('click', upgradeShelf);

// Event delegation for storage → shelf move buttons

if (shopModal && shopModalClose) {
    shopModal.addEventListener('click', (e) => {
        if (e.target === shopModal) {
            shopModal.classList.remove('open');
            hideShopPricesPanel();
        }
    });
    shopModalClose.addEventListener('click', () => {
        shopModal.classList.remove('open');
        hideShopPricesPanel();
    });
}


// ========== Time System ==========

let gameDate = null;
let timeSpeed = 0;
let timeInterval = null;

function initGameTime() {
    gameDate = new Date(2026, 0, 1, 8, 0, 0);
    timeSpeed = 0;
    priceSnapshotTimer = 0;
    priceHistory = {};
    updateTimeDisplay();
    resetTimeBtns();

    const pauseBtn = document.getElementById('timePause');
    if (pauseBtn) pauseBtn.classList.add('active');

    if (timeInterval) clearInterval(timeInterval);
    timeInterval = setInterval(tickGameTime, 1000);
    setTimeout(initEntities, 50);
}

function formatTime(n) {
    return String(n).padStart(2, '0');
}

const DAY_NAMES = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

function updateTimeDisplay() {
    const el = document.getElementById('gameTime');
    const dayEl = document.getElementById('gameDay');
    if (!el || !gameDate) return;
    const d = gameDate;
    if (dayEl) dayEl.textContent = DAY_NAMES[d.getDay()];
    el.textContent = `${formatTime(d.getDate())}.${formatTime(d.getMonth() + 1)}.${d.getFullYear()} ${formatTime(d.getHours())}:${formatTime(d.getMinutes())}`;
}

function tickGameTime() {
    if (timeSpeed === 0 || !gameDate) return;
    const minutes = 5 * timeSpeed;
    gameDate.setTime(gameDate.getTime() + minutes * 60000);
    updateTimeDisplay();
    updatePrices(minutes);
    updateMarketPrices(minutes);
    priceSnapshotTimer += minutes;
    if (priceSnapshotTimer >= 60) {
        priceSnapshotTimer = 0;
        recordPriceSnapshot();
    }
    processDeliveries();
    processCustomers(minutes);
}

function resetTimeBtns() {
    document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
}

function setTimeSpeed(speed) {
    timeSpeed = speed;
    resetTimeBtns();
    const map = { 0: 'timePause', 1: 'timeNormal', 2: 'timeFast' };
    const btn = document.getElementById(map[speed]);
    if (btn) btn.classList.add('active');
}

document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setTimeSpeed(parseInt(btn.dataset.speed));
    });
});

// ========== City Entities (Cars & People) ==========

const ROADS_H = [2, 6, 9];
const ROADS_V = [3, 7, 12];
const entities = [];

const entitySprites = {
    car: (color, dirH) => {
        const flip = dirH ? '' : ' scaleX(-1)';
        return `<svg viewBox="0 0 16 12" width="16" height="12" shape-rendering="crispEdges" style="transform:${flip}"><rect x="2" y="5" width="12" height="5" fill="${color}"/><rect x="3" y="3" width="3" height="3" fill="#555"/><rect x="10" y="3" width="3" height="3" fill="#555"/><rect x="4" y="9" width="2" height="2" fill="#333"/><rect x="10" y="9" width="2" height="2" fill="#333"/></svg>`;
    },
    person: () => {
        return `<svg viewBox="0 0 6 10" width="6" height="10" shape-rendering="crispEdges"><circle cx="3" cy="2" r="2" fill="#888"/><rect x="2" y="4" width="2" height="4" fill="#888"/><line x1="2" y1="5" x2="0" y2="8" stroke="#888" stroke-width="1"/><line x1="4" y1="5" x2="6" y2="8" stroke="#888" stroke-width="1"/></svg>`;
    }
};

function getEntityPos(e) {
    const TILE_STEP = 42;
    let x, y;
    if (e.axis === 'h') {
        x = e.pos * TILE_STEP + 20;
        y = ROADS_H[e.line] * TILE_STEP + 20;
    } else {
        x = ROADS_V[e.line] * TILE_STEP + 20;
        y = e.pos * TILE_STEP + 20;
    }
    return { x, y };
}

function applyEntityPos(e) {
    const pos = getEntityPos(e);
    if (e.type === 'car') {
        e.el.style.transform = `translate(${pos.x - 8}px, ${pos.y - 6}px)`;
    } else {
        e.el.style.transform = `translate(${pos.x - 3}px, ${pos.y - 5}px)`;
    }
}

function initEntities() {
    const layer = document.getElementById('entityLayer');
    if (!layer) return;
    entities.length = 0;
    layer.innerHTML = '';

    const carColors = ['#7a7a7a', '#8a6a5a', '#6a7a8a', '#7a7a5a', '#5a7a7a', '#7a6a6a'];
    const carDefs = [
        { axis: 'h', line: 0, pos: 0, dir: 1, speed: 0.28, ci: 0 },
        { axis: 'h', line: 1, pos: 8, dir: -1, speed: 0.22, ci: 1 },
        { axis: 'h', line: 2, pos: 4, dir: 1, speed: 0.25, ci: 2 },
        { axis: 'v', line: 0, pos: 3, dir: 1, speed: 0.26, ci: 3 },
        { axis: 'v', line: 1, pos: 7, dir: -1, speed: 0.2, ci: 4 },
        { axis: 'v', line: 2, pos: 10, dir: -1, speed: 0.23, ci: 5 }
    ];

    carDefs.forEach((d, i) => {
        const e = { ...d, type: 'car', color: carColors[d.ci], el: null, id: 'c' + i };
        e.el = document.createElement('div');
        e.el.className = 'map-entity';
        if (e.axis === 'h') {
            e.el.innerHTML = entitySprites.car(e.color, e.dir === 1);
        } else {
            const deg = e.dir === 1 ? 90 : -90;
            e.el.innerHTML = `<svg viewBox="0 0 16 12" width="16" height="12" shape-rendering="crispEdges" style="transform:rotate(${deg}deg)"><rect x="2" y="5" width="12" height="5" fill="${e.color}"/><rect x="3" y="3" width="3" height="3" fill="#555"/><rect x="10" y="3" width="3" height="3" fill="#555"/><rect x="4" y="9" width="2" height="2" fill="#333"/><rect x="10" y="9" width="2" height="2" fill="#333"/></svg>`;
        }
        applyEntityPos(e);
        layer.appendChild(e.el);
        entities.push(e);
    });

    const personDefs = [
        { axis: 'h', line: 0, pos: 2, dir: 1, speed: 0.11 },
        { axis: 'h', line: 1, pos: 12, dir: -1, speed: 0.09 },
        { axis: 'v', line: 0, pos: 6, dir: -1, speed: 0.13 },
        { axis: 'v', line: 1, pos: 4, dir: 1, speed: 0.1 },
        { axis: 'h', line: 2, pos: 7, dir: 1, speed: 0.09 },
        { axis: 'v', line: 2, pos: 9, dir: -1, speed: 0.11 }
    ];

    personDefs.forEach((d, i) => {
        const e = { ...d, type: 'person', el: null, id: 'p' + i, stopTimer: 0 };
        e.el = document.createElement('div');
        e.el.className = 'map-entity';
        e.el.innerHTML = entitySprites.person();
        applyEntityPos(e);
        layer.appendChild(e.el);
        entities.push(e);
    });

    // Start smooth animation loop
    if (entityAnimFrame) cancelAnimationFrame(entityAnimFrame);
    lastEntityTime = 0;
    entityAnimFrame = requestAnimationFrame(entityAnimLoop);
}

function isPersonNearMarket(e) {
    if (e.type !== 'person') return false;
    const col = e.axis === 'h' ? e.pos : ROADS_V[e.line];
    const row = e.axis === 'v' ? e.pos : ROADS_H[e.line];
    if (e.axis === 'h' && (ROADS_H[e.line] === 2 || ROADS_H[e.line] === 6)) {
        return col >= 3 && col <= 7;
    }
    if (e.axis === 'v' && ROADS_V[e.line] === 3) {
        return row >= 2 && row <= 6;
    }
    return false;
}

// ========== Smooth Entity Animation (rAF) ==========

let entityAnimFrame = null;
let lastEntityTime = 0;

function entityAnimLoop(timestamp) {
    if (lastEntityTime === 0) lastEntityTime = timestamp;
    const dt = Math.min((timestamp - lastEntityTime) / 1000, 0.1);
    lastEntityTime = timestamp;

    if (entities.length > 0 && timeSpeed > 0) {
        stepEntities(dt, timeSpeed);
    }

    entityAnimFrame = requestAnimationFrame(entityAnimLoop);
}

function stepEntities(dt, speedMult) {
    const maxH = MAP_W - 1;
    const maxV = MAP_H - 1;

    entities.forEach(e => {
        if (e.type === 'person') {
            if (e.stopTimer > 0) {
                e.stopTimer -= dt;
                return;
            }
            if (isPersonNearMarket(e) && Math.random() < dt * 0.3) {
                e.stopTimer = 2 + Math.random() * 3;
                return;
            }
        }

        const maxPos = e.axis === 'h' ? maxH : maxV;
        e.pos += e.dir * e.speed * speedMult * dt;

        if (e.pos > maxPos + 0.5) e.pos -= maxPos + 1;
        if (e.pos < -0.5) e.pos += maxPos + 1;

        applyEntityPos(e);
    });
}

});
