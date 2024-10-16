import React, { useState } from 'react';
import axios from 'axios';

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // const handleLogin = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await axios.post('/api/admin/login', { username, password });
    //         // Handle successful login
    //         console.log(response.data);
    //     } catch (error) {
    //         console.error('Login failed', error);
    //     }
    // };

    return (
        <form onSubmit={handleLogin} className="flex flex-col">
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    );
}

export default AdminLogin;
