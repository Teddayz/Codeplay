const User = require('../models/user');

const expTable = [
    20, 23, 26, 30, 35, 40, 46, 53, 61, 70, 81, 93, 107, 123, 142, 163, 187, 215,
    248, 285, 327, 376, 433, 498, 573, 658, 757, 871, 1001, 1152, 1324, 1523,
    1751, 2014, 2316, 2664, 3063, 3522, 4051, 4658, 5357, 6161, 7085, 8148, 9370,
    10775, 12392, 14250, 16388, 18846, 21673, 24924, 28663, 32962, 37906, 43592,
    50131, 57651, 66299, 76243, 87680, 100832, 115957, 133350, 153353, 176356,
    202809, 233230, 268215, 308447, 354714, 407922, 469110, 539476, 620398,
    713457, 820476, 943547, 1085079, 1247841, 1435018, 1650270, 1897811, 2182482,
    2509855, 2886333, 3319283, 3817175, 4389752, 5048214, 5805447, 6676263,
    7677703, 8829358, 10153762, 11676827, 13428351, 15442603, 17758994, 20422843
  ];

const updateUserExp = async (userId, expGained) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.level == 100) {
            user.exp += expGained;
            user.totalExp += expGained;
            let levelUp = false;
            await user.save();
            return { exp: user.exp, totalExp: user.totalExp, level: user.level, levelUp };
        }
        user.exp += expGained;
        user.totalExp += expGained;

        let levelUp = false;
        while (user.level < expTable.length && user.exp >= expTable[user.level - 1]) {
            user.exp -= expTable[user.level - 1];
            user.level++;
            levelUp = true;
        }
        await user.save();
        return { exp: user.exp, totalExp: user.totalExp, level: user.level, levelUp };
    } catch(err) {
        throw err;
    }
}

module.exports = {
    updateUserExp
}