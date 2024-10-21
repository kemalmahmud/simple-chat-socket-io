import { Box } from '@mui/material';
import LoginComponent from '../components/LoginComponent';

const Login = () => {
    return (
        <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            height='100vh'
        >
            <LoginComponent />
        </Box>
    );
}

export default Login;