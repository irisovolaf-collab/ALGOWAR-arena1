const logElement = document.getElementById('log');
const titan = { name: "Code-Titan", hp: 200, maxHp: 200, atk: 15, hasShield: true };
const assassin = { name: "Script-Assassin", hp: 80, maxHp: 80, atk: 40 };
const medic = { name: "Bit-Medic", healPower: 25 };

// FIX: Now supports color classes
function print(text, className = "") {
    logElement.innerHTML += `<p class="${className}">${text}</p>`;
    logElement.scrollTop = logElement.scrollHeight;
}

function updateUI() {
    const titanPct = (titan.hp / titan.maxHp) * 100;
    document.getElementById('titan-hp-bar').style.width = Math.max(0, titanPct) + "%";
    document.getElementById('titan-hp-text').innerText = `${Math.round(Math.max(0, titan.hp))}/${titan.maxHp}`;

    const assassinPct = (assassin.hp / assassin.maxHp) * 100;
    document.getElementById('assassin-hp-bar').style.width = Math.max(0, assassinPct) + "%";
    document.getElementById('assassin-hp-text').innerText = `${Math.round(Math.max(0, assassin.hp))}/${assassin.maxHp}`;
}

function playerAttack(type) {
    if (titan.hp <= 0 || assassin.hp <= 0) return;

    let finalDmg = 0;
    let dodgeBonus = 0;

    if (type === 'quick') {
        finalDmg = 25 + Math.random() * 10;
        dodgeBonus = 0.25; 
        print("⚡ <b>Quick Strike!</b> Agility increased.", "log-evade");
    } else if (type === 'heavy') {
        finalDmg = 60 + Math.random() * 20;
        dodgeBonus = -0.5;
        print("🔨 <b>Heavy Slam!</b> Brutal force used!", "log-heavy");
    } else if (type === 'heal') {
        let heal = 30;
        assassin.hp = Math.min(assassin.maxHp, assassin.hp + heal);
        print(`✨ <b>Self-Repair!</b> +${heal} HP restored.`, "log-heal");
        updateUI();
    }

    if (type !== 'heal') {
        finalDmg = Math.round(finalDmg);
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

    if (titan.hp > 0) {
        setTimeout(() => {
            if (Math.random() < (0.15 + dodgeBonus)) {
                print("💨 <b>EVADED!</b> Titan's attack missed!", "log-evade");
            } else {
                let tDmg = Math.round(12 + Math.random() * 6);
                assassin.hp -= tDmg;
                print(`🤖 Titan hits you for ${tDmg} damage!`);
            }
            
            if (titan.hp < 100 && titan.hp > 0) {
                titan.hp += medic.healPower;
                print(`💉 Medic healed Titan for +${medic.healPower} HP!`, "log-heal");
            }
            updateUI();
            if (assassin.hp <= 0) print("💀 <b>GAME OVER.</b> System failure.", "log-crit");
            print("----------------------------", "log-system");
        }, 600);
    } else {
        print("🏆 <b>VICTORY!</b> System breached!", "log-heal");
    }
}