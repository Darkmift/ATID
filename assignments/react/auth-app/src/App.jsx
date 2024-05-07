/* eslint-disable react/prop-types */
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';

function Home({ logout }) {
  const location = useLocation();
  const [name, setName] = useState('');

  useEffect(() => {
    if (location.state) {
      setName(location.state.name);
    }
  }, [location?.state?.name, setName]);

  return (
    <div>
      <button onClick={logout}>logout</button>
      <h1>Welcome, {name}</h1>
    </div>
  );
}

const mockFetchUserService = (username, password) => {
  if (username === 'bob' && password === '12345') {
    return Promise.resolve({ name: 'bob' });
  }
  return Promise.reject('Invalid username or password');
};

function Login({ login }) {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
      const result = await mockFetchUserService(username, password);
      if (result.name === 'bob') {
        login();
        navigate('/home', { state: { name: result.name } });
      }
    } catch (error) {
      console.error('??', error);
      setErrorMessage(error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" name="username" />
        <input type="password" placeholder="Password" name="password" />
        <button type="submit">Login</button>
      </form>
      {errorMessage ? <p>{errorMessage}</p> : ''}
    </div>
  );
}

function FooBar({ element, isAuthenticated }) {
  if (isAuthenticated) {
    return element;
  }

  return <Navigate to="/login" />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginHandler = () => {
    setIsAuthenticated(true);
  };

  const logoutHandler = () => {
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login login={loginHandler} />} />
        <Route
          path="/home"
          element={<FooBar isAuthenticated={isAuthenticated} element={<Home logout={logoutHandler} />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
