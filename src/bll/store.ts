import { applyMiddleware, combineReducers, createStore, Dispatch } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createStateSyncMiddleware, initMessageListener, } from 'redux-state-sync';
import { ActionsAppType, appReducer } from './app-reducer';
import { ActionsTaskType, tasksReducer } from './tasks-reducer';
import { ActionsTodoListType, todolistsReducer } from './todolists-reducer';
import { ActionsAuthType, authReducer } from './auth-reducer';


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})
export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, createStateSyncMiddleware()))


export type ActionsType =
    | ActionsAppType
    | ActionsTaskType
    | ActionsTodoListType
    | ActionsAuthType
// @ts-ignore
initMessageListener(store);
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppDispatchType = Dispatch<ActionsType>
