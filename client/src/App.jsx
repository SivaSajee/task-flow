import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

function App() {
    const [tasks, setTasks] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newTodo, setNewTodo] = useState("");

    useEffect(() => {
        GetTasks();
    }, []);

    const GetTasks = async () => {
        const res = await fetch(API_BASE + "/tasks");
        const data = await res.json();
        setTasks(data);
    }

    const completeTask = async (id) => {
        const data = await fetch(API_BASE + "/tasks/" + id, { method: "PUT" }).then(res => res.json());

        setTasks(tasks => tasks.map(task => {
            if (task._id === data._id) {
                task.isComplete = data.isComplete;
            }
            return task;
        }));
    }

    const deleteTask = async (id) => {
        const data = await fetch(API_BASE + "/tasks/" + id, { method: "DELETE" }).then(res => res.json());

        setTasks(tasks => tasks.filter(task => task._id !== data._id));
    }

    const addTask = async () => {
        if (newTodo === "") return; // Don't add empty tasks

        const data = await fetch(API_BASE + "/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: newTodo
            })
        }).then(res => res.json());

        setTasks([...tasks, data]);
        setPopupActive(false);
        setNewTodo("");
    }

    return (
        <div className="App">
            <h1>Task Flow ✅</h1>

            <div className="content">
                {/* Input Section */}
                <div className="add-popup">
                    <input 
                        type="text" 
                        className="add-input" 
                        onChange={e => setNewTodo(e.target.value)} 
                        value={newTodo} 
                        placeholder="What needs to be done?"
                        onKeyDown={e => e.key === 'Enter' ? addTask() : ''}
                    />
                    <button className="add-button" onClick={addTask}>+</button>
                </div>

                {/* Tasks List */}
                <div className="tasks">
                    {tasks.map(task => (
                        <div 
                            className={"todo " + (task.isComplete ? "is-complete" : "")} 
                            key={task._id} 
                            onClick={() => completeTask(task._id)}
                        >
                            <div className="checkbox"></div>
                            <div className="text">{task.text}</div>
                            <div className="delete-todo" onClick={(e) => { e.stopPropagation(); deleteTask(task._id) }}>x</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;