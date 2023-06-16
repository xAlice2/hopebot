const fs = require("fs");

let majMemberlist;

function loadMajMemberlist() {
  if (!majMemberlist) {
    const data = fs.readFileSync("src/data/maj.json", "utf8");
    majMemberlist = JSON.parse(data);

    console.log("Loaded Majeggstics Member list");
    console.log(majMemberlist)
  }
}

// loadMajMemberlist();

module.exports = {
    loadMajMemberlist,
  };