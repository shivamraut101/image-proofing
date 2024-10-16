import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import UserImageSelection from './UserImageSelection';

function App() {
    const [isAdmin, setIsAdmin] = useState(false);

    return (
        <div className="App">
            {/* {!isAdmin ? <AdminLogin setIsAdmin={setIsAdmin} /> : <AdminDashboard />} */}
            <AdminDashboard />
            {/* <UserImageSelection /> */}
        </div>
    );
}

export default App;
