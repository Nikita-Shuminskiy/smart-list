import {Dispatch} from 'redux'
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer'
import {TaskPriorities, TaskStatuses, TaskType, todoListsApi, UpdateTaskModelType} from '../api/Todo-lists-api'
import {AppRootStateType} from './store'
import {setAppError, setAppStatus, SetAppStatusType, SetErrorAppType} from './app-reducer';

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: ActionsTaskType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId)}
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(task => task.id === action.taskId ? {...task, ...action.model} : task)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            const copyState = {...state}
            delete copyState[action.id]
            return copyState
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todoLists.forEach(todo => copyState[todo.id] = [])
            return copyState
        }
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks}
        default:
            return state
    }
}

// actions
export const removeTask = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId, todolistId} as const)
export const addTask = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)
export const updateTask = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
export const setTasks = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)

// thunks
export const fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch<ActionsTaskType>) => {
    dispatch(setAppStatus('loading'))
        try {
            const res = await todoListsApi.getTasks(todolistId)
            const tasks = res.data.items
            const action = setTasks(tasks, todolistId)
            dispatch(action)
            dispatch(setAppStatus('succeeded'))
        }catch (e) {
            dispatch(setAppError('Some error occurred'))
            dispatch(setAppStatus('failed'))
        }
}
export const removeTaskTC = (taskId: string, todolistId: string) => async (dispatch: Dispatch<ActionsTaskType>) => {
    dispatch(setAppStatus('loading'))
       try {
           await todoListsApi.deleteTask(todolistId, taskId)
           const action = removeTask(taskId, todolistId)
           dispatch(action)
           dispatch(setAppStatus('succeeded'))
       }catch (error) {
           dispatch(setAppError('Some error occurred'))
           dispatch(setAppStatus('failed'))
       }
}

export const addTaskTC = (title: string, todolistId: string) => async (dispatch: Dispatch<ActionsTaskType>) => {
    dispatch(setAppStatus('loading'))
       try{
           const res = await todoListsApi.createTask(todolistId, title)
           if (res.data.resultCode === 0) {
               const task = res.data.data.item
               dispatch(addTask(task))
               dispatch(setAppStatus('succeeded'))
           }
       } catch (error) {
           dispatch(setAppError('Some error occurred'))
           dispatch(setAppStatus('failed'))
       }
}

export const updateTaskTC = (taskId: string, domainModel: any, todolistId: string) =>
   async (dispatch: Dispatch<ActionsTaskType>, getState: () => AppRootStateType) => {
       dispatch(setAppStatus('loading'))
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            console.warn('task not found in the state')
            return
        }
        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }
           try {
               await todoListsApi.updateTask(todolistId, taskId, apiModel)
               dispatch(updateTask(taskId, domainModel, todolistId))
               dispatch(setAppStatus('succeeded'))
           }catch (e) {
               dispatch(setAppError('Some error occurred'))
               dispatch(setAppStatus('failed'))
           }
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
export type ActionsTaskType =
    | SetErrorAppType
    | SetAppStatusType
    | ReturnType<typeof removeTask>
    | ReturnType<typeof addTask>
    | ReturnType<typeof updateTask>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasks>