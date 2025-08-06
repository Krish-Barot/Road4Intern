import './App.css';
import Homepage from './Homepage';
import JobDetails from './JobDetails';
import RecentJobs from './RecentJobs';
import { Route, Routes, Navigate } from 'react-router-dom'
import Signup from './Components/Signup';
import Login from './Components/Login';
import Jobs from './Jobs';
import Application from './Application';
import AboutUs from './AboutUs';
import { useEffect, useState } from 'react';
import ApplicationHistory from './ApplicationHistory';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [user, setUser] = useState(null);
  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     setUser(localStorage.getItem("token"));
  //   };

  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        console.log("Decoded token:", decodedUser);
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token:", error);
        setUser(null);
      }
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
       
        <Routes>
          {user && (
            <Route path="/" element={
              <>
                <Homepage user={user} />
                <RecentJobs />
              </>
            }
            />
          )}
          <Route path='/jobs' element={<Jobs user={user} />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route path="/jobs/:id" element={<JobDetails user={user} />} />

          {/* <Route path="/" element={<Navigate replace to="/login" />} /> */}
          {!user && <Route path="/" element={<Navigate replace to="/login" />} />}

          <Route path='/application' element={<Application user={user} />} />
          <Route path='/about' element={<AboutUs user={user} />} />
          <Route path="/application-history/:userId" element={<ApplicationHistory user={user} />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
