// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components
import TaskList from './components/TaskList';
import LoginPage from './components/login';
import SignUpPage from './components/signup';
import { AppProvider } from './components/AppContext'; // Import the provider
import CreateTaskForm from './components/createTask';

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/create" element={<CreateTaskForm />} /> 
          <Route path="/tasks/edit" element={<CreateTaskForm />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
