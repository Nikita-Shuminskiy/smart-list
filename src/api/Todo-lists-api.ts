import axios from 'axios'

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': 'a9e3dfbb-2b5c-4f6f-82ce-f1e8266743b5'
    }
}
const instance = axios.create({
    baseURL:  process.env.REACT_APP_DOMAIN_API,
    ...settings
})
// api
export const todoListsApi = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists');
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title});
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`);
    },
    updateTodolist(id: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${id}`, {title});

    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {title});
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    }
}
export const authMeApi = {
    login(dataLogin:LoginParamsType){
        return instance.post<ResponseType<{userId:number}>>('auth/login', dataLogin)
    },
    me(){
        return instance.get<ResponseType<{id:number,login:string,email:string}>>('auth/me')
    },
    logout(){
        return instance.delete<ResponseType>('auth/login')
    }
}

// types
export type LoginParamsType = {
    email:string
    password:string
    rememberMe:boolean
    captcha?:string
}
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D
}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}
export enum TaskStatuses {
    New = 0,
    Completed = 2,

}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
