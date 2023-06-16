const fs = require("fs");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

let majMemberlist;

/**
 *
 * This function loads the userdata from JSON to the majMemberlist variable.
 *
 *************************************************/
function loadMajMemberlist() {
  if (!majMemberlist) {
    const data = fs.readFileSync("src/data/maj.json", JSON.stringify(data, null, 2));
    majMemberlist = JSON.parse(data);

    console.log("Loaded Majeggstics Member list");
    console.log(majMemberlist)
  }
}

/**
 *
 * Auto updates the Majeggstics Member list from the API endpoint at startup
 *
 *****************************/

// async function loadMajMemberlist() {
//   if (!majMemberlist) {
//     const data = fs.readFileSync("src/data/maj.json", JSON.stringify(data, null, 2));
//     majMemberlist = JSON.parse(data);

//     console.log("Loaded Majeggstics Member list");
//     console.log(majMemberlist);
//   }

//   try {
//     const response = await fetch(
//       "https://eiapi-production.up.railway.app/allMaj"
//     );
//     const newData = await response.json();

//     // Update the member list with the retrieved information
//     majMemberlist = newData;

//     console.log("Updated Majeggstics Member list!");
//     // console.log(majMemberlist);
//   } catch (error) {
//     console.error("Failed to update Majeggstics Member list:", error);
//   }
// }

// loadMajMemberlist();

module.exports = {
  loadMajMemberlist,
};
