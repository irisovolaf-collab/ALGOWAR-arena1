// === КОНФИГУРАЦИЯ И АРТЫ ===
const ARTS = {
    TITAN: `\n      [=====]\n     /  O O  \\\n    |    V    |\n    |  [___]  |\n     \\_______/\n      |  |  |`,
    SCOUT: `\n       / ^ \\\n      / (_) \\\n     <  [:]  >\n      \\  v  /\n       \\___/`,
    GUARD: `\n     _________\n    | [|||||] |\n    |  _|_|_  |\n    | |_____| |\n    |_________|`,
    BOSS:  `\n     /XXXXXXXXX\\\n    |  _     _  |\n   <| [@]   [@] |>\n    |    ###    |\n    |  \\_____/  |\n     \\_________/\n      V       V`
};

// === ДВИЖОК ИГРЫ ===
const Game = {
    // Состояние
    player: { hp: 100, maxHp: 100, atk: 40, lvl: 1, xp: 0, nextXp: 100 },
    enemy: null,
    stage: 1,
    credits: 0,
    energy: 0,
    isBusy: false, // Блокировка действий во время анимации

    // Инициализация
    init: function() {
        this.loadScore();
        this.spawnEnemy();
        this.updateUI();
        this.log("SYSTEM ONLINE. SECTOR 1 REACHED.", "l-sys");
    },

    // Генерация врага
    spawnEnemy: function() {
        const isBoss = (this.stage % 5 === 0);
        const hpMult = Math.pow(1.25, this.stage - 1);
        
        if (isBoss) {
            this.enemy = { 
                name: "OMEGA-CORE", 
                type: "BOSS", 
                maxHp: Math.round(600 + (this.stage * 40)), 
                atk: 25 + (this.stage * 2),
                color: "#9b59b6"
            };
        } else {
            const types = ["TITAN", "SCOUT", "GUARD"];
            const colors = ["#ff5555", "#f1c40f", "#3498db"];
            const idx = Math.floor(Math.random() * types.length);
            this.enemy = {
                name: "CYBER-" + types[idx],
                type: types[idx],
                maxHp: Math.round(200 * hpMult),
                atk: 15 + (this.stage * 3),
                color: colors[idx]
            };
        }
        this.enemy.hp = this.enemy.maxHp;
    },

    // Действия игрока
    playerAttack: function(type) {
        if (this.isBusy || this.player.hp <= 0) return;
        this.isBusy = true; // Блокируем кнопки

        let dmg = 0;
        let msg = "";
        let style = "l-dmg";

        if (type === 'quick') {
            dmg = Math.round(this.player.atk * 0.8);
            this.energy = Math.min(100, this.energy + 25);
            msg = "QUICK STRIKE executed";
        } else if (type === 'heavy') {
            dmg = Math.round(this.player.atk * 1.5);
            this.energy = Math.min(100, this.energy + 35);
            msg = "HEAVY IMPACT detected";
        } else if (type === 'heal') {
            const heal = Math.round(this.player.maxHp * 0.4);
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
            this.log(`REPAIR SYSTEM: +${heal} HP`, "l-heal");
            this.updateUI();
            setTimeout(() => this.enemyTurn(), 600); // Пропускаем урон, сразу ход врага
            return;
        } else if (type === 'ult') {
            dmg = this.player.atk * 5;
            this.energy = 0;
            msg = "ULTIMATE OVERLOAD RELEASED!";
            style = "l-crit";
        }

        // Рандомный разброс урона
        const finalDmg = Math.round(dmg * (0.9 + Math.random() * 0.2));
        this.enemy.hp -= finalDmg;
        this.log(`> ${msg}: ${finalDmg} DMG`, style);
        
        this.updateUI();

        if (this.enemy.hp <= 0) {
            this.winBattle();
        } else {
            setTimeout(() => this.enemyTurn(), 800); // Задержка перед ударом врага
        }
    },

    // Ход врага
    enemyTurn: function() {
        if (this.enemy.hp <= 0) return;

        const dmg = Math.round(this.enemy.atk * (0.8 + Math.random() * 0.4));
        this.player.hp -= dmg;
        
        // Визуальные эффекты получения урона
        document.getElementById('game-body').classList.add('shake', 'flash-red');
        setTimeout(() => document.getElementById('game-body').classList.remove('shake', 'flash-red'), 500);

        this.log(`WARNING: ${this.enemy.name} attacks for ${dmg} HP`, "l-crit");
        this.updateUI();
        
        if (this.player.hp <= 0) {
            this.gameOver();
        } else {
            this.isBusy = false; // Разблокируем кнопки
        }
    },

    // Победа
    winBattle: function() {
        const isBoss = (this.enemy.type === 'BOSS');
        const xpGain = isBoss ? 200 : 50 + (this.stage * 10);
        const credGain = isBoss ? 500 : 150;

        this.player.xp += xpGain;
        this.credits += credGain;
        
        this.log(`TARGET ELIMINATED. Data: +${xpGain} XP, +${credGain} Credits.`, "l-sys");
        this.checkLevelUp();
        
        // Смена интерфейса
        setTimeout(() => {
            document.getElementById('screen-battle').classList.add('hidden');
            document.getElementById('screen-shop').classList.remove('hidden');
            this.isBusy = false;
        }, 500);
    },

    // Уровень
    checkLevelUp: function() {
        if (this.player.xp >= this.player.nextXp) {
            this.player.lvl++;
            this.player.xp -= this.player.nextXp;
            this.player.nextXp = Math.round(this.player.nextXp * 1.5);
            
            this.player.maxHp += 30;
            this.player.hp = this.player.maxHp;
            this.player.atk += 12;
            
            this.log(`*** UPGRADE COMPLETE: LEVEL ${this.player.lvl} ***`, "l-sys");
            this.checkLevelUp(); // Рекурсия на случай двойного апа
        }
    },

    // Магазин
    buy: function(item) {
        if (this.credits < 100) {
            this.log("INSUFFICIENT FUNDS.", "l-crit");
            return;
        }
        this.credits -= 100;
        if (item === 'atk') {
            this.player.atk += 15;
            this.log("WEAPON OPTIMIZED. (+15 ATK)", "l-heal");
        } else if (item === 'hp') {
            this.player.maxHp += 50;
            this.player.hp = this.player.maxHp;
            this.log("HULL REINFORCED. (+50 HP)", "l-heal");
        }
        this.updateUI();
    },

    // Переход
    nextStage: function() {
        // Шанс на событие (30%)
        document.getElementById('screen-shop').classList.add('hidden');
        
        if (Math.random() < 0.3) {
            document.getElementById('screen-event').classList.remove('hidden');
            this.log("ENCRYPTED SIGNAL DETECTED...", "l-sys");
        } else {
            this.startNewStage();
        }
    },

    // Событие
    resolveEvent: function(isRisk) {
        document.getElementById('screen-event').classList.add('hidden');
        if (isRisk) {
            if (Math.random() > 0.4) {
                const loot = 250;
                this.credits += loot;
                this.log(`DECRYPTION SUCCESSFUL. Found ${loot} credits.`, "l-heal");
            } else {
                const dmg = 35;
                this.player.hp -= dmg;
                this.log(`SECURITY BREACH! Took ${dmg} damage.`, "l-crit");
                if (this.player.hp <= 0) {
                    this.updateUI();
                    this.gameOver();
                    return;
                }
            }
        } else {
            this.log("Signal ignored.");
        }
        setTimeout(() => this.startNewStage(), 1000);
    },

    startNewStage: function() {
        this.stage++;
        if(this.stage > localStorage.getItem('algoWarHigh')) {
            localStorage.setItem('algoWarHigh', this.stage);
        }
        this.spawnEnemy();
        document.getElementById('screen-battle').classList.remove('hidden');
        this.log(`ENTERING SECTOR ${this.stage}...`, "l-sys");
        this.updateUI();
    },

    gameOver: function() {
        this.log("CRITICAL SYSTEM FAILURE.", "l-crit");
        document.getElementById('screen-battle').classList.add('hidden');
        document.getElementById('screen-event').classList.add('hidden');
        document.getElementById('screen-over').classList.remove('hidden');
    },

    // Обновление экрана
    updateUI: function() {
        // Тексты
        document.getElementById('stage-txt').innerText = `SECTOR ${this.stage}`;
        document.getElementById('highscore').innerText = localStorage.getItem('algoWarHigh') || 1;
        document.getElementById('credits-txt').innerText = `CREDITS: ${this.credits}`;
        document.getElementById('lvl-txt').innerText = `LVL: ${this.player.lvl}`;
        
        // Полоски игрока
        const hpPct = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
        document.getElementById('hp-bar-p').style.width = `${hpPct}%`;
        document.getElementById('hp-txt-p').innerText = `${Math.round(this.player.hp)}/${this.player.maxHp}`;
        
        document.getElementById('en-bar').style.width = `${this.energy}%`;
        document.getElementById('xp-bar').style.width = `${(this.player.xp / this.player.nextXp) * 100}%`;
        
        // Кнопка ульты
        const btnUlt = document.getElementById('btn-ult');
        btnUlt.style.display = (this.energy >= 100) ? 'inline-block' : 'none';
        
        // Враг
        const eHpPct = Math.max(0, (this.enemy.hp / this.enemy.maxHp) * 100);
        document.getElementById('hp-bar-e').style.width = `${eHpPct}%`;
        document.getElementById('hp-txt-e').innerText = `${Math.max(0, this.enemy.hp)}/${this.enemy.maxHp}`;
        document.getElementById('enemy-name').innerText = this.enemy.name;
        
        const visual = document.getElementById('enemy-visual');
        visual.innerText = ARTS[this.enemy.type] || ARTS.TITAN;
        visual.style.color = this.enemy.color;
        visual.style.transform = (this.enemy.type === 'BOSS') ? "scale(1.4)" : "scale(1)";
        
        // Блокировка кнопок (визуальная)
        const btns = document.querySelectorAll('button');
        btns.forEach(b => b.disabled = this.isBusy);
    },

    loadScore: function() {
        try {
            if(!localStorage.getItem('algoWarHigh')) localStorage.setItem('algoWarHigh', 1);
        } catch(e) { console.log("Storage disabled"); }
    },

    log: function(msg, cls = "") {
        const el = document.getElementById('log');
        const p = document.createElement('p');
        p.className = cls;
        p.innerText = msg;
        el.appendChild(p);
        el.scrollTop = el.scrollHeight;
    }
};

// Старт
window.onload = () => Game.init();