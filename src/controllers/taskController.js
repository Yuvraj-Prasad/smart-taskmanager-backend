import Task from "../models/Task.js";

// Create Task
export const createTask = async (req, res)=>{
    try{
        const {title, description, status} = req.body;

        if(!title || title.trim() === ""){
            return res.status(400).json({ message: "Title is required "});
        }

        const allowedStatus = ["Pending", "In Progress", "Completed"];
        if(status && !allowedStatus.includes(status)){
            return res.status(400).json({ message: "Invalid status value"});
        }

    const task = await Task.create({
        title: title.trim(),
        description,
        status,
        user: req.user._id
    });

    res.status(201).json(task);

    }catch(error){
        res.status(500).json({ message: "Server error"})
    }
}

//Get Task
export const getTask = async (req, res)=>{
    // try{
    //     const tasks = await Task.find({ user: req.user._id});
    // res.json({
    //     tasks
    // });
    // }catch(error){
    //     res.status(500).json({
    //         message: "Server error"
    //     });
    // }

    try{
        const { status, search } = req.query;

    let query = {user: req.user._id};

    if(status){
        query.status = status;
    }
    if(search){
        query.title = {$regex: search, $options: "i"}
    }

    const tasks = await Task.find(query);
    res.json(tasks);
    }catch(error){
        res.status(500).json({ message: "Server error" });
    }
}

//Update Task
export const updateTask = async (req, res) =>{

    try{
        const task = await Task.findById(req.params.id);

    if(!task){
        return res.status(404).json({ message: "Task not found"});
    }

    if(task.user.toString() !== req.user._id.toString()){
        return res.status(401).json({ message: "Not Authorized"});
    }

    const {title, description, status} = req.body;

    const allowedStatus = ["Pending", "In Progress", "Completed"];
    if(status && !allowedStatus.includes(status)){
        return res.status(400).json({ message: "Invalid status value" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    const updatedTask = await task.save();

    res.json(updatedTask);
    }catch(error){
        res.status(500).json({ message: "Server error" });
    }
}

//Delete Task
export const deleteTask = async (req, res)=>{

    try{
        const task = await Task.findById(req.params.id);

    if(!task){
        return res.status(404).json({ message: "Task not found"});
    }

    if(task.user.toString() !== req.user._id.toString()){
        return res.status(401).json({ message: "Not Authorized"});
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully"});


    }catch(error){
        res.status(500).json({ message: "Server error"});
    }
}