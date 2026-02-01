const logElement = document.getElementById('log');

// Characters Stats
const titan = { name: "Code-Titan", hp: 200, maxHp: 200, atk: 15, hasShield: true };
const assassin = { name: "Script-Assassin", hp: 80, maxHp: 80, atk: 40 };
const medic = { name: "Bit-Medic", healPower: 25 };

// FIX: This function now correctly updates the health bars on screen
function updateUI() {
    // Update Titan Bar
    const titanPct = (titan.hp / titan.maxHp) * 100;
    document.getElementById('titan-hp-bar').style.width = Math.max(0, titanPct) + "%";
    document.getElementById('titan-hp-text').innerText = `${Math.round(Math.max(0, titan.hp))}/${titan.maxHp}`;

    // Update Assassin Bar
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

    // --- PLAYER TURN ---
    let isCrit = Math.random() < 0.2; 
    let baseDmg = 35 + Math.random() * 10; 
    let finalDmg = isCrit ? baseDmg * 2 : baseDmg;
    finalDmg = Math.round(finalDmg);

    if (titan.hasShield) {
        finalDmg *= 0.5;
        titan.hasShield = false;
        print("🛡️ <b>Titan's Shield</b> blocked 50% damage!");
    }

    titan.hp -= finalDmg;
    print(isCrit ? `🔥 <b>CRITICAL HIT!</b> You dealt ${finalDmg} damage!` : `⚔️ You dealt ${finalDmg} damage.`);
    
    updateUI(); // Immediate update after your hit

    // --- ENEMY TURN ---
    if (titan.hp > 0) {
        setTimeout(() => {
            let isDodge = Math.random() < 0.15; 
            
            if (isDodge) {
                print("💨 <b>EVADE!</b> You dodged the attack!");
            } else {
                let titanDmg = Math.round(12 + Math.random() * 6);
                assassin.hp -= titanDmg;
                print(`🤖 <b>${titan.name}</b> hits you for ${titanDmg} damage!`);
            }

            // Medic Healing Logic
            if (titan.hp < 100 && titan.hp > 0) {
                titan.hp += medic.healPower;
                if (titan.hp > titan.maxHp) titan.hp = titan.maxHp;
                print(`💉 <b>${medic.name}</b> performed "Code Cleanup"! +${medic.healPower} HP to Titan.`);
            }

            updateUI(); // Update bars after enemy turn
            
            if (assassin.hp <= 0) {
                print("💀 <b>FATAL ERROR:</b> You died. System reboot required.");
            }
            print("----------------------------");
        }, 500);
    } else {
        print("🏆 <b>VICTORY!</b> System breached. You are the new Admin!");
        updateUI();
    }
}