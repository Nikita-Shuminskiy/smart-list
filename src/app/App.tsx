import * as React from 'react'
import {useEffect} from 'react';
import {Route, Switch, useHistory} from 'react-router-dom';
import {AppBar, Button, Container, LinearProgress, Toolbar} from '@material-ui/core'
import './App.css'
import {TodoLists} from '../features/TodolistsList/TodoLists'
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../bll/store';
import {RequestStatusType} from '../bll/app-reducer';
import {ErrorSnackbar} from '../components/ErrorSnackBar/ErrorSnackBar';
import {Login} from '../features/Login/Login';
import {initializeAppTC, logoutTC} from '../bll/auth-reducer';
import {Redirect} from 'react-router';


function App() {
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const dispatch = useDispatch()
    const history = useHistory()
    useEffect(() => {
        dispatch(initializeAppTC())
    }, [dispatch])

    const logOutHandler = () => {
        dispatch(logoutTC())
        history.push('/login')
    }
    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    {
                        isLoggedIn && <Button onClick={logOutHandler} variant={'outlined'} color="inherit">Log-Out</Button>
                    }
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color="secondary"/>}
            <Container fixed>
                <Switch>
                    <Route path={'/login'} render={() => <Login/>}/>
                    <Route exact path={'/'} render={() => <TodoLists/>}/>

                    <Route path={'/404'} render={() => <h1>404: PAGE NOT FOUND</h1>}/>
                    <Redirect from={'*'} to={'/404'}/>
                </Switch>
            </Container>

            <ErrorSnackbar/>
        </div>
    )
}

export default App
