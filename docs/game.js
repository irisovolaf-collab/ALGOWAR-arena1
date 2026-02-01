const Game = {
    // Данные
    p: { hp: 100, mHp: 100, atk: 40, lvl: 1, credits: 0 },
    e: { name: "", hp: 0, mHp: 0, atk: 0, art: "" },
    stage: 1,
    isBusy: false,

    // Запуск
    init() {
        this.spawn();
        this.log("CORE SYSTEM ONLINE. SECTOR " + this.stage);
        this.update();
    },

    // Создание врага
    spawn() {
        const diff = Math.pow(1.2, this.stage - 1);
        this.e = {
            name: "UNIT-" + Math.floor(Math.random() * 999),
            mHp: Math.round(150 * diff),
            atk: Math.round(12 * diff),
            art: `\n      [=====]\n     /  O O  \\\n    |    V    |\n     \\_______/`
        };
        this.e.hp = this.e.mHp;
    },

    // Атака
    attack(type) {
        if (this.isBusy || this.p.hp <= 0) return;
        this.isBusy = true;

        let dmg = this.p.atk;
        if (type === 'quick') dmg *= 0.8;
        if (type === 'heavy') dmg *= 1.5;
        
        if (type === 'heal') {
            const heal = Math.round(this.p.mHp * 0.35);
            this.p.hp = Math.min(this.p.mHp, this.p.hp + heal);
            this.log("REPAIR: +" + heal + " HP");
        } else {
            const final = Math.round(dmg + Math.random() * 10);
            this.e.hp -= final;
            this.log("YOU -> " + this.e.name + ": " + final + " DMG");
        }

        this.update();

        if (this.e.hp <= 0) {
            this.win();
        } else {
            setTimeout(() => this.eTurn(), 600);
        }
    },

    // Ход врага
    eTurn() {
        const dmg = Math.round(this.e.atk + Math.random() * 5);
        this.p.hp -= dmg;
        this.log(this.e.name + " -> YOU: " + dmg + " DMG", "log-red");
        this.update();
        
        if (this.p.hp <= 0) {
            this.log("CRITICAL FAILURE. CONNECTION LOST.", "log-red");
            document.getElementById('ui-battle').classList.add('hidden');
            document.getElementById('ui-over').classList.remove('hidden');
        } else {
            this.isBusy = false;
        }
    },

    win() {
        const reward = 100 + (this.stage * 20);
        this.p.credits += reward;
        this.log("SECTOR CLEARED. REWARD: " + reward + "c", "log-yellow");
        document.getElementById('ui-battle').classList.add('hidden');
        document.getElementById('ui-shop').classList.remove('hidden');
        this.isBusy = false;
        this.update();
    },

    buy(item) {
        if (this.p.credits >= 100) {
            this.p.credits -= 100;
            if (item === 'atk') this.p.atk += 10;
            if (item === 'hp') { this.p.mHp += 40; this.p.hp = this.p.mHp; }
            this.log("UPGRADE PURCHASED.");
            this.update();
        }
    },

    next() {
        this.stage++;
        this.spawn();
        document.getElementById('ui-shop').classList.add('hidden');
        document.getElementById('ui-battle').classList.remove('hidden');
        this.log("ENTERING SECTOR " + this.stage);
        this.update();
    },

    // Обновление экрана
    update() {
        document.getElementById('stage-txt').innerText = "SECTOR " + this.stage;
        document.getElementById('credits-txt').innerText = this.p.credits;
        document.getElementById('lvl-txt').innerText = this.p.lvl;
        
        document.getElementById('hp-p').style.width = (this.p.hp / this.p.mHp * 100) + "%";
        document.getElementById('hp-p-val').innerText = Math.max(0, Math.round(this.p.hp)) + "/" + this.p.mHp;
        
        document.getElementById('hp-e').style.width = (this.e.hp / this.e.mHp * 100) + "%";
        document.getElementById('hp-e-val').innerText = Math.max(0, Math.round(this.e.hp)) + "/" + this.e.mHp;
        
        document.getElementById('enemy-name').innerText = this.e.name;
        document.getElementById('enemy-visual').innerText = this.e.art;

        const btns = document.querySelectorAll('button');
        btns.forEach(b => b.disabled = this.isBusy);
    },

    log(m, cls = "") {
        const l = document.getElementById('log');
        l.innerHTML += `<p class="${cls}">> ${m}</p>`;
        l.scrollTop = l.scrollHeight;
    }
};

window.onload = () => Game.init();