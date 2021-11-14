import {
    addTask,
    removeTask,
    tasksReducer,
    TasksStateType,
    UpdateDomainTaskModelType,
    updateTask
} from '../tasks-reducer';
import { addTodolist, removeTodolist } from '../todolists-reducer';
import { TodolistType } from '../../api/Todo-lists-api';

let startState: TasksStateType
beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1',
                addedDate: '',
                order: 1,
                todoListId: 'todolistId1',
                title: 'JS',
                status: 0,
                deadline: '',
                startDate: '',
                description: '',
                priority: 2
            },
            {
                id: '2',
                addedDate: '',
                order: 1,
                todoListId: 'todolistId1',
                title: 'react',
                status: 0,
                deadline: '',
                startDate: '',
                description: '',
                priority: 2
            },
            {
                id: '3',
                addedDate: '',
                order: 1,
                todoListId: 'todolistId1',
                title: 'react',
                status: 0,
                deadline: '',
                startDate: '',
                description: '',
                priority: 2
            },
        ],
        'todolistId2': [
            {
                id: '4',
                addedDate: '',
                order: 1,
                todoListId: 'todolistId1',
                title: 'react',
                status: 0,
                deadline: '',
                startDate: '',
                description: '',
                priority: 2
            },
            {
                id: '5',
                addedDate: '',
                order: 1,
                todoListId: 'todolistId1',
                title: 'react2',
                status: 0,
                deadline: '',
                startDate: '',
                description: '',
                priority: 2
            },
            {
                id: '6',
                addedDate: '',
                order: 1,
                todoListId: 'todolistId1',
                title: 'react',
                status: 0,
                deadline: '',
                startDate: '',
                description: '',
                priority: 2
            },
        ]
    }
})
test('Title of task changed', () => {
    const model:UpdateDomainTaskModelType =  { title:'Kornaval', deadline:'', description: '', priority: 2, startDate: '1', status: 2 }
    const action = updateTask('4', model, 'todolistId2');
    const endState = tasksReducer(startState, action)
    expect(endState['todolistId2'][0].title).toBe('Kornaval');
    expect(endState['todolistId1'][0].title).toBe('JS');
})
test('correct task should be deleted from correct array', () => {
    const action = removeTask('6', 'todolistId2')
    const endState = tasksReducer(startState, action)
    expect(endState).toEqual({
        'todolistId1': [
            {
                id: '1',
                addedDate: '',
                order: 1,
                todoListId: 'todolistId1',
                title: 'react',
                status: 0,
                deadline: '',
                startDate: '',
                description: '',
                priority: 2
            },
            {
                id: '2',
                addedDate: '',
                order: 1,
                todoListId: 'todolistId1',
                title: 'react',
                status: 0,
                deadline: '',
                startDate: '',
                description: '',
                priority: 2
            },
            {
                id: '3',
                addedDate: '',
                order: 1,
                todoListId: 'todolistId1',
                title: 'react',
                status: 0,
                deadline: '',
                startDate: '',
                description: '',
                priority: 2
            },
        ],
        'todolistId2': [
            {
                id: '4',
                addedDate: '',
                order: 1,
                todoListId: 'todolistId1',
                title: 'react',
                status: 0,
                deadline: '',
                startDate: '',
                description: '',
                priority: 2
            },
            {
                id: '5',
                addedDate: '',
                order: 1,
                todoListId: 'todolistId1',
                title: 'react',
                status: 0,
                deadline: '',
                startDate: '',
                description: '',
                priority: 2
            },
        ]
    })
})
test('correct task should be added to correct array', () => {
    const newTask = {
        id: '6', addedDate: '', order: 1, todoListId: 'todolistId2',
        title: 'CSS', status: 0, deadline: '', startDate: '', description: '', priority: 2
    }
    const action = addTask(newTask);
    const endState = tasksReducer(startState, action)
    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(4);
    expect(endState['todolistId2'][0].id).toBeDefined();
    expect(endState['todolistId2'][0].title).toBe('CSS');
})
test('new array should be added when new todolist is added', () => {
    const newTodo:TodolistType = { id: 'todolistId3' , title: 'new todolist', addedDate: '', order: 1}
    const action = addTodolist(newTodo);
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2');
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
})
test('property with todolistId should be deleted', () => {
    const action = removeTodolist('todolistId2');
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);
    expect(keys.length).toBe(1);
    expect(endState['todolistId2']).not.toBeDefined();
})