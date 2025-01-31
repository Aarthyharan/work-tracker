import React, { useState, useEffect } from 'react';
import { useAppContext } from './AppContext'; 
import { useLocation, useNavigate } from 'react-router-dom';

const CreateTaskForm = () => {
  const { addTask, updateTask, tasks, logout, user } = useAppContext(); 
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [status, setStatus] = useState('To Do');
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState({
    taskTitleErr: '',
    taskDescriptionErr: '',
    dueDateErr: '',
    attachmentErr: ''
  });
  const navigate = useNavigate();
  const taskId = useLocation().state;

  console.log("taskId",taskId)

  // Load the task if we're editing
  useEffect(() => {
    if (taskId) {
      const taskToEdit = tasks.find((task) => task.id === taskId);
      if (taskToEdit) {
        setTaskTitle(taskToEdit.title);
        setTaskDescription(taskToEdit.description);
        setDueDate(taskToEdit.dueDate);
        setPriority(taskToEdit.priority);
        setStatus(taskToEdit.status);
        setAttachment(taskToEdit.attachment);
      }
    }
  }, [taskId, tasks]);

  const validateForm = () => {
    setError({
      taskTitleErr: '',
      taskDescriptionErr: '',
      dueDateErr: '',
      attachmentErr: ''
    });
    let isValid = true;

    if (!taskTitle) {
      setError((prevState) => ({ ...prevState, taskTitleErr: 'Title is required' }));
      isValid = false;
    }

    if (!taskDescription) {
        setError((prevState) => ({ ...prevState, taskDescriptionErr: 'Description is required' }));
      isValid = false;
    }

    if (!dueDate) {
        setError((prevState) => ({ ...prevState, dueDateErr: 'Due Date is required' }));
      isValid = false;
    } 
    else if (new Date(dueDate) < new Date()) {
      setError((prevState) => ({ ...prevState, dueDateErr: 'Due date is not valid' }));
      isValid = false;
    }

    // if (attachment) {
    //   const validImageTypes = ['/jpeg', '/png', '/gif'];
    //   if (!validImageTypes.includes(attachment.type)) {
    //     setError((prevState) => ({ ...prevState, attachmentErr: 'Invalid file type. Please upload an image.' }));
    //   }
    //   isValid = false;
    // }
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    const newTask = {
        id: taskId? taskId : Date.now(), // Unique ID using current timestamp
        title: taskTitle,
        description: taskDescription,
        dueDate,
        priority,
        status,
        attachment,
        userId: user.id 
      };
  
      if (taskId) {
          const updated = updateTask(newTask);
          if (updated) {
            navigate('/tasks');
            resetForm();
          }
        } else {
          const added = addTask(newTask);
          if (added) {
            navigate('/tasks');
            resetForm();
          }
        }
}

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     // Form validation
//     if (!taskTitle || !taskDescription || !dueDate) {
//       setError('Please fill in all required fields.');
//       return;
//     }

    // const newTask = {
    //   id: taskId? taskId : Date.now(),
    //   title: taskTitle,
    //   description: taskDescription,
    //   dueDate,
    //   priority,
    //   status,
    //   attachment,
    // };

    // if (taskId) {
    //     const updated = updateTask(newTask);
    //     if (updated) {
    //       navigate('/tasks');
    //       resetForm();
    //     }
    //   } else {
    //     const added = addTask(newTask);
    //     if (added) {
    //       navigate('/tasks');
    //       resetForm();
    //     }
    //   }
//   };

  
  const resetForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setDueDate('');
    setPriority('Low');
    setStatus('To Do');
    setAttachment(null); 
  };

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    console.log('file', file);
    
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAttachment(previewUrl);
    }
  };
  
  console.log('attachment', attachment);

  function handleLogout() {
    logout(); 
    navigate('/');  
  }
  

  return (
    <div className='createtask-style'>
        <button className='button-back' onClick={() => navigate(-1)}>Back</button>
        <button className='button-create' onClick={handleLogout}>Logout</button>
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input type="text" value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)} className='input-style'
          />
          {error.taskTitleErr && <p className='error-message'>{error.taskTitleErr}</p>}
        </div>
        <div>
          <label>Description</label>
          <textarea value={taskDescription} className='input-style'
            onChange={(e) => setTaskDescription(e.target.value)} 
          />
          {error.taskDescriptionErr && <p className='error-message'>{error.taskDescriptionErr}</p>}
        </div>
        <div>
          <label>Due Date</label>
          <input type="date" value={dueDate} className='input-style'
            onChange={(e) => setDueDate(e.target.value)}
          />
          {error.dueDateErr && <p className='error-message'>{error.dueDateErr}</p>}
        </div>
        <div>
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} 
          className='input-style'
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label>Status</label>
          <select value={status}
            onChange={(e) => setStatus(e.target.value)} className='input-style'
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label>Attachment</label>
          <input
            type="file" onChange={handleAttachmentChange} className='input-style'
          />
          {attachment && (
            <div>
              <img
                src={attachment}
                alt="Attachment preview"
                style={{ width: '100px', height: '100px'}}
              />
            </div>
            
          )}
        </div>
        {error.attachmentErr && <p className='error-message'>{error.attachmentErr}</p>}
        <button className='button-create' type="submit">{taskId ? 'Update Task' : 'Create Task'}</button>
      </form>
    </div>
  );
};

export default CreateTaskForm;
