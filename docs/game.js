const logElement = document.getElementById('log');

// Game State
let stage = 1;
const titan = { name: "Code-Titan", hp: 200, maxHp: 200, atk: 15, hasShield: true };
const assassin = { name: "Script-Assassin", hp: 100, maxHp: 100, atk: 40 };
const medic = { name: "Bit-Medic", healPower: 25 };

function getHpColor(pct) {
    if (pct > 50) return "#2ecc71";
    if (pct > 25) return "#f1c40f";
    return "#e74c3c";
}

function updateUI() {
    // Update Stage Info (added dynamically)
    document.querySelector('h1').innerText = `⚔️ AlgoWar Arena: Stage ${stage} ⚔️`;

    // Update Titan
    const titanPct = (titan.hp / titan.maxHp) * 100;
    const tBar = document.getElementById('titan-hp-bar');
    tBar.style.width = Math.max(0, titanPct) + "%";
    tBar.style.background = getHpColor(titanPct);
    document.getElementById('titan-hp-text').innerText = `${Math.round(Math.max(0, titan.hp))}/${Math.round(titan.maxHp)}`;

    // Update Assassin
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

// Function to start next wave
function startNextStage() {
    stage++;
    titan.maxHp = Math.round(titan.maxHp * 1.2); // +20% HP
    titan.hp = titan.maxHp;
    titan.atk += 3; // +3 Attack
    titan.hasShield = true;
    
    assassin.maxHp += 20; // Player grows too
    assassin.hp = assassin.maxHp;
    
    print(`🚀 <b>STAGE ${stage} STARTED!</b> Enemy upgraded.`, "log-system");
    updateUI();
}

function playerAttack(type) {
    if (titan.hp <= 0 || assassin.hp <= 0) return;

    let finalDmg = 0;
    let dodgeBonus = 0;

    if (type === 'quick') {
        finalDmg = 25 + Math.random() * 10;
        dodgeBonus = 0.25; 
        print("⚡ <b>Quick Strike!</b>", "log-evade");
    } else if (type === 'heavy') {
        finalDmg = 60 + Math.random() * 20;
        dodgeBonus = -0.4;
        print("🔨 <b>Heavy Slam!</b>", "log-heavy");
    } else if (type === 'heal') {
        let healAmount = 30 + (stage * 5);
        assassin.hp = Math.min(assassin.maxHp, assassin.hp + healAmount);
        print(`✨ <b>Self-Repair!</b> +${healAmount} HP.`, "log-heal");
    }

    if (type !== 'heal') {
        finalDmg = Math.round(finalDmg);
        if (titan.hasShield) {
            finalDmg = Math.round(finalDmg * 0.5);
            titan.hasShield = false;
            print("🛡️ Shield absorbed damage!");
        }
        
        let isCrit = Math.random() < 0.2;
        if (isCrit) finalDmg *= 2;
        print(isCrit ? `🔥 <b>CRIT!</b> ${finalDmg} dmg.` : `⚔️ ${finalDmg} dmg.`, isCrit ? "log-crit" : "");
        titan.hp -= finalDmg;
    }
    updateUI();

    if (titan.hp > 0) {
        setTimeout(() => {
            if (Math.random() < (0.15 + dodgeBonus)) {
                print("💨 <b>EVADED!</b>", "log-evade");
            } else {
                let tDmg = Math.round(titan.atk + Math.random() * 5);
                assassin.hp -= tDmg;
                print(`🤖 <b>Titan</b> deals ${tDmg} damage!`);
            }
            
            if (titan.hp < (titan.maxHp * 0.4) && titan.hp > 0) {
                titan.hp += medic.healPower;
                print(`💉 <b>Medic</b> repaired Titan!`, "log-heal");
            }
            
            updateUI();
            if (assassin.hp <= 0) print("💀 <b>DEFEAT!</b> Game Over.", "log-crit");
            print("----------------------------", "log-system");
        }, 600);
    } else {
        print(`🏆 <b>STAGE ${stage} CLEAR!</b> Preparing next wave...`, "log-heal");
        setTimeout(startNextStage, 2000); // Wait 2 seconds before next stage
    }
}