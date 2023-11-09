type IsType =
    'number'
    | 'string'
    | 'boolean'
    | 'bigint'
    | 'symbol'
    | 'function'
    | 'array'
    | 'object'
    | 'null'
    | 'undefined'

const isType = (data?: unknown): IsType => {
    if (data === null) return 'null'
    if (Array.isArray(data)) return 'array'
    return typeof data
}

/**
 * 配置对象
 */
export interface Options {
    state?: State
    events?: Events
}

/**
 * 状态
 */
export interface State {
    [key: string | symbol]: any
}

/**
 * 事件函数
 */
export interface Events {
    [key: string | symbol]: (state: State, ...arg: any) => any
}

export type OnCallback = (state: object, ...args: any) => void
// type On = (eventName: string | symbol, callback: OnCallback) => On

// type Emit = (eventName: string | symbol, ...arg: any) => Emit

// type Off = (eventName: string | symbol, callback: OffCallback) => Off
export type OffCallback = (state: object, ...args: any) => void

/**
 * 事件总线
 */
export default class EventBus {
    private _eventMap = new Map()
    /** 状态数据 */
    state: State

    /**
     * - options 配置对象
     * - options.state 状态
     * - options.events 事件
     */
    constructor(options: Options = {}) {
        if (isType(options) !== 'object') {
            throw new TypeError('"options" must be a object')
        }

        const { state = {}, events = {} } = options
        if (isType(state) !== 'object') {
            throw new TypeError('"state" must be a object')
        }

        if (isType(events) !== 'object') {
            throw new TypeError('"events" must be a object')
        }

        this.state = state
        for (const key in events) {
            if (!events.hasOwnProperty(key)) continue
            this._eventMap.set(key, [events[key]])
        }
    }

    /**
     * 注册自定义事件
     * - eventName 事件名
     * - callback 事件回调
     */
    on(eventName: string | symbol, callback: OnCallback) {
        if (!(typeof eventName === 'string' || typeof eventName === 'symbol')) {
            throw new TypeError('"eventName" must be a string or symbol')
        }

        if (typeof callback !== 'function') {
            throw new TypeError('"callback" must be a function')
        }

        if (!this._eventMap.has(eventName)) {
            this._eventMap.set(eventName, [])
        }

        this._eventMap.get(eventName).push(callback)
        return this
    }

    /**
     * 触发自定义事件
     * - eventName 事件名
     * - args 传递的参数
     */
    emit(eventName: string | symbol, ...args: any) {
        if (!this._eventMap.has(eventName)) {
            console.error(`Warning: emit => "${String(eventName)}" does not exist`)
            return this
        }

        this._eventMap.get(eventName).forEach((item: any) => {
            item(this.state, ...args)
        })
        return this
    }

    /**
     * 取消一个事件回调
     * - eventName 注册事件时的事件名
     * - callback 注册事件时的回调函数
     */
    off(eventName: string | symbol, callback: OffCallback) {
        if (!this._eventMap.has(eventName)) {
            console.error(`Warning: off => "${String(eventName)}" does not exist`)
            return this
        }

        if (typeof callback !== 'function') {
            throw new TypeError('"callback" must be a function')
        }

        const list: [] = this._eventMap.get(eventName)
        const i = list.findIndex(item => item === callback)
        if (i === -1) {
            console.error(`Warning: off => this "callback" does not exist`)
            return this
        }

        list.splice(i, 1)
        if (list.length === 0) {
            this._eventMap.delete(eventName)
        }

        return this
    }
}
