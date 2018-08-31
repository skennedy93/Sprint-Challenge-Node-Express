const express = require('express');
const server = express();
const dbProject = require('./data/helpers/projectModel.js');
const dbAction = require('./data/helpers/actionModel.js');

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Node-Express');
} );

 server.get('/projects', (req, res) => {
    dbProject.get()
    .then(projects => {
        res.status(200).json(projects);
    })
    .catch(err => {
        console.error('error', err);
         res.status(500).json({ error: 'The projects could not be retrieved.' });
    })
})

server.get('/projects/:id', (req, res) => {
    dbProject.get(req.params.id)
    .then(project => {
        if (!project) {
            res.status(404).json({ message: 'The project with that ID does not exist.' });
            return;
        }
        res.status(200).json(project);
    })
    .catch(err => {
        console.error('error', err);
        res.status(500).json({ error: 'The project could not be retrieved.'})
    })
});

server.post('/projects', (req, res) => {
    const { name, description, completed } = req.body;
    if (!name || !description) {
        res.status(400).json({ errorMessage: 'Name and description required' });
        return;
    }
    dbProject.insert({
        name,
        description,
        completed
    })
    .then(response => {
        res.status(201).json(req.body);
    })
    .catch(error => {
        console.error('error', err);
        res.status(500).json({ error: 'Could not save project' });
        return;
    })
});

server.delete('/projects/:id', (req, res) => {
    const { id } = req.params;
    dbProject.remove(id)
        .then(count => {
            if (count) {
                res.status(202).json({ message: 'Project has been deleted'}).end();
            } else {
                res.status(404).json({ message: 'The project with that ID does not exist.' })
            }
        })
        .catch(error => res.status(500).json({ error: 'The project could not be deleted' }));
});

server.put('/projects/:id', (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        res.status(400).json({ errorMessage: 'Name and description required' });
        return;
    }
    dbProject.update(req.params.id, req.body)
        .then(project => {
            if (project) {
                res.status(200).json(req.body)
            } else {
                res.status(404).json({ message: 'The project with that ID does not exist.' })
            }
            
        })
        .catch(err => res.status(500).json({ message: 'The project could not be updated.' }));
});

 server.listen(3000, () => console.log('/n== API on port 3000 ==/n') );