const logElement = document.getElementById('log');
let audioCtx;

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playSound(f, type = 'square', d = 0.1) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f, audioCtx.currentTime);
    g.gain.setValueAtTime(0.1, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + d);
    osc.connect(g); g.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + d);
}

let stage = 1;
let credits = 0;
let energy = 0;
const assassin = { hp: 100, maxHp: 100, atk: 40 };
let enemy = {};

const enemyTypes = [
    { name: "CODE-TITAN", hpMult: 2.0, atkMult: 1.0, evade: 0.1, color: "#e74c3c" },
    { name: "VIRUS-SCOUT", hpMult: 0.8, atkMult: 1.2, evade: 0.4, color: "#f1c40f" },
    { name: "FIREWALL", hpMult: 1.5, atkMult: 0.7, evade: 0.05, color: "#3498db" }
];

function spawnEnemy() {
    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const baseHp = 100 * Math.pow(1.2, stage - 1);
    enemy = {
        name: type.name,
        maxHp: Math.round(baseHp * type.hpMult),
        hp: Math.round(baseHp * type.hpMult),
        atk: Math.round((10 + stage * 3) * type.atkMult),
        evade: type.evade,
        color: type.color
    };
    document.getElementById('enemy-name').innerText = enemy.name;
    document.getElementById('enemy-name').style.color = enemy.color;
    print(`🚨 WARNING: ${enemy.name} detected!`, "log-system");
}

function updateUI() {
    document.getElementById('stage-title').innerText = `SECTOR ${stage}`;
    document.getElementById('credits-display').innerText = `Credits: ${credits}`;
    document.getElementById('energy-bar').style.width = energy + "%";
    document.getElementById('ult-button').style.display = energy >= 100 ? "inline-block" : "none";

    const updateBar = (id, cur, max, textId) => {
        const pct = (cur / max) * 100;
        const b = document.getElementById(id);
        const t = document.getElementById(textId);
        if (b) {
            b.style.width = Math.max(0, pct) + "%";
            b.style.background = pct > 50 ? "#2ecc71" : pct > 25 ? "#f1c40f" : "#e74c3c";
        }
        if (t) t.innerText = `${Math.max(0, Math.round(cur))}/${Math.round(max)}`;
    };
    updateBar('titan-hp-bar', enemy.hp, enemy.maxHp, 'titan-hp-text');
    updateBar('assassin-hp-bar', assassin.hp, assassin.maxHp, 'assassin-hp-text');
}

function print(t, c = "") {
    logElement.innerHTML += `<p class="${c}">${t}</p>`;
    logElement.scrollTop = logElement.scrollHeight;
}

function playerAttack(type) {
    if (enemy.hp <= 0 || assassin.hp <= 0) return;
    initAudio();

    let dmg = 0;
    let dodgeBonus = 0;

    if (type === 'quick') { dmg = assassin.atk * 0.7; dodgeBonus = 0.2; energy = Math.min(100, energy + 20); playSound(200); }
    else if (type === 'heavy') { dmg = assassin.atk * 1.5; dodgeBonus = -0.3; energy = Math.min(100, energy + 30); playSound(100, 'sawtooth'); }
    else if (type === 'heal') { assassin.hp = Math.min(assassin.maxHp, assassin.hp + 40); playSound(400, 'sine', 0.3); print("✨ Repairing...", "log-heal"); }
    else if (type === 'ult') { dmg = assassin.atk * 4.5; energy = 0; playSound(600, 'triangle', 0.5); print("🚀 SYSTEM OVERLOAD!", "log-crit"); }

    if (type !== 'heal') {
        if (Math.random() < enemy.evade && type !== 'ult') {
            print(`💨 ${enemy.name} evaded!`, "log-evade");
        } else {
            dmg = Math.round(dmg + Math.random() * 10);
            enemy.hp -= dmg;
            print(`⚔️ Dealt ${dmg} damage.`);
        }
    }
    updateUI();

    if (enemy.hp > 0) {
        setTimeout(() => {
            if (Math.random() < (0.15 + dodgeBonus)) {
                print("💨 You dodged!", "log-evade");
            } else {
                let eDmg = Math.round(enemy.atk + Math.random() * 5);
                assassin.hp -= eDmg;
                print(`🤖 ${enemy.name} strike: -${eDmg} HP.`);
                document.body.classList.add('shake');
                setTimeout(() => document.body.classList.remove('shake'), 200);
                playSound(50, 'square');
            }
            updateUI();
            if (assassin.hp <= 0) print("💀 SYSTEM FAILURE", "log-crit");
        }, 500);
    } else {
        credits += 125;
        print(`🏆 Sector Cleared. Credits +125.`, "log-heal");
        document.getElementById('battle-actions').classList.add('hidden');
        document.getElementById('shop-actions').classList.remove('hidden');
    }
}

function buyUpgrade(t) {
    if (credits >= 100) {
        credits -= 100;
        if (t === 'atk') assassin.atk += 15;
        if (t === 'hp') { assassin.maxHp += 50; assassin.hp = assassin.maxHp; }
        playSound(500, 'sine', 0.4);
        updateUI();
    }
}

function nextStage() {
    stage++;
    energy = Math.min(energy, 30);
    spawnEnemy();
    document.getElementById('battle-actions').classList.remove('hidden');
    document.getElementById('shop-actions').classList.add('hidden');
    updateUI();
}

window.onload = () => {
    spawnEnemy();
    updateUI();
};