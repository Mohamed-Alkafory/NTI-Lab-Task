const fs = require("fs");

const DATA_FILE_PATH = "./data.json";

//*------READ------->> reads all todos from the file (creates it first if missing)
function readTodosFromFile() {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    fs.writeFileSync(DATA_FILE_PATH, "[]");
  }
  const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf8");
  return JSON.parse(fileContent);
}

//*------WRITE------->> overwrites the file with the given todos list
function writeTodosToFile(todos) {
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(todos, null, 2));
}

//*------helper------->> calculates the next incremental id
function getNextEntryId(todos) {
  if (todos.length === 0) {
    return 1;
  }
  const highestExistingId = Math.max(...todos.map((todo) => todo.id));
  return highestExistingId + 1;
}

//*------ADD------->> adds a new entry with an incremental id
function addEntry(title) {
  const todos = readTodosFromFile();

  const newEntry = {
    id: getNextEntryId(todos),
    title: title,
  };

  todos.push(newEntry);
  writeTodosToFile(todos);

  console.log(`Added entry #${newEntry.id}: "${newEntry.title}"`);
}

//*------LIST------->> prints all entries
function listEntries() {
  const todos = readTodosFromFile();

  if (todos.length === 0) {
    console.log("No entries yet.");
    return;
  }

  todos.forEach((todo) => {
    console.log(`${todo.id} - ${todo.title}`);
  });
}

//*------EDIT------->> edits the title of the entry with the given id
function editEntry(id, newTitle) {
  const todos = readTodosFromFile();
  const entryToEdit = todos.find((todo) => todo.id === Number(id));

  if (!entryToEdit) {
    console.log(`No entry found with id ${id}`);
    return;
  }

  entryToEdit.title = newTitle;
  writeTodosToFile(todos);

  console.log(`Entry #${entryToEdit.id} updated to: "${entryToEdit.title}"`);
}

//*------DELETE------->> deletes the entry with the given id
function deleteEntry(id) {
  const todos = readTodosFromFile();
  const entryExists = todos.some((todo) => todo.id === Number(id));

  if (!entryExists) {
    console.log(`No entry found with id ${id}`);
    return;
  }

  const remainingTodos = todos.filter((todo) => todo.id !== Number(id));
  writeTodosToFile(remainingTodos);

  console.log(`Entry #${id} deleted`);
}

//export --- require
module.exports = { addEntry, listEntries, editEntry, deleteEntry };
