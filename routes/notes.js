const notes = require('express').Router();
const uuid = require('../helpers/uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');
const { response } = require('../../UTOR-VIRT-FSF-FT-07-2023-U-LOLC/11-Express/01-Activities/28-Stu_Mini-Project/Main/routes');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
});

// GET Route for a specific notes
notes.get('/:id', (req, res) => {
  const titleId = req.params.id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((title) => title.id === titleId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});

// DELETE Route for a specific notes
notes.delete('/:id', (req, res) => {
  const titleId = req.params.id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((title) => title.id !== titleId);

      // Save that array to the filesystem
      writeToFile('./db/notes.json', result);

      // Respond to the DELETE request
      res.json(`Item ${titleId} has been deleted 🗑️`);
    });
});

// POST Route for a new UX/UI notes
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text} = req.body;

  if (req.body) {
    const newnotes = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newnotes, './db/notes.json' ).then((data)=>response.json(data));
  
  }
});


module.exports = notes;
