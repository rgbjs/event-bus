/**
 * 配置对象
 */
export interface Options {
    state?: State;
    events?: Events;
}
/**
 * 状态
 */
export interface State {
    [key: string | symbol]: any;
}
/**
 * 事件函数
 */
export interface Events {
    [key: string | symbol]: (state: State, ...arg: any) => any;
}
export type OnCallback = (state: object, ...args: any) => void;
export type OffCallback = (state: object, ...args: any) => void;
/**
 * 事件总线
 */
export default class EventBus {
    private _eventMap;
    /** 状态数据 */
    state: State;
    /**
     * - options 配置对象
     * - options.state 状态
     * - options.events 事件
     */
    constructor(options?: Options);
    /**
     * 注册自定义事件
     * - eventName 事件名
     * - callback 事件回调
     */
    on(eventName: string | symbol, callback: OnCallback): this;
    /**
     * 触发自定义事件
     * - eventName 事件名
     * - args 传递的参数
     */
    emit(eventName: string | symbol, ...args: any): this;
    /**
     * 取消一个事件回调
     * - eventName 注册事件时的事件名
     * - callback 注册事件时的回调函数
     */
    off(eventName: string | symbol, callback: OffCallback): this;
}
