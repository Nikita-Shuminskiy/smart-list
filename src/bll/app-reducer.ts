
const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsAppType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}
//action
export const setAppStatus = (status:RequestStatusType) => ({type:'APP/SET-STATUS', status} as const )
export const setAppError = (error:string | null) => ({type:'APP/SET-ERROR', error} as const )
//type
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type InitialStateType = typeof initialState
export type SetAppStatusType = ReturnType<typeof setAppStatus>
export type SetErrorAppType = ReturnType<typeof setAppError>
export type ActionsAppType = SetAppStatusType | SetErrorAppType