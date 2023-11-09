## 克隆项目

```git
git clone https://github.com/rgbjs/event-bus.git
```

## 使用

```js
const eventBus = new EventBus({
    state: {
        a: 1,
        b: 2
    },
    events: {
        a(state, ...arg) {
            console.log(state, ...arg)
        }
    }
})

console.log(eventBus.state) // 状态数据
eventBus.emit('a', 1, 2, 3) // 触发事件

const b = () => {console.log('b')}
eventBus.on('b', b) // 添加事件
eventBus.emit('b') // 触发事件
eventBus.off('b', b) // 移除事件

// 所有方法返回值都为 this , 所有都支持连续操作
eventBus.emit('b').off('b')
```