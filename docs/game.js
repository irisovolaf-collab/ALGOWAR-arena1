function playerAttack(type) {
    if (titan.hp <= 0 || assassin.hp <= 0) return;

    let finalDmg = 0;
    let dodgeBonus = 0;

    if (type === 'quick') {
        finalDmg = 25 + Math.random() * 10;
        dodgeBonus = 0.2; // +20% chance to dodge
        print("⚡ <b>Quick Strike!</b> You are more agile now.");
    } else if (type === 'heavy') {
        finalDmg = 60 + Math.random() * 20;
        dodgeBonus = -0.5; // Impossible to dodge
        print("🔨 <b>Heavy Slam!</b> Huge damage, but you are vulnerable!");
    } else if (type === 'heal') {
        let heal = 30;
        assassin.hp = Math.min(assassin.maxHp, assassin.hp + heal);
        print(`✨ <b>Self-Repair!</b> Recovered ${heal} HP.`);
        updateUI();
        // After healing, Titan still attacks!
    }

    if (type !== 'heal') {
        finalDmg = Math.round(finalDmg);
        titan.hp -= finalDmg;
        print(`⚔️ Dealt ${finalDmg} damage to Titan.`);
    }

    updateUI();

    // Enemy Turn
    if (titan.hp > 0) {
        setTimeout(() => {
            let dodgeChance = 0.15 + dodgeBonus;
            if (Math.random() < dodgeChance) {
                print("💨 <b>EVADED!</b> Titan missed!");
            } else {
                let tDmg = Math.round(12 + Math.random() * 6);
                assassin.hp -= tDmg;
                print(`🤖 Titan hits you for ${tDmg} damage!`);
            }
            
            // Medic logic
            if (titan.hp < 100 && titan.hp > 0) {
                titan.hp += medic.healPower;
                print(`💉 Medic healed Titan!`);
            }
            updateUI();
        }, 600);
    } else {
        print("🏆 <b>VICTORY!</b>");
    }
}