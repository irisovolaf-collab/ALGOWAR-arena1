const Game = {
    p: { hp: 100, mHp: 100, atk: 40, credits: 0 },
    e: { name: "", hp: 0, mHp: 0, atk: 0, art: "" },
    stage: 1,
    isBusy: false,
    autoMode: true, // АВТОПИЛОТ ВКЛЮЧЕН

    init() {
        this.spawn();
        this.log("SYSTEM ONLINE. AUTOPILOT: ACTIVE");
        this.update();
        if(this.autoMode) this.planNextMove();
    },

    spawn() {
        const d = Math.pow(1.15, this.stage - 1);
        this.e = {
            name: "BOT-" + Math.floor(Math.random() * 99),
            mHp: Math.round(120 * d),
            atk: Math.round(10 * d),
            art: `\n      [=====]\n     /  X X  \\\n    |    V    |\n     \\_______/`
        };
        this.e.hp = this.e.mHp;
    },

    // Планировщик автоматического хода
    planNextMove() {
        if (!this.autoMode || this.isBusy || this.p.hp <= 0) return;
        
        setTimeout(() => {
            if (this.isBusy) return;
            // Логика ИИ: лечимся, если мало HP, иначе бьем
            const action = (this.p.hp < this.p.mHp * 0.4) ? 'heal' : 'quick';
            this.attack(action);
        }, 2000); // Ход каждые 2 секунды
    },

    attack(type) {
        if (this.isBusy || this.p.hp <= 0) return;
        this.isBusy = true;
        this.update();

        let d = this.p.atk * (type === 'heavy' ? 1.5 : (type === 'quick' ? 0.8 : 0));
        
        if (type === 'heal') {
            let h = Math.round(this.p.mHp * 0.3);
            this.p.hp = Math.min(this.p.mHp, this.p.hp + h);
            this.log(`REPAIR: +${h} HP`);
        } else {
            let f = Math.round(d + Math.random() * 5);
            this.e.hp -= f;
            this.log(`PLAYER -> ${this.e.name}: ${f} DMG`);
        }

        this.update();

        if (this.e.hp <= 0) {
            this.win();
        } else {
            setTimeout(() => this.eTurn(), 800);
        }
    },

    eTurn() {
        if (this.p.hp <= 0) return;
        let d = Math.round(this.e.atk + Math.random() * 5);
        this.p.hp -= d;
        this.log(`${this.e.name} -> PLAYER: ${d} DMG`, "red");
        this.update();
        
        this.isBusy = false;
        this.update();

        if (this.p.hp <= 0) {
            this.log("SYSTEM CRASH.", "red");
            document.getElementById('ui-battle').style.display = 'none';
        } else {
            this.planNextMove(); // Снова планируем авто-ход
        }
    },

    win() {
        this.p.credits += 100;
        this.log("SECTOR CLEAR. +100c");
        this.isBusy = false;
        
        // Автоматический переход в магазин и следующий уровень
        setTimeout(() => {
            this.stage++;
            this.spawn();
            this.log("PROCEEDING TO SECTOR " + this.stage);
            this.update();
            this.planNextMove();
        }, 1500);
    },

    update() {
        try {
            document.getElementById('stage-txt').innerText = "SECTOR " + this.stage;
            document.getElementById('credits-txt').innerText = this.p.credits;
            document.getElementById('hp-p').style.width = (this.p.hp / this.p.mHp * 100) + "%";
            document.getElementById('hp-e').style.width = (this.e.hp / this.e.mHp * 100) + "%";
            document.getElementById('enemy-visual').innerText = this.e.art;

            const btns = document.querySelectorAll('button');
            btns.forEach(b => b.disabled = this.isBusy);
        } catch (e) { console.error("UI Update Error: ", e); }
    },

    log(m, color = "") {
        const l = document.getElementById('log');
        if(!l) return;
        l.innerHTML += `<p style="color:${color === 'red' ? '#ff4444' : '#2ecc71'}">> ${m}</p>`;
        l.scrollTop = l.scrollHeight;
    }
};

window.onload = () => Game.init();