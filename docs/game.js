const logElement = document.getElementById('log');

// --- SOUND ENGINE ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'hit') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(); osc.stop(now + 0.1);
    } else if (type === 'crit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(); osc.stop(now + 0.2);
    } else if (type === 'heal') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(); osc.stop(now + 0.3);
    } else if (type === 'ult') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(1000, now + 0.5);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(); osc.stop(now + 0.5);
    }
}

// --- GAME STATE ---
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
        playSound('heal');
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
    updateUI();
}

function playerAttack(type) {
    if (titan.hp <= 0 || assassin.hp <= 0) return;

    // Решаем проблему блокировки звука браузером
    if (audioCtx.state === 'suspended') audioCtx.resume();

    let dmg = 0;
    let dodgeBonus = 0;

    if (type === 'quick') { 
        dmg = assassin.atk * 0.75; 
        dodgeBonus = 0.3; 
        energy = Math.min(100, energy + 25);
        playSound('hit');
    }
    else if (type === 'heavy') { 
        dmg = assassin.atk * 1.6; 
        dodgeBonus = -0.4; 
        energy = Math.min(100, energy + 35);
        playSound('crit');
    }
    else if (type === 'heal') { 
        assassin.hp = Math.min(assassin.maxHp, assassin.hp + 40); 
        playSound('heal');
        print("✨ Repairing...", "log-heal"); 
    }
    else if (type === 'ult') {
        dmg = assassin.atk * 3.8;
        energy = 0;
        titan.hasShield = false; 
        playSound('ult');
        triggerShake();
    }

    if (type !== 'heal') {
        dmg = Math.round(dmg + Math.random() * 10);
        titan.hp -= dmg;
        updateUI();
    }

    if (titan.hp > 0) {
        setTimeout(() => {
            if (Math.random() < (0.15 + dodgeBonus)) {
                print("💨 Evaded!", "log-evade");
            } else {
                let tDmg = Math.round(titan.atk + Math.random() * 5);
                assassin.hp -= tDmg;
                playSound('hit');
                triggerShake();
            }
            updateUI();
        }, 500);
    } else {