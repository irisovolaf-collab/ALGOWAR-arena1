const logElement = document.getElementById('log');

let stage = 1;
let credits = 0;
let energy = 0;
let medicCharges = 3;

const titan = { name: "Code-Titan", hp: 200, maxHp: 200, atk: 15, hasShield: true };
const assassin = { name: "Script-Assassin", hp: 100, maxHp: 100, atk: 40 };

function triggerShake() {
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 300);
}

function updateUI() {
    document.getElementById('stage-title').innerText = `⚔️ Sector ${stage} ⚔️`;
    document.getElementById('credits-display').innerText = `Credits: ${credits}`;

    const eBar = document.getElementById('energy-bar');
    eBar.style.width = energy + "%";
    document.getElementById('ult-button').style.display = energy >= 100 ? "inline-block" : "none";

    const updateBar = (id, current, max) => {
        const pct = (current / max) * 100;
        const bar = document.getElementById(id);
        bar.style.width = Math.max(0, pct) + "%";
        if (pct > 50) bar.style.background = "#2ecc71";
        else if (pct > 25) bar.style.background = "#f1c40f";
        else { bar.style.background = "#e74c3c"; bar.classList.add('low-hp'); }
        if (pct > 25) bar.classList.remove('low-hp');
    };

    updateBar('titan-hp-bar', titan.hp, titan.maxHp);
    updateBar('assassin-hp-bar', assassin.hp, assassin.maxHp);
    document.getElementById('titan-hp-text').innerText = `${Math.round(Math.max(0, titan.hp))}/${Math.round(titan.maxHp)}`;
    document.getElementById('assassin-hp-text').innerText = `${Math.round(Math.max(0, assassin.hp))}/${assassin.maxHp}`;
}

function print(text, className = "") {
    logElement.innerHTML += `<p class="${className}">${text}</p>`;
    logElement.scrollTop = logElement.scrollHeight;
}

function showShop(show) {
    document.getElementById('battle-actions').classList.toggle('hidden', show);
    document.getElementById('shop-actions').classList.toggle('hidden', !show);
}

function buyUpgrade(type) {
    if (credits >= 100) {
        credits -= 100;
        if (type === 'atk') assassin.atk += 12;
        else if (type === 'hp') { assassin.maxHp += 60; assassin.hp = assassin.maxHp; }
        print("💰 Upgrade installed.", "log-heal");
        updateUI();
    }
}

function nextStage() {
    stage++;
    medicCharges = 3;
    energy = Math.min(energy, 40); 
    titan.maxHp = Math.round(200 * Math.pow(1.25, stage - 1));
    titan.hp = titan.maxHp;
    titan.atk = 15 + (stage * 4);
    titan.hasShield = true;
    showShop(false);
    print(`--- Entering Sector ${stage} ---`, "log-system");
    updateUI();
}

function playerAttack(type) {
    if (titan.hp <= 0 || assassin.hp <= 0) return;

    let dmg = 0;
    let dodgeBonus = 0;

    if (type === 'quick') { 
        dmg = assassin.atk * 0.75; 
        dodgeBonus = 0.3; 
        energy = Math.min(100, energy + 25);
        print("⚡ Quick Strike!", "log-evade");
    }
    else if (type === 'heavy') { 
        dmg = assassin.atk * 1.6; 
        dodgeBonus = -0.4; 
        energy = Math.min(100, energy + 35);
        print("🔨 Heavy Slam!", "log-heavy");
    }
    else if (type === 'heal') { 
        let h = 40 + (stage * 2);
        assassin.hp = Math.min(assassin.maxHp, assassin.hp + h); 
        print(`✨ Repairing... +${h} HP`, "log-heal"); 
    }
    else if (type === 'ult') {
        dmg = assassin.atk * 3.8;
        energy = 0;
        titan.hasShield = false; 
        print("🚀 ULTIMATE: SYSTEM OVERLOAD!", "log-crit");
        triggerShake(); triggerShake();
    }

    if (type !== 'heal') {
        dmg = Math.round(dmg + Math.random() * 10);
        if (titan.hasShield && type !== 'ult') { dmg *= 0.5; titan.hasShield = false; print("🛡️ Shield hit!"); }
        
        let isCrit = Math.random() < 0.2 && type !== 'ult';
        if (isCrit) { dmg *= 2; print(`🔥 CRIT: ${dmg} dmg!`, "log-crit"); triggerShake(); }
        else if (type !== 'ult') { print(`⚔️ Hit for ${dmg} damage.`); }
        
        titan.hp -= dmg;
    }
    updateUI();

    if (titan.hp > 0) {
        setTimeout(() => {
            if (Math.random() < (0.15 + dodgeBonus)) {
                print("💨 Evaded strike!", "log-evade");
            } else {
                let tDmg = Math.round(titan.atk + Math.random() * 5);
                assassin.hp -= tDmg;
                print(`🤖 Titan: -${tDmg} HP.`);
                triggerShake();
            }
            if (titan.hp < (titan.maxHp * 0.4) && medicCharges > 0) {
                titan.hp += (30 + stage * 5); medicCharges--;
                print(`💉 Medic Repair Pack! (${medicCharges} left)`, "log-heal");
            }
            updateUI();
            if (assassin.hp <= 0) print("💀 FATAL ERROR: Offline.", "log-crit");
        }, 500);
    } else {
        credits += 125;
        print("🏆 Victory! Credits +125.", "log-heal");
        showShop(true);
    }
}

updateUI();