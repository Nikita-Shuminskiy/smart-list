import { Dispatch } from 'redux'
import { RequestStatusType, setAppError, setAppStatus, SetAppStatusType, SetErrorAppType } from './app-reducer';
import { todoListsApi, TodolistType } from '../api/Todo-lists-api'


const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state = initialState, action: ActionsTodoListType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(todo => todo.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(todo => todo.id === action.id ? {...todo, title: action.title} : todo)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(todo => todo.id === action.id ? {...todo, filter: action.filter} : todo)
        case 'SET-TODOLISTS':
            return action.todoLists.map(todo => ({...todo, filter: 'all', entityStatus: 'idle'}))
        case 'CHANGE/ENTITY-STATUS':
            return state.map(todo => todo.id === action.id ? {...todo, entityStatus: action.entityStatus} : todo)
        default:
            return state
    }
}

// actions
export const removeTodolist = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const changeLoadingButton = (id: string, entityStatus: RequestStatusType) => ({
    type: 'CHANGE/ENTITY-STATUS',
    entityStatus,
    id
} as const)
export const addTodolist = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitle = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeTodolistFilter = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const setTodoLists = (todoLists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todoLists} as const)

// thunks
export const fetchTodoListsTC = () => async (dispatch: Dispatch<ActionsTodoListType>) => {
    dispatch(setAppStatus('loading'))
    try {
        const res = await todoListsApi.getTodolists()
        dispatch(setTodoLists(res.data))
        dispatch(setAppStatus('succeeded'))
    } catch (e) {
        dispatch(setAppStatus('failed'))
    }
}
export const removeTodolistTC = (todolistId: string) => async (dispatch: Dispatch<ActionsTodoListType>) => {
    dispatch(changeLoadingButton(todolistId, 'loading'))
    dispatch(setAppStatus('loading'))
    try {
        const res = await todoListsApi.deleteTodolist(todolistId)
        if (res.data.resultCode === 0) {
            dispatch(removeTodolist(todolistId))
            dispatch(setAppStatus('succeeded'))
        }
        if (res.data.messages.length) {
            dispatch(setAppError(res.data.messages[0]))
        }
    } catch (e) {
        dispatch(setAppError('Some error occurred'))
        dispatch(setAppStatus('failed'))
    }
}

export const addTodolistTC = (title: string) => async (dispatch: Dispatch<ActionsTodoListType>) => {
    dispatch(setAppStatus('loading'))
    try {
        const res = await todoListsApi.createTodolist(title)
        if (res.data.resultCode === 0) {
            dispatch(addTodolist(res.data.data.item))
            dispatch(setAppStatus('succeeded'))
        }
        if (res.data.messages.length) {
            dispatch(setAppError(res.data.messages[0]))
        }
    } catch (e) {
        dispatch(setAppStatus('failed'))
        dispatch(setAppError('Some error occurred'))
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => async (dispatch: Dispatch<ActionsTodoListType>) => {
    dispatch(setAppStatus('loading'))
    try {
        await todoListsApi.updateTodolist(id, title)
        dispatch(changeTodolistTitle(id, title))
        dispatch(setAppStatus('succeeded'))
    } catch (e) {
        dispatch(setAppStatus('failed'))
        dispatch(setAppError('Some error occurred'))
    }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolist>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolist>;
export type SetTodolistsActionType = ReturnType<typeof setTodoLists>;

export type ActionsTodoListType =
    | SetAppStatusType
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitle>
    | ReturnType<typeof changeTodolistFilter>
    | SetTodolistsActionType
    | SetErrorAppType
    | ReturnType<typeof changeLoadingButton>
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
