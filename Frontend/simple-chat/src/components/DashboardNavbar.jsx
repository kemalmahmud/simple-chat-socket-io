import { AppBar, Grid, Typography, Toolbar, Badge, Avatar } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

const username = localStorage.getItem('sender');

export default function DashboardNavbar() {
  return (
    <AppBar position='sticky'>
                <Toolbar>
                    <Grid container alignItems='center'>
                        <Grid item xs={6}>
                            <Typography variant="h6">Simple Chat Socket.io</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container justifyContent='flex-end' alignItems='center'>
                                <Grid item>
                                    <Typography variant="subtitle1" style={{ marginRight: 10 }}>
                                        {username}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                <Badge badgeContent={4} color="error">
                                <Avatar>
                                            <AccountCircle />
                                        </Avatar>
                                    </Badge>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
  )
}