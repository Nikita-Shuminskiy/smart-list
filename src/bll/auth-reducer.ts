import {setAppError, setAppStatus} from './app-reducer';
import {authMeApi, LoginParamsType} from '../api/Todo-lists-api';
import {AppDispatchType} from './store';


const initialState = {
    isLoggedIn: false
}

export const authReducer = (state = initialState, action: ActionsAuthType): InitialStateType => {
    switch (action.type) {
        case 'AUTH/IS-LOGGED-IN':
            return {...state, isLoggedIn: action.isLoggedIn}
        default:
            return state
    }
}

// actions
export const setIsLoggedIn = (isLoggedIn: boolean) => ({type: 'AUTH/IS-LOGGED-IN', isLoggedIn} as const)
// thunks
export const loginTC = (data: LoginParamsType) =>
    async (dispatch: AppDispatchType) => {
        dispatch(setAppStatus('loading'))
        try {
            const res = await authMeApi.login(data)
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedIn(true))
            }else if(res.data.resultCode === 1){
                dispatch(setAppError(res.data.messages[0]))
            }
            dispatch(setAppStatus('idle'))
        } catch (e) {
            dispatch(setIsLoggedIn(false))
            dispatch(setAppStatus('failed'))
        }

    }
export const initializeAppTC = () => async (dispatch: AppDispatchType) => {
    dispatch(setAppStatus('loading'))
    try {
        const res = await authMeApi.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn(true));
            dispatch(setAppStatus('idle'))
        }else {
            dispatch(setAppStatus('idle'))
        }
    } catch (e) {
        dispatch(setIsLoggedIn(false))
        dispatch(setAppStatus('failed'))
    }
}
export const logoutTC = () => async (dispatch: AppDispatchType) => {
    dispatch(setAppStatus('loading'))
    try {
        const res = await authMeApi.logout()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn(false))
            dispatch(setAppStatus('idle'))
        }
    } catch (e) {
        dispatch(setIsLoggedIn(false))
        dispatch(setAppStatus('failed'))
    }
}


//types
type InitialStateType = typeof initialState
export type ActionsAuthType = ReturnType<typeof setIsLoggedIn>
