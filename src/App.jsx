import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes/routes';
import Navbar from './components/navbar';
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Routes>
        </div>
      </div>
    </Router>
  );
};


export default App;