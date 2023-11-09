const isType = (data) => {
    if (data === null)
        return 'null';
    if (Array.isArray(data))
        return 'array';
    return typeof data;
};
/**
 * 事件总线
 */
export default class EventBus {
    /**
     * - options 配置对象
     * - options.state 状态
     * - options.events 事件
     */
    constructor(options = {}) {
        this._eventMap = new Map();
        if (isType(options) !== 'object') {
            throw new TypeError('"options" must be a object');
        }
        const { state = {}, events = {} } = options;
        if (isType(state) !== 'object') {
            throw new TypeError('"state" must be a object');
        }
        if (isType(events) !== 'object') {
            throw new TypeError('"events" must be a object');
        }
        this.state = state;
        for (const key in events) {
            if (!events.hasOwnProperty(key))
                continue;
            this._eventMap.set(key, [events[key]]);
        }
    }
    /**
     * 注册自定义事件
     * - eventName 事件名
     * - callback 事件回调
     */
    on(eventName, callback) {
        if (!(typeof eventName === 'string' || typeof eventName === 'symbol')) {
            throw new TypeError('"eventName" must be a string or symbol');
        }
        if (typeof callback !== 'function') {
            throw new TypeError('"callback" must be a function');
        }
        if (!this._eventMap.has(eventName)) {
            this._eventMap.set(eventName, []);
        }
        this._eventMap.get(eventName).push(callback);
        return this;
    }
    /**
     * 触发自定义事件
     * - eventName 事件名
     * - args 传递的参数
     */
    emit(eventName, ...args) {
        if (!this._eventMap.has(eventName)) {
            console.error(`Warning: emit => "${String(eventName)}" does not exist`);
            return this;
        }
        this._eventMap.get(eventName).forEach((item) => {
            item(this.state, ...args);
        });
        return this;
    }
    /**
     * 取消一个事件回调
     * - eventName 注册事件时的事件名
     * - callback 注册事件时的回调函数
     */
    off(eventName, callback) {
        if (!this._eventMap.has(eventName)) {
            console.error(`Warning: off => "${String(eventName)}" does not exist`);
            return this;
        }
        if (typeof callback !== 'function') {
            throw new TypeError('"callback" must be a function');
        }
        const list = this._eventMap.get(eventName);
        const i = list.findIndex(item => item === callback);
        if (i === -1) {
            console.error(`Warning: off => this "callback" does not exist`);
            return this;
        }
        list.splice(i, 1);
        if (list.length === 0) {
            this._eventMap.delete(eventName);
        }
        return this;
    }
}
