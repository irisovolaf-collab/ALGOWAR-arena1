const logElement = document.getElementById('log');

// Game State
let stage = 1;
let credits = 0;
let playerCritChance = 0.2;

const titan = { name: "Code-Titan", hp: 200, maxHp: 200, atk: 15, hasShield: true };
const assassin = { name: "Script-Assassin", hp: 100, maxHp: 100, atk: 40 };
const medic = { name: "Bit-Medic", healPower: 25 };

function getHpColor(pct) {
    if (pct > 50) return "#2ecc71";
    if (pct > 25) return "#f1c40f";
    return "#e74c3c";
}

function updateUI() {
    document.getElementById('stage-title').innerText = `⚔️ AlgoWar Arena: Stage ${stage} ⚔️`;
    document.getElementById('credits-display').innerText = `Credits: ${credits}`;

    const titanPct = (titan.hp / titan.maxHp) * 100;
    const tBar = document.getElementById('titan-hp-bar');
    tBar.style.width = Math.max(0, titanPct) + "%";
    tBar.style.background = getHpColor(titanPct);
    document.getElementById('titan-hp-text').innerText = `${Math.round(Math.max(0, titan.hp))}/${Math.round(titan.maxHp)}`;

    const assassinPct = (assassin.hp / assassin.maxHp) * 100;
    const aBar = document.getElementById('assassin-hp-bar');
    aBar.style.width = Math.max(0, assassinPct) + "%";
    aBar.style.background = getHpColor(assassinPct);
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
        if (type === 'atk') {
            assassin.atk += 10;
            print("💰 Upgraded: Attack Power +10!", "log-heal");
        } else if (type === 'hp') {
            assassin.maxHp += 50;
            assassin.hp += 50;
            print("💰 Upgraded: Max HP +50!", "log-heal");
        }
        updateUI();
    } else {
        print("❌ Not enough credits!", "log-crit");
    }
}

function nextStage() {
    stage++;
    titan.maxHp = Math.round(200 * Math.pow(1.2, stage - 1));
    titan.hp = titan.maxHp;
    titan.atk = 15 + (stage * 3);
    titan.hasShield = true;
    
    print(`🚀 STAGE ${stage} - Data packets corrupted!`, "log-system");
    showShop(false);
    updateUI();
}

function playerAttack(type) {
    if (titan.hp <= 0 || assassin.hp <= 0) return;

    let finalDmg = 0;
    let dodgeBonus = 0;

    if (type === 'quick') {
        finalDmg = assassin.atk * 0.7;
        dodgeBonus = 0.25; 
        print("⚡ Quick Strike!", "log-evade");
    } else if (type === 'heavy') {
        finalDmg = assassin.atk * 1.5;
        dodgeBonus = -0.4;
        print("🔨 Heavy Slam!", "log-heavy");
    } else if (type === 'heal') {
        let heal = 30 + (stage * 5);
        assassin.hp = Math.min(assassin.maxHp, assassin.hp + heal);
        print(`✨ Self-Repair +${heal} HP.`, "log-heal");
    }

    if (type !== 'heal') {
        finalDmg = Math.round(finalDmg + Math.random() * 10);
        if (titan.hasShield) { finalDmg = Math.round(finalDmg * 0.5); titan.hasShield = false; }
        
        if (Math.random() < playerCritChance) {
            finalDmg *= 2;
            print(`🔥 CRIT! ${finalDmg} dmg.`, "log-crit");
        } else {
            print(`⚔️ Dealt ${finalDmg} damage.`);
        }
        titan.hp -= finalDmg;
    }
    updateUI();

    if (titan.hp > 0) {
        setTimeout(() => {
            if (Math.random() < (0.15 + dodgeBonus)) {
                print("💨 Evaded!", "log-evade");
            } else {
                let tDmg = Math.round(titan.atk + Math.random() * 5);
                assassin.hp -= tDmg;
                print(`🤖 Titan hits for ${tDmg}.`);
            }
            updateUI();
            if (assassin.hp <= 0) print("💀 SYSTEM TERMINATED.", "log-crit");
        }, 500);
    } else {
        credits += 100;
        print("🏆 Victory! Credits +100. Enter shop to upgrade.", "log-heal");
        updateUI();
        showShop(true);
    }
}

updateUI(); // Initial UI sync