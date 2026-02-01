function playerAttack() {
    if (titan.hp <= 0 || assassin.hp <= 0) return;

    // --- PLAYER TURN ---
    let isCrit = Math.random() < 0.2; // 20% chance
    let baseDmg = 35 + Math.random() * 10; // Random damage between 35 and 45
    let finalDmg = isCrit ? baseDmg * 2 : baseDmg;
    finalDmg = Math.round(finalDmg);

    if (titan.hasShield) {
        finalDmg *= 0.5;
        titan.hasShield = false;
        print("🛡️ Titan's Shield blocked 50% damage!");
    }

    titan.hp -= finalDmg;
    print(isCrit ? `🔥 <b>CRITICAL HIT!</b> You dealt ${finalDmg} damage!` : `⚔️ You dealt ${finalDmg} damage.`);
    updateUI();

    // --- ENEMY TURN ---
    if (titan.hp > 0) {
        setTimeout(() => {
            let isDodge = Math.random() < 0.15; // 15% chance to dodge
            
            if (isDodge) {
                print("💨 <b>MISS!</b> You dodged Titan's attack!");
            } else {
                let titanDmg = Math.round(12 + Math.random() * 6); // 12-18 damage
                assassin.hp -= titanDmg;
                print(`🤖 Titan hits you for ${titanDmg} damage!`);
            }

            // Medic Check
            if (titan.hp < 100) {
                titan.hp += medic.healPower;
                print(`💉 Medic healed Titan for ${medic.healPower} HP!`);
            }
            updateUI();
            
            if (assassin.hp <= 0) print("💀 <b>GAME OVER. YOU DIED.</b>");
        }, 500);
    } else {
        print("🏆 <b>VICTORY! SYSTEM BREACHED!</b>");
    }
}