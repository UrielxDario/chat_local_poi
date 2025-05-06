import { useState } from 'react';


export const TaskCreator = ({ createNewTask }) => {

    const [newTaskName, setNewTaskName] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        createNewTask(newTaskName)
        localStorage.setItem("tasks", newTaskName)
        setNewTaskName("")
    }



    return (
        <form onSubmit={handleSubmit}>
    
            <input
                type="text"
                placeholder="Ingresa una nueva tarea"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
            />

            <button >Guardar tarea</button>
        </form>
    )
}