import { Grid, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import io from 'socket.io-client';


const LoginComponent = () => {

    const generateUniqueId = () => {
        return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    };

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const id = generateUniqueId()

    const handleSubmit = () => {
        if (username.trim()) {
            // Simpan username ke local storage
            localStorage.setItem('sender', username);
            localStorage.setItem('senderId', id.toString());

            // Kirim event 'connect user' ke server
            const socket = io('http://localhost:4000');
            socket.emit('connect user', { id: id, name: username });

            navigate('/home');
        } else {
            alert('Silahkan masukkan username terlebih dahulu');
        }
    };

    return (
        <Grid container spacing={2} maxWidth={400}>
            <Grid item xs={12}>
                <Typography variant="h5" align="center">Silahkan Masukkan Username Anda</Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                >
                    Login
                </Button>
            </Grid>
        </Grid>
    );
};

export default LoginComponent;