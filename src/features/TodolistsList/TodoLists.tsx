import {useCallback, useEffect} from 'react'
import * as React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Grid, Paper} from '@material-ui/core'
import {Todolist} from './Todolist/Todolist'
import {AppRootStateType} from '../../bll/store'
import {
    addTodolistTC,
    changeTodolistFilter,
    changeTodolistTitleTC,
    fetchTodoListsTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType
} from '../../bll/todolists-reducer'
import {addTaskTC, removeTaskTC, TasksStateType, updateTaskTC} from '../../bll/tasks-reducer'
import {TaskStatuses} from '../../api/Todo-lists-api'
import {AddItemForm} from '../../components/AddItemForm/AddItemForm'
import {Redirect} from "react-router";


export const TodoLists: React.FC = () => {
    const todoLists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todoLists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTodoListsTC())
    }, [dispatch])

    const removeTask = useCallback((id: string, todolistId: string) => {
        dispatch(removeTaskTC(id, todolistId))
    }, [dispatch])

    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(addTaskTC(title, todolistId))
    }, [dispatch])

    const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
        dispatch(updateTaskTC(id, {status}, todolistId))
    }, [dispatch])

    const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
        dispatch(updateTaskTC(id, {title: newTitle}, todolistId))
    }, [dispatch])

    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        dispatch(changeTodolistFilter(todolistId, value))
    }, [dispatch])

    const removeTodolist = useCallback((id: string) => {
        dispatch(removeTodolistTC(id))
    }, [dispatch])

    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(changeTodolistTitleTC(id, title))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])

    if (!isLoggedIn) return <Redirect to={'/login'}/>

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todoLists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]
                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                id={tl.id}
                                title={tl.title}
                                entityStatus={tl.entityStatus}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                filter={tl.filter}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
