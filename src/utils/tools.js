const callKev = require("./callKev");
var contract = require("../schemas/contract");
var kevID = require("../schemas/kevID");
const { alias } = require("../schemas/contribution");
const User = require("../schemas/user");
var allKevIDs = [];

async function fetchGroup(interaction) {
  var groupSchema = require("../schemas/group");
  var userSchema = require("../schemas/user");

  var channelID;
  if (interaction.channel.isThread()) channelID = interaction.channel.parentId;
  else channelID = interaction.channelId;

  if (
    [
      "734424049085710366",
      "850486132713455616",
      "830024046867513414",
      "1117142969389166792",
    ].includes(channelID)
  ) {
    let user = await userSchema.findOne({ ID: interaction.user.id });
    if (!user || user.group == "none") return null;

    return await groupSchema.findOne({ name: user.group });
  } else {
    var groups = await groupSchema.find();
    for (var group of groups) {
      if (JSON.stringify(group).includes(channelID)) {
        return group;
      }
    }
    return null;
  }
}

async function updateUsersWithProgress(userData, loadingMessage) {
  try {
    let completedUsers = 0; // Initialize the completed users count

    const bulkOperations = []; // Array to store bulk operations

    for (const userObj of userData) {
      const filter = { ID: userObj.ID };

      // Update the user document with the new data
      const update = {
        $set: {
          group: userObj.group,
          ID: userObj.ID,
          IGN: userObj.IGN,
          discordName: userObj.discordName,
          displayName: userObj.displayName,
          farmerRole: userObj.farmerRole,
          EB: userObj.EB,
          SE: userObj.SE,
          PE: userObj.PE,
          grade: userObj.grade,
          active: userObj.active,
          statusUntil: userObj.statusUntil,
          willPlay: userObj.willPlay,
        },
      };

      const operation = { updateOne: { filter, update, upsert: true } };
      bulkOperations.push(operation);

      completedUsers++; // Increment the completed users count

      // Update the loading bar and progress at a specified interval
      if (completedUsers % 100 === 0) {
        const progress = calculateProgress(userData.length, completedUsers);
        const loadingBar = generateLoadingBar(progress);
        await loadingMessage.edit(`${loadingBar}`);
      }
    }

    // Execute the bulk operations
    if (bulkOperations.length > 0) {
      await User.bulkWrite(bulkOperations);
    }

    await loadingMessage.edit(`All user data successfully updated!`);
  } catch (error) {
    console.error("Failed to update user data:", error);
  }
}

// async function updateUsersWithProgress(userData, loadingMessage) {
//   try {
//     let completedUsers = 0; // Initialize the completed users count

//     for (const userObj of userData) {
//       // Find the user document by ID
//       const user = await User.findOne({ ID: userObj.ID });

//       if (user) {
//         // Update the existing user document with the new data
//         user.group = userObj.group;
//         user.ID = userObj.ID;
//         user.IGN = userObj.IGN;
//         user.discordName = userObj.discordName;
//         user.displayName = userObj.displayName;
//         user.farmerRole = userObj.farmerRole;
//         user.EB = userObj.EB;
//         user.SE = userObj.SE;
//         user.PE = userObj.PE;
//         user.grade = userObj.grade;
//         user.active = userObj.active;
//         user.statusUntil = userObj.statusUntil;
//         user.willPlay = userObj.willPlay;

//         await user.save();
//         console.log(`Updated user: ${user.ID}`);
//       } else {
//         // Create a new user document if it doesn't exist
//         const newUser = new User(userObj);
//         await newUser.save();
//         console.log(`Created new user: ${newUser.ID}`);
//       }

//       completedUsers++; // Increment the completed users count

//       // Update the loading bar based on progress
//       const progress = calculateProgress(userData.length, completedUsers);
//       const loadingBar = generateLoadingBar(progress);
//       await loadingMessage.edit(`${loadingBar}`);

//       // console.log("User data updated successfully in MongoDB");
//     }
//   } catch (error) {
//     console.error("Failed to update user data:", error);
//   }
// }

function generateLoadingBar(progress) {
  const quarterNotStarted = ":rooster:";
  const quarterInProgress = ":fire:";
  const quarterCompleted = ":poultry_leg:";

  const totalQuarters = 4;
  const quarterProgress = Math.floor(progress * totalQuarters);

  let loadingBar = "";

  // Add completed quarters
  for (let i = 0; i < quarterProgress; i++) {
    loadingBar += quarterCompleted + " ";
  }

  // Add in-progress quarter
  if (quarterProgress < totalQuarters) {
    loadingBar += quarterInProgress + " ";
  }

  // Add remaining quarters
  const remainingQuarters = totalQuarters - quarterProgress - 1;
  if (remainingQuarters > 0) {
    loadingBar += quarterNotStarted.repeat(remainingQuarters);
  }

  return loadingBar;
}

function calculateProgress(totalUsers, completedUsers) {
  // Calculate the progress based on completed users
  if (totalUsers === 0) {
    return 0; // No progress if there are no users
  }

  return completedUsers / totalUsers;
}

async function isLeader(userID, group) {
  var groupSchema = require("../schemas/group");
  var groups;
  if (group)
    groups = await groupSchema
      .find({ name: group.name, leaderIDs: userID })
      .exec();
  else groups = await groupSchema.find({ leaderIDs: userID }).exec();
  return groups.length;
}

async function calculateEB(backup) {
  var pe = backup.game.eggsOfProphecy;
  var se = backup.game.soulEggsD;
  var pe_bonus = 0,
    se_bonus = 0;
  for (const item in backup.game.epicResearch) {
    if (backup.game.epicResearch[item].id == "prophecy_bonus") {
      pe_bonus = backup.game.epicResearch[item].level * 0.01;
    }
    if (backup.game.epicResearch[item].id == "soul_eggs") {
      se_bonus = backup.game.epicResearch[item].level;
    }
  }
  return se * ((10 + se_bonus) * (1.05 + pe_bonus) ** pe);
}

async function EBtoRole(EB) {
  let power = -1;
  while (EB >= 1) {
    EB /= 10;
    power++;
  }
  var roles = {
    0: "Farmer I",
    1: "Farmer I",
    2: "Farmer I",
    3: "Farmer II",
    4: "Farmer III",
    5: "Kilofarmer I",
    6: "Kilofarmer II",
    7: "Kilofarmer III",
    8: "Megafarmer I",
    9: "Megafarmer II",
    10: "Megafarmer III",
    11: "Gigafarmer I",
    12: "Gigafarmer II",
    13: "Gigafarmer III",
    14: "Terafarmer I",
    15: "Terafarmer II",
    16: "Terafarmer III",
    17: "Petafarmer I",
    18: "Petafarmer II",
    19: "Petafarmer III",
    20: "Exafarmer I",
    21: "Exafarmer II",
    22: "Exafarmer III",
    23: "Zettafarmer I",
    24: "Zettafarmer II",
    25: "Zettafarmer III",
    26: "Yottafarmer I",
    27: "Yottafarmer II",
    28: "Yottafarmer III",
    29: "Xennafarmer I",
    30: "Xennafarmer II",
    31: "Xennafarmer III",
    32: "Weccafarmer I",
    33: "Weccafarmer II",
    34: "Weccafarmer III",
    35: "Vendafarmer I",
    36: "Vendafarmer II",
    37: "Vendafarmer III",
  };
  return roles[power];
}

function EBtoEBWithLetter(EB, strLen) {
  var letters = {
    0: "",
    3: "k",
    6: "M",
    9: "B",
    12: "T",
    15: "q",
    18: "Q",
    21: "s",
    24: "S",
    27: "o",
    30: "N",
    33: "d",
    36: "U",
    39: "D",
    42: "Td",
  };

  if (EB < 0) return "-" + EBtoEBWithLetter(-EB, strLen);

  if (EB < 1000) return EB.toFixed(3);

  let power = 0;
  while (EB >= 10) {
    EB /= 10;
    power++;
  }
  while (!letters[power]) {
    EB *= 10;
    power--;
  }

  if (strLen) return String(EB.toFixed(3)).slice(0, strLen) + letters[power];
  else return String(EB.toFixed(3)) + letters[power];
}

async function convertGrade(grade) {
  grade_nums = { 0: "UNKNOWN", 1: "c", 2: "b", 3: "a", 4: "aa", 5: "aaa" };
  return grade_nums[grade];
}

async function timeDifference(timestamp) {
  var units = {
    y: 365 * 30 * 24 * 60 * 60 * 1000,
    mo: 30 * 24 * 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000,
  };
  var keys = Object.keys(units);
  diff = Date.now() - timestamp;
  for (const unit in units) {
    if (diff > units[unit]) {
      if (unit == "s") return String(Math.floor(diff / units[unit]) + unit);
      else
        return String(
          Math.floor(diff / units[unit]) +
            unit +
            Math.floor(
              (diff % units[unit]) / units[keys[keys.indexOf(unit) + 1]]
            ) +
            keys[keys.indexOf(unit) + 1]
        );
    }
  }
}

// async function addNewContract() {
//     var addedNew = []
//     const periodicals = await callKev.GetPeriodicalsRequest()
//     const ctxs = periodicals.contracts.contracts.filter(ctx => ctx.identifier != 'first-contract')

//     var kevIDs = await kevID.findOne({ id: 0 }).exec()
//     if (!kevIDs) { await (new kevID({ id: 0, kevID: [] })).save() }
//     else {
//         await setAutocompleteKevIDs(kevIDs.withAliases)
//     }

//     for (let i = 0; i < ctxs.length; i++) {
//         var ctx = ctxs[i]

//         if (!kevIDs.kevID.includes(ctx.identifier)) {
//             await kevID.updateOne({ id: 0 }, { $push: { kevID: ctx.identifier, withAliases: { kevID: ctx.identifier, aliases: await generateAutomaticAliases(ctx.identifier, ctx.name) } } })
//         }

//         if (!(await contract.find({ startTime: ctx.startTime }).exec()).length) {
//             var hasPE = false
//             ctx.gradeSpecs[0].goals.forEach(goal => {
//                 if (goal.rewardType == 4) hasPE = true
//             })

//             let newctx = new contract({
//                 identifier: ctx.identifier,
//                 id: 1,
//                 egg: ctx.egg,
//                 coopAllowed: ctx.coopAllowed,
//                 maxCoopSize: ctx.maxCoopSize,
//                 expirationTime: ctx.expirationTime,
//                 lengthSeconds: ctx.lengthSeconds,
//                 name: ctx.name,
//                 description: ctx.description,
//                 minutesPerToken: ctx.minutesPerToken,
//                 startTime: ctx.startTime,
//                 leggacy: ctx.leggacy,
//                 ccOnly: ctx.ccOnly,
//                 seasonId: ctx.seasonId ? ctx.seasonId : "none",
//                 hasPE: hasPE,
//                 gradeSpecs: ctx.gradeSpecs,
//                 aliases: await generateAutomaticAliases(ctx.identifier, ctx.name)
//             })
//             await newctx.save()
//             addedNew.push(ctx)
//         }
//     }
//     return addedNew
// }

// async function generateAutomaticAliases(kevID, identifier) {
//     let aliases = []

//     let args = kevID.toLowerCase().replace(/[^a-z-]/gi, '').split('-').filter(arg => arg), acronym = ''
//     args.forEach(arg => {
//         if (!Number(arg)) {
//             acronym += arg[0]
//             if (arg.length >= 3) {
//                 aliases.push(arg);
//             }
//         }
//     })
//     if (acronym.length > 2) {
//         aliases.push(acronym.substring(0, 2));
//     } else if (acronym.length == 1) {
//         aliases.push(args[0].substring(0, 3))
//     } else {
//         aliases.push(acronym)
//     }

//     let nameArgs = identifier.toLowerCase().replaceAll('-', '').replace(/[^a-z ]/gi, '').split(' ').filter(arg => arg), nameAcronym = ''
//     nameArgs.forEach(arg => {
//         if (!Number(arg)) {
//             nameAcronym += arg[0];
//             if (arg.length >= 3 && !aliases.includes(arg)) {
//                 aliases.push(arg);
//             }
//         }
//     })
//     if (nameAcronym.length > 2 && !aliases.includes(nameAcronym.substring(0, 2))) {
//         aliases.push(nameAcronym.substring(0, 2));
//         if (!aliases.includes(nameAcronym)) {
//             aliases.push(nameAcronym)
//         }
//     }
//     else if (nameAcronym.length == 1 && !aliases.includes(nameArgs[0].substring(0, 3))) {
//         aliases.push(nameArgs[0].substring(0, 3));
//     } else if (!aliases.includes(nameAcronym) && nameAcronym.length != 1) {
//         aliases.push(nameAcronym)
//     }

//     return aliases
// }

async function eggToEmoji(egg) {
  var eggs = {
    1: "<:egg_edible:455467571613925418>",
    2: "<:egg_superfood:455468082635210752>",
    3: "<:egg_medical:455468241582817299>",
    4: "<:egg_rocketfuel:455468270661795850>",
    5: "<:egg_supermaterial:455468299480989696>",
    6: "<:egg_fusion:455468334859681803>",
    7: "<:egg_quantum:455468361099247617>",
    8: "<:egg_immortality:455468394892886016>",
    9: "<:egg_tachyon:455468421048696843>",
    10: "<:egg_graviton:455468444070969369>",
    11: "<:egg_dilithium:455468464639967242>",
    12: "<:egg_prodigy:455468487641661461>",
    13: "<:egg_terraform:455468509099458561>",
    14: "<:egg_antimatter:455468542171807744>",
    15: "<:egg_darkmatter:455468555421483010>",
    16: "<:egg_ai:455468564590100490>",
    17: "<:egg_nebula:455468583426981908>",
    18: "<:egg_universe:567345439381389312>",
    19: "<:egg_enlightenment:844620906248929341>",
    100: "<:egg_chocolate:455470627663380480>",
    101: "<:egg_easter:455470644646379520>",
    102: "<:egg_waterballoon:460976773430116362>",
    103: "<:egg_firework:460976588893454337>",
    104: "<:egg_pumpkin:503686019896573962>",
    1000: "<:unknown:455471603384582165>",
  };
  return eggs[egg] || "none";
}

// async function timestampToContractDay(timestamp) { //0 = Monday, 1 = Wednesday, 2 = Friday
//     return ((new Date(timestamp * 1000)).getDay() - 1) / 2
// }

// async function getAutocompleteKevIDs() { return allKevIDs }
// async function setAutocompleteKevIDs(kevIDs) { allKevIDs = kevIDs }

// async function hasUserCompletedContract(EID, kevID) {
//     var backup = null
//     while(!backup){
//         try{backup = await callKev.EggIncFirstContactRequest(EID)}
//         catch(err) {console.log("BACKUP FETCH ERR: "+EID)}
//     }

//     var grade = backup.contracts.lastCpi ? await convertGrade(backup.contracts.lastCpi.grade) : "UNKNOWN"
//     var hasPE = false, indexPE = 0

//     var ctx = backup.contracts.archive.filter(ctx => ctx.contract.identifier == kevID)[0]
//     if(!ctx) return grade
//     var goals = []
//     if (ctx.contract.gradeSpecs.length && ctx.grade) {
//         goals = ctx.contract.gradeSpecs.filter(spec => spec.grade == ctx.grade)[0].goals
//     } else {
//         goals = ctx.contract.goalSets[ctx.league].goals
//     }

//     for(let i=0;i<goals.length;i++){
//         if (goals[i].rewardType == 4){
//             hasPE = true; indexPE = i + 1
//         }
//     }

//     return { identifier: kevID, startTime: ctx.contract.startTime, hasPE: hasPE, collectedPE: hasPE && ctx.numGoalsAchieved >= indexPE, achievedAllGoals: ctx.numGoalsAchieved == goals.length, grade: grade }

// }

module.exports = {
  updateUsersWithProgress,
  EBtoRole,
  EBtoEBWithLetter,
  convertGrade,
  timeDifference,
  eggToEmoji,
  //   fetchGroup,
  isLeader,
  calculateEB,
  //   addNewContract,
  //   generateAutomaticAliases,
  //   timestampToContractDay,
  //   getAutocompleteKevIDs,
  //   setAutocompleteKevIDs,
  //   hasUserCompletedContract,
};
