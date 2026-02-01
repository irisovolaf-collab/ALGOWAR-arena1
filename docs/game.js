const logElement = document.getElementById('log');

// Global Stats
const titan = { name: "Code-Titan", hp: 200, maxHp: 200, atk: 15, hasShield: true };
const assassin = { name: "Script-Assassin", hp: 80, maxHp: 80, atk: 40 };
const medic = { name: "Bit-Medic", healPower: 25 };

function getHpColor(pct) {
    if (pct > 50) return "#2ecc71"; // Green
    if (pct > 25) return "#f1c40f"; // Yellow
    return "#e74c3c"; // Red
}

function updateUI() {
    // Update Titan UI
    const titanPct = (titan.hp / titan.maxHp) * 100;
    const tBar = document.getElementById('titan-hp-bar');
    tBar.style.width = Math.max(0, titanPct) + "%";
    tBar.style.background = getHpColor(titanPct);
    document.getElementById('titan-hp-text').innerText = `${Math.round(Math.max(0, titan.hp))}/${titan.maxHp}`;

    // Update Assassin UI
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

function playerAttack(type) {
    if (titan.hp <= 0 || assassin.hp <= 0) return;

    let finalDmg = 0;
    let dodgeBonus = 0;

    // 1. YOUR ACTION
    if (type === 'quick') {
        finalDmg = 25 + Math.random() * 10;
        dodgeBonus = 0.25; 
        print("⚡ <b>Quick Strike!</b> Your evasion chance increased.", "log-evade");
    } else if (type === 'heavy') {
        finalDmg = 60 + Math.random() * 20;
        dodgeBonus = -0.4;
        print("🔨 <b>Heavy Slam!</b> Powerful hit, but you are exposed!", "log-heavy");
    } else if (type === 'heal') {
        let healAmount = 30;
        assassin.hp = Math.min(assassin.maxHp, assassin.hp + healAmount);
        print(`✨ <b>Self-Repair!</b> Restored ${healAmount} HP.`, "log-heal");
    }

    // Apply Damage to Titan
    if (type !== 'heal') {
        finalDmg = Math.round(finalDmg);
        if (titan.hasShield) {
            finalDmg = Math.round(finalDmg * 0.5);
            titan.hasShield = false;
            print("🛡️ Titan's shield absorbed 50% damage!");
        }
        
        let isCrit = Math.random() < 0.2;
        if (isCrit) {
            finalDmg *= 2;
            print(`🔥 <b>CRITICAL HIT!</b> Dealt ${finalDmg} damage!`, "log-crit");
        } else {
            print(`⚔️ Dealt ${finalDmg} damage to Titan.`);
        }
        titan.hp -= finalDmg;
    }
    updateUI();

    // 2. ENEMY RESPONSE
    if (titan.hp > 0) {
        setTimeout(() => {
            let dodgeChance = 0.15 + dodgeBonus;
            if (Math.random() < dodgeChance) {
                print("💨 <b>EVADED!</b> Titan's attack missed you!", "log-evade");
            } else {
                let tDmg = Math.round(12 + Math.random() * 6);
                assassin.hp -= tDmg;
                print(`🤖 <b>Titan</b> hits you for ${tDmg} damage!`);
            }
            
            // Medic support
            if (titan.hp < 100 && titan.hp > 0) {
                titan.hp += medic.healPower;
                print(`💉 <b>Medic</b> repaired Titan for +${medic.healPower} HP!`, "log-heal");
            }
            
            updateUI();
            if (assassin.hp <= 0) print("💀 <b>DEFEAT!</b> Your system has crashed.", "log-crit");
            print("----------------------------", "log-system");
        }, 600);
    } else {
        print("🏆 <b>VICTORY!</b> Code-Titan has been deleted!", "log-heal");
        updateUI();
    }
}