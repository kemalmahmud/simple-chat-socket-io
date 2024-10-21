import Dashboard from './layout/Dashboard.jsx';
import Login from './layout/Login.jsx';
import ChatWindow from './layout/ChatWindow.jsx';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

export default function App() {
    return (
                <Router>
                    <Routes>
                        <Route path='/' element={<Login />} />
                        <Route path='/home' element={<Dashboard />} />
                        <Route path='/chat/:id/:username' element={<ChatWindow />} />
                    </Routes>
                </Router>
        );
}
