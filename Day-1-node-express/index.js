const { addEntry, listEntries, editEntry, deleteEntry } = require("./todoManager.js");

//*========PROCESS=====BUILT IN OBJ // NODE JS ==== INFORMATION ABOUT CURRENT PROCESS
// process.argv[0] -> path to node
// process.argv[1] -> path to this file
// process.argv[2] -> the command (add / list / edit / delete)
// process.argv[3] -> first argument after the command
// process.argv[4] -> second argument after the command (used in edit)

const command = process.argv[2];

if (command === "add") {
  const title = process.argv[3];
  addEntry(title);
}

if (command === "list") {
  listEntries();
}

if (command === "edit") {
  const id = process.argv[3];
  const newTitle = process.argv[4];
  editEntry(id, newTitle);
}

if (command === "delete") {
  const id = process.argv[3];
  deleteEntry(id);
}
