import React from 'react';
import { Box } from '@mui/material';
import DashboardNavbar from '../components/DashboardNavbar';
import UserList from '../components/UserList';

const Dashboard = () => {
    return (
        <Box>
            <DashboardNavbar />
            <UserList />
        </Box>
    );
};

export default Dashboard;