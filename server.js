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

//starting on actions here

server.get('/projects/:id/actions', (req, res) => {
    dbProject.getProjectActions(req.params.id)
    .then(projectActions => {
        console.log(projectActions.length);
        if (projectActions.length === 0) {
            res.status(404).json({ message: 'The project with that ID does not exist.' });
            return;
        }
        res.status(200).json(projectActions);
    })
    .catch(err => {
        console.error('error', err);
        res.status(500).json({ error: 'The project could not be retrieved.'})
    })
});

server.get('/actions', (req, res) => {
    dbAction.get()
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(err => {
        console.error('error', err);
         res.status(500).json({ error: 'The actions could not be retrieved.' });
    })
});

server.get('/actions/:id', (req, res) => {
    dbAction.get(req.params.id)
    .then(action => {
        if (!action) {
            res.status(404).json({ message: 'The action with that ID does not exist.' });
            return;
        }
        res.status(200).json(action);
    })
    .catch(err => {
        console.error('error', err);
        res.status(500).json({ error: 'The actions could not be retrieved.'})
    })
});

server.delete('/actions/:id', (req, res) => {
    const { id } = req.params;
    dbAction.remove(id)
        .then(count => {
            // console.log(count);
            if (count) {
                res.status(202).json({ message: 'The action has been deleted'}).end();
            } else {
                res.status(404).json({ message: 'The action with that ID does not exist.' })
            }
        })
        .catch(error => res.status(500).json({ error: 'The action could not be deleted' }));
});

server.post('/actions', (req, res) => {
    const { description, notes, completed, project_id } = req.body;
    if (!description || !notes) {
        res.status(400).json({ errorMessage: 'Description and notes required.' });
        return;
    }
    dbAction.insert({
        project_id,
        description,
        notes,
        completed
    })
    .then(response => {
        res.status(201).json(req.body);
    })
    .catch(error => {
        console.error('error', err);
        res.status(500).json({ error: 'Action could not be saved' });
        return;
    })
});
 server.listen(3000, () => console.log('/n== API on port 3000 ==/n') );