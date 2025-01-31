// src/components/TaskList.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useAppContext } from './AppContext'; 
import { useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';

const TaskList = () => {
  const { tasks, deleteTask, logout, user } = useAppContext();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [sortKey, setSortKey] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');
  const [show, setShow] = useState(false);
  const [apply, setApply] = useState(false);

  console.log('tasksssssss',tasks);

  const FilteredAndSorted = useMemo(() => {
    console.log('inside')
    console.log('userrrrr',user)
    if (!user) return []; 
    
    let filtered = tasks.filter((task) => task.userId === user.id); 
    console.log('filtered inside',filtered)

    filtered = filtered.filter((task) => {
      const searchMatch = task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                          task.priority.toLowerCase().includes(searchValue.toLowerCase()) ||
                          task.status.toLowerCase().includes(searchValue.toLowerCase()) ||
                          task.dueDate.toLowerCase().includes(searchValue.toLowerCase());
  
      const priorityMatch = priorityFilter ? task.priority === priorityFilter : true;
      const statusMatch = statusFilter ? task.status === statusFilter : true;
      const dueDateMatch = dueDateFilter ? task.dueDate === dueDateFilter : true;
  
      return searchMatch && priorityMatch && statusMatch && dueDateMatch;
    });
  
    let sorted = filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortKey] > b[sortKey] ? 1 : -1;
      } else {
        return a[sortKey] < b[sortKey] ? 1 : -1;
      }
    });
    
    return sorted;
  }, [tasks, searchValue, sortKey, sortOrder, apply]);
  

  console.log('filtered',FilteredAndSorted)
  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  function handleFilter(){
    setShow(false);
    setApply(!apply);
  }

  function clearFilter(){
    setDueDateFilter('');
    setPriorityFilter('');
    setStatusFilter('');
  }
  
  function handleLogout() {
    logout(); 
    navigate('/');  
  }
  

  return (
    <>
    <div className="tasklist-style">
      <button className ='button-back' onClick={() => navigate(-1)}>Back</button>

      <button onClick={handleLogout} className="button-create">Logout</button>
      <button className="button-create" onClick={() => navigate('/tasks/create')}>Create Task</button>
      
      <h2>Manage Tasks</h2>
      <div className='filter-div'>
      <input type='text' className='search-style' onChange={(e)=> setSearchValue(e.target.value)} placeholder='Search'></input>
      <button className='button-filter' onClick={() => setShow(true)}>Filter</button>
        <button className="button-filter" onClick={() => handleSort('dueDate')}>Sort by Due Date</button>
        <button className="button-filter" onClick={() => handleSort('priority')}>Sort by Priority</button>
        </div>
      {FilteredAndSorted.length === 0 ? (
        <>
        <p className="no-tasks">No Tasks Found</p>
        </>
      ) : (
        <ul>
          {FilteredAndSorted.map((task) => (
            <li key={task.id} className="list-style">
              <span>TITLE: {task.title}</span>

              <button className='delete-button' onClick={() => deleteTask(task.id)}>Delete</button>
              <button className='edit-button' onClick={() => navigate("/tasks/edit", { state: task.id })}>Edit</button>
              
              <p>{task.description}</p>
              <p>Due Date: {task.dueDate}</p>
              <p>Priority: {task.priority}</p>
              <p>Status: {task.status}</p>
              {task.attachment && (
                <img
                  src={task.attachment}
                  alt="attachment"
                  style={{ width: '100px', height: '100px'}}
                />
              )}
              
            </li>
          ))}
        </ul>
      )}
    </div>

      <ReactModal className="filter-style"
      isOpen={show}
      onRequestClose={() => setShow(false)}
      >
      <h3>Filter</h3>
      <div>
        <label>Priority</label>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label>Status</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div>
        <label>Due Date</label>
        <input
          type="date"
          value={dueDateFilter}
          onChange={(e) => setDueDateFilter(e.target.value)}
        />
      </div>

      <div>
      <button className='button-style' onClick={() => handleFilter()}>Apply Filter</button>
      <button className='button-style' onClick={() => clearFilter()}>Clear Filter</button>
        
      </div>
    </ReactModal>
    </>
  );
};

export default TaskList;
