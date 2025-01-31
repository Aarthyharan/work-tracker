import React, { createContext, useState, useContext, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null); 
  const [tasks, setTasks] = useState([]); 
  const [isDarkMode, setIsDarkMode] = useState(false); 

  useEffect(() => {
    console.log('please',localStorage.getItem('users'))
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUser(storedUsers[0]);
    console.log('userrrrrval',storedUsers[0])
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  const login = (username, password) => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
 
    const existingUser = storedUsers.find(
      (user) => user.username === username
    );
    
    if (!existingUser) {
      return false; 
    }
  
    if (existingUser.password !== password) {
      return false; // Incorrect password
    }
  
    // If both username and password are correct
    setUser(existingUser); 
    return true;
  };
  

  const signUp = (username, password) => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = storedUsers.find((user) => user.username === username);
    if (existingUser) {
      alert('Username already exists');
      return;
    }

  const newUser = { id: Date.now(), username, password };
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    setUser(newUser); 
    return true;
  };


  const logout = () => {
    setUser(null);
    return true;
  };


  const addTask = (newTask) => {
    if (!user) return; 
    
    newTask.userId = user.id; 
  
    const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    existingTasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(existingTasks));
    setTasks((prevTasks) => [...prevTasks, newTask]);
    return true;
  };
  
  const updateTask = (updatedTask) => {
    if (!user) return; 
  
    const updatedTasks = tasks.map((task) =>
    task.id === updatedTask.id && task.userId === user.id ? updatedTask : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    return true;
  };
  
  // Delete a task
  const deleteTask = (taskId) => {
    if (!user) return;
  
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = storedTasks.filter((task) => task.id !== taskId || task.userId !== user.id);
    
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };


  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        tasks,
        isDarkMode,
        login,
        signUp,
        logout,
        addTask,
        deleteTask,
        toggleTheme,
        updateTask
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
