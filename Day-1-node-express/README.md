# Day 1: Node.js CLI Todo Manager

A command-line interface (CLI) Todo application built using core **Node.js** and the built-in `fs` (File System) module. This project demonstrates handling CLI arguments via `process.argv`, JSON file persistence, and modular code organization.

---

## 📌 Features

- **CLI-driven**: Parse and execute commands directly from the terminal.
- **File Persistence**: Stores all todos in a local `data.json` file.
- **Auto-generated Database**: Creates `data.json` automatically if it does not exist.
- **Auto-incrementing IDs**: Automatically computes incremental unique IDs for every new task.
- **Modular Code**: Logic separated between CLI argument parsing (`index.js`) and business/CRUD logic (`todoManager.js`).

---

## 📂 Project Structure

```text
Day-1-node-express/
├── data.json         # JSON database storing todos
├── index.js          # CLI entry point (parses process.argv and calls functions)
├── todoManager.js    # Core CRUD helper functions & file system operations
└── README.md         # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)

### Run without external dependencies

This project relies purely on Node.js built-in modules (`fs`). No `npm install` is required.

---

## 💻 Available Commands & Usage

All commands are executed using `node index.js <command> [arguments]`:

### 1. Add a Todo
Adds a new entry with an auto-incremented ID and saves it to `data.json`.
```bash
node index.js add "Learn Node.js Basics"
```
*Output:*
```text
Added entry #1: "Learn Node.js Basics"
```

### 2. List All Todos
Displays all stored todos in the format `ID - Title`.
```bash
node index.js list
```
*Output:*
```text
1 - Learn Node.js Basics
2 - Build a CLI App
```

### 3. Edit a Todo
Updates the title of an existing todo by its ID.
```bash
node index.js edit <id> "<new title>"
```
*Example:*
```bash
node index.js edit 1 "Master Node.js Basics"
```
*Output:*
```text
Entry #1 updated to: "Master Node.js Basics"
```

### 4. Delete a Todo
Removes a todo from `data.json` by its ID.
```bash
node index.js delete <id>
```
*Example:*
```bash
node index.js delete 1
```
*Output:*
```text
Entry #1 deleted
```

---

## ⚙️ How It Works Under the Hood

- **CLI Argument Parsing (`process.argv`)**:
  - `process.argv[2]`: The command (`add`, `list`, `edit`, `delete`)
  - `process.argv[3]`: First argument (e.g., `title` or `id`)
  - `process.argv[4]`: Second argument (e.g., `newTitle` for edit)
- **Synchronous File Operations**: Uses `fs.readFileSync` and `fs.writeFileSync` to read and update `data.json`.
