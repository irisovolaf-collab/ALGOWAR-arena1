const logElement = document.getElementById('log');
const titan = { name: "Code-Titan", hp: 200, maxHp: 200, atk: 15, hasShield: true };
const assassin = { name: "Script-Assassin", hp: 80, maxHp: 80, atk: 40 };
const medic = { name: "Bit-Medic", healPower: 25 };

function updateUI() {
    const titanPct = (titan.hp / titan.maxHp) * 100;
    document.getElementById('titan-hp-bar').style.width = Math.max(0, titanPct) + "%";
    document.getElementById('titan-hp-text').innerText = `${Math.round(titan.hp)}/${titan.maxHp}`;

    const assassinPct = (assassin.hp / assassin.maxHp) * 100;
    document.getElementById('assassin-hp-bar').style.width = Math.max(0, assassinPct) + "%";
    document.getElementById('assassin-hp-text').innerText = `${Math.round(assassin.hp)}/${assassin.maxHp}`;
}

function print(text) {
    logElement.innerHTML += `<p>${text}</p>`;
    logElement.scrollTop = logElement.scrollHeight;
}

function playerAttack() {
    if (titan.hp <= 0 || assassin.hp <= 0) return;

    // Player action
    let dmg = assassin.atk;
    if (titan.hasShield) {
        dmg *= 0.5;
        titan.hasShield = false;
        print("🛡️ Titan's Shield absorbed 50% damage!");
    }
    titan.hp -= dmg;
    print(`⚔️ You dealt ${dmg} damage to Titan!`);
    updateUI();

    // Enemy response
    if (titan.hp > 0) {
        setTimeout(() => {
            assassin.hp -= titan.atk;
            print(`🤖 Titan hits back for ${titan.atk} damage!`);
            
            if (titan.hp < 100) {
                titan.hp += medic.healPower;
                print(`💉 Medic healed Titan for ${medic.healPower} HP!`);
            }
            updateUI();
        }, 500);
    } else {
        print("🏆 <b>VICTORY! SYSTEM BREACHED!</b>");
    }
}