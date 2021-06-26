const express = require('express');
const app = express();
const config = require('./config');
const Employee = require('./models/Employee');
const Department = require('./models/Department');
const port = 5000;

app.use(express.urlencoded({extended: false}));

//Test our database conncetion
config.authenticate().then(function(){
    console.log('Database connected');
}).catch(function(err){
    console.log(err);
});

//Retrieve all employees
app.get('/', function(req, res){
    //Select * from employee
    Employee.findAll().then(function(result){
        res.send(result);
    }).catch(function(err){
        res.status(400).send(err);
    });
});

//Filter employees base on their gender and/or department_id  display (name, gender, department_id)
app.get('/filter', function(req, res){
    let data = {
        where: {},
        attributes: ['name', 'gender', 'department_id']
    }
    if (req.query.gender) {
        data.where.gender = req.query.gender;
    }

    if (req.query.department_id) {
        data.where.department_id = req.query.department_id;
    }
    
    //Selecet name, gender, department_id from employees Where gender='' AND department_id=''
    Employee.findAll(data).then(function(result){
        res.send(result);
    }).catch(function(err){
        res.status(400).send(err);
    });
});

//Get employee by ID
app.get('/id/:id', function(req, res){
    let id = req.params.id;

    //Select employee based on id
    Employee.findByPk(id).then(function(result){
        res.send(result);
    }).catch(function(err){
        res.status(400).send(err);
    });
});

//Add a new employee
app.post('/add_employee', function(req, res){
    let data = {
        id: req.body.id,
        name: req.body.name,
        gender: req.body.gender,
        salary: req.body.salary,
        department_id: req.body.department_id
    };

    Employee.create(data).then(function(result){
        res.redirect('/');
    }).catch(function(err){
        res.status(400).send(err);
    });
});

//Update
app.patch('/update_employee/:id', function(req, res){
    let id = req.params.id;

    //Find the employee that corresponds to the id on the URL
    Employee.findByPk(id).then(function(result){
        console.log(result);

        result.name = req.body.name;
        result.gender = req.body.gender;
        result.salary = req.body.salary;
        result.department_id = req.body.department_id;
        
        //Save update to DB
        result.save().then(function(){
            res.redirect('/');
        }).catch(function(err){
            res.status(400).send(err);
        });

    }).catch(function(err){
        res.status(400).send(err);
    });
});


app.delete('/delete_employee/:id', function(req, res){
    let id = req.params.id;

    //Find employee based on id
    Employee.findByPk(id).then(function(result){

        //Delete record from DB
        result.destroy().then(function(){
            res.redirect('/');
        }).catch(function(err){
            res.status(400).send(err);
        });

    }).catch(function(err){
        res.status(400).send(err);
    });
});            


app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`)
});