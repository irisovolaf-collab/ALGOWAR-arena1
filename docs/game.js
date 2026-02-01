const logElement = document.getElementById('log');

// Character Stats
const titan = { name: "Code-Titan", hp: 200, maxHp: 200, atk: 15, hasShield: true };
const assassin = { name: "Script-Assassin", hp: 80, maxHp: 80, atk: 40 };
const medic = { name: "Bit-Medic", healPower: 25 };

// This function updates the health bars on your screen
function updateUI() {
    // Update Titan's bar and text
    const titanPct = (titan.hp / titan.maxHp) * 100;
    document.getElementById('titan-hp-bar').style.width = Math.max(0, titanPct) + "%";
    document.getElementById('titan-hp-text').innerText = `${Math.round(Math.max(0, titan.hp))}/${titan.maxHp}`;

    // Update Assassin's bar and text
    const assassinPct = (assassin.hp / assassin.maxHp) * 100;
    document.getElementById('assassin-hp-bar').style.width = Math.max(0, assassinPct) + "%";
    document.getElementById('assassin-hp-text').innerText = `${Math.round(Math.max(0, assassin.hp))}/${assassin.maxHp}`;
}

function print(text) {
    logElement.innerHTML += `<p>${text}</p>`;
    logElement.scrollTop = logElement.scrollHeight;
}

function playerAttack() {
    if (titan.hp <= 0 || assassin.hp <= 0) return;

    // --- YOUR TURN ---
    let isCrit = Math.random() < 0.2; 
    let baseDmg = 35 + Math.random() * 10; 
    let finalDmg = Math.round(isCrit ? baseDmg * 2 : baseDmg);

    if (titan.hasShield) {
        finalDmg *= 0.5;
        titan.hasShield = false;
        print("🛡️ <b>Shield</b> absorbed 50% damage!");
    }

    titan.hp -= finalDmg;
    print(isCrit ? `🔥 <b>CRITICAL!</b> You dealt ${finalDmg} damage!` : `⚔️ You dealt ${finalDmg} damage.`);
    
    updateUI(); // Visual update

    // --- ENEMY TURN ---
    if (titan.hp > 0) {
        setTimeout(() => {
            let isDodge = Math.random() < 0.15; 
            
            if (isDodge) {
                print("💨 <b>EVADE!</b> You dodged the attack!");
            } else {
                let titanDmg = Math.round(12 + Math.random() * 6);
                assassin.hp -= titanDmg;
                print(`🤖 <b>${titan.name}</b> hits back for ${titanDmg} damage!`);
            }

            // Medic logic
            if (titan.hp < 100 && titan.hp > 0) {
                titan.hp += medic.healPower;
                if (titan.hp > titan.maxHp) titan.hp = titan.maxHp;
                print(`💉 <b>${medic.name}</b> used Repair! +${medic.healPower} HP to Titan.`);
            }

            updateUI(); // Visual update
            
            if (assassin.hp <= 0) {
                print("💀 <b>DEFEATED!</b> System failure...");
            }
        }, 500);
    } else {
        print("🏆 <b>VICTORY!</b> System breached successfully!");
        updateUI();
    }
}