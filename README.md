# 1	useStates出现的目的

`useStates`出现的目的，是为了解决在一个组件中定义过多的`useState`

```ts
const [ a, setStateA ] = useState()
const [ b, setStateB ] = useState()
const [ c, setStateC ] = useState()
const [ d, setStateD ] = useState()
const [ e, setStateE ] = useState()
......
```

这会出现两个问题：

- 每个`useState`会派生一个`setState`方法用于修改`state`，导致组件中存在过多的`setState`，每次要批量更新的时候，需要多次`setState`

```ts
setStateA()
setStateB()
...
```

- 闭包与内存泄漏问题。在`react`的方法中，想要拿到最新的`state`值变的非常困难，开发者得考虑一些列的依赖项，来保证获取到最新的`state`，增加使用负担

```ts
const [ a, setStateA ] = useState()
const [ b, setStateB ] = useState()
const [ c, setStateC ] = useState()

const onChange = useCallback(()=>{
    ......
}, [ a, b ])
```

> `useStates`出现的目的是为了解决上面提到的两个问题



# 2	useStates使用准则

> 需要注意的是
>
> ！！！！！！！！！！**`useStates`初始化值只能传 `Object`，或者`()=>Object`**！！！！！！！！！！

- `useState`

```ts
const [ a, setStateA ] = useState(0)
const [ b, setStateB ] = useState('1')
const [ c, setStateC ] = useState(true)
const [ d, setStateD ] = useState({})
const [ e, setStateE ] = useState([])
```

- 换成`useStates` 写法如下

```ts
const [ state, setState ] = useStates({
    a: 0,
    b: '1',
    c: true,
    d: {},
    e: []
})
// 如果初始值中有cpu密集型计算，可以放在回调方法中（使用方法和useState一致）
const [ state, setState ] = useStates(()=>({
    a: 0,
    b: '1',
    c: true,
    d: {},
    e: []
}))

// 获取
state.a
state.b
state.c
state.d
state.e
```

***错误写法如下：***

```ts
// ！！！！只能传Object！！！！
useStates([])

// ！！！！只能传Object！！！！
useStates(1)

// ！！！！只能传Object！！！！
useStates(true)

......
```



# 3	useStates使用说明

## 3.1	基本使用

```tsx
import ReactDom from 'react-dom'
import { useStates } from './useStates'

function App() {

  const [ state, setState ] = useStates({
    name: 'lin',
    age:  1,
    key:  Math.random()
  })

  return (
    <div>
      <p>姓名：{state.name}</p>
      <p>年龄：{state.age}</p>
      <p>随机数：{state.key}</p>
    </div>
  )
}

ReactDom.render(<App />, document.querySelector('#root')!)
```



## 3.2	部分更新

如果想要更新`state`中的某个值，可以使用`useStates`返回的第二个参数 `setState` 方法进行更新

### 3.2.1	直接更新

```tsx
import ReactDom from 'react-dom'
import { useStates } from './useStates'

function App() {

  const [ state, setState ] = useStates({
    name: 'lin',
    age:  1,
    key:  Math.random()
  })

  // -------------------------⬇⬇⬇⬇⬇⬇⬇看这里⬇⬇⬇⬇⬇⬇⬇-------------------------
  const updateState = () => {

    // 更新年龄
    setState('age', state.age + 1)

    // 更新姓名
    setState('name', `${state.name}+`)

    // 更新key
    setState('key', Math.random())

  }
  // -------------------------⬆⬆⬆⬆⬆⬆⬆看这里⬆⬆⬆⬆⬆⬆⬆-------------------------

  return (
    <div>
      <p>姓名：{state.name}</p>
      <p>年龄：{state.age}</p>
      <p>随机数：{state.key}</p>
      <button onClick={updateState}>单节点更新：直接更新</button>
    </div>
  )
}

ReactDom.render(<App />, document.querySelector('#root')!)
```



### 3.2.2	使用回调函数更新

```tsx
import ReactDom from 'react-dom'
import { useStates } from './useStates'

function App() {

  const [ state, setState ] = useStates({
    name: 'lin',
    age:  1,
    key:  Math.random()
  })

  // -------------------------⬇⬇⬇⬇⬇⬇⬇看这里⬇⬇⬇⬇⬇⬇⬇-------------------------
  const updateStateCallback = () => {

    // 更新年龄
    setState('age', oldAge => oldAge + 1)

    // 更新姓名
    setState('name', oldName => `${oldName}+`)

    // 更新key
    setState('key', oldKey => {
      console.log('旧的key', oldKey)
      return Math.random()
    })

  }
  // -------------------------⬆⬆⬆⬆⬆⬆⬆看这里⬆⬆⬆⬆⬆⬆⬆-------------------------

  return (
    <div>
      <p>姓名：{state.name}</p>
      <p>年龄：{state.age}</p>
      <p>随机数：{state.key}</p>
      <button onClick={updateStateCallback}>单节点更新：使用回调函数更新</button>
    </div>
  )
}

ReactDom.render(<App />, document.querySelector('#root')!)
```



## 3.3	批量更新

`useStates`支持批量更新其中的某几个值，使用方式如下

### 3.3.1	直接更新

```tsx
import ReactDom from 'react-dom'
import { useStates } from './useStates'

function App() {

  const [ state, setState ] = useStates({
    name: 'lin',
    age:  1,
    key:  Math.random()
  })
  
  // -------------------------⬇⬇⬇⬇⬇⬇⬇看这里⬇⬇⬇⬇⬇⬇⬇-------------------------
  const batchUpdateState = () => {
    // 只更新 age 与 name,  key不变
    setState({
      // 更新年龄
      age:  state.age + 1,
      // 更新姓名
      name: `${state.name}+`
    })
  }
  // -------------------------⬆⬆⬆⬆⬆⬆⬆看这里⬆⬆⬆⬆⬆⬆⬆-------------------------

  return (
    <div>
      <p>姓名：{state.name}</p>
      <p>年龄：{state.age}</p>
      <p>随机数：{state.key}</p>
      <button onClick={batchUpdateState}>批量更新：直接更新</button>
    </div>
  )
}

ReactDom.render(<App />, document.querySelector('#root')!)
```

### 3.3.2	使用回调函数更新

```tsx
import ReactDom from 'react-dom'
import { useStates } from './useStates'

function App() {

  const [ state, setState ] = useStates({
    name: 'lin',
    age:  1,
    key:  Math.random()
  })

  // -------------------------⬇⬇⬇⬇⬇⬇⬇看这里⬇⬇⬇⬇⬇⬇⬇-------------------------
  const batchUpdateStateCallback = () => {
    // 只更新 age 与 name,  key不变
    setState(preState => ({
      // 更新年龄
      age:  preState.age + 1,
      // 更新姓名
      name: `${preState.name}+`
    }))
  }
  // -------------------------⬆⬆⬆⬆⬆⬆⬆看这里⬆⬆⬆⬆⬆⬆⬆-------------------------

  return (
    <div>
      <p>姓名：{state.name}</p>
      <p>年龄：{state.age}</p>
      <p>随机数：{state.key}</p>
      <button onClick={batchUpdateStateCallback}>批量更新：使用回调函数更新</button>
    </div>
  )
}

ReactDom.render(<App />, document.querySelector('#root')!)
```



## 3.4	解决闭包问题

`useState`有一个痛点，在部分复杂场景中，会拿不到最新的`state`，`useStates`彻底解决了这个问题，借助`useStates`返回的第三个参数，例子如下

```tsx
import { useEffect } from 'react'
import ReactDom from 'react-dom'
import { useStates } from './useStates'

function App() {

  const [ state, setState, getNewState ] = useStates({
    name: 'lin',
    age:  1,
    key:  Math.random()
  })
  
  // -------------------------⬇⬇⬇⬇⬇⬇⬇看这里⬇⬇⬇⬇⬇⬇⬇-------------------------
  useEffect(()=>{
    const click = () => {
      console.log('现在最新的state值为：', getNewState())
    }
    document.addEventListener(click.name, click)
    return () => document.removeEventListener(click.name, click)
  }, [])

  const batchUpdateState = (e: React.MouseEvent) => {
    e.stopPropagation()
    setState({
      // 更新年龄
      age:  state.age + 1,
      // 更新姓名
      name: `${state.name}+`
    })
  }
  // -------------------------⬆⬆⬆⬆⬆⬆⬆看这里⬆⬆⬆⬆⬆⬆⬆-------------------------
  
  return (
    <div>
      <p>姓名：{state.name}</p>
      <p>年龄：{state.age}</p>
      <p>随机数：{state.key}</p>
      <button onClick={batchUpdateState}>批量更新：直接更新</button>
    </div>
  )
}

ReactDom.render(<App />, document.querySelector('#root')!)
```



## 3.5	setState类型定义

如果想要把`useStates`的第二个参数 `setState`传递给其它组件，那么类型定义可以这么写

```tsx
import { memo, useEffect } from 'react'
import ReactDom from 'react-dom'
import { type UseStatesDispatch, useStates } from './useStates'

// -------------------------⬇⬇⬇⬇⬇⬇⬇看这里⬇⬇⬇⬇⬇⬇⬇-------------------------
type AppUseStates = {
  name: string,
  age: number,
  key: number
}

type AppUseStatesDispatch = UseStatesDispatch<AppUseStates>
// -------------------------⬆⬆⬆⬆⬆⬆⬆看这里⬆⬆⬆⬆⬆⬆⬆-------------------------

function App() {

  const [ state, setState ] = useStates<AppUseStates>({
    name: 'lin',
    age: 1,
    key: Math.random()
  })

  return (
    <div>
      <p>姓名：{state.name}</p>
      <Child setState={setState} />
    </div>
  )
}

// -------------------------⬇⬇⬇⬇⬇⬇⬇看这里⬇⬇⬇⬇⬇⬇⬇-------------------------
const Child = memo(({ setState }: { setState: AppUseStatesDispatch }) => (
  <button
    onClick={e => {
      e.stopPropagation()
      setState('age', preAge => preAge + 1)
    }}
  >
    年龄 + 1
  </button>
))
// -------------------------⬆⬆⬆⬆⬆⬆⬆看这里⬆⬆⬆⬆⬆⬆⬆-------------------------

ReactDom.render(<App />, document.querySelector('#root')!)
```



# 4	useStates源码

```ts
import { useState, useMemo, useCallback, useRef } from 'react'

export interface UseStatesDispatch<S> {
  (value: Partial<S>): void
  (value: (nextState: S) => Partial<S>): void
  <K extends keyof S>(updateKey: K, value: S[K]): void
  <K extends keyof S>(updateKey: K, value: (preValue: S[K]) => S[K]): void
}

type UseStatesReturn<S extends Object> = [S, UseStatesDispatch<S>, () => S]

type UseStatesStore<S> = {
  /** 存储最新的值 */
  newData: S,
  /** 脏数据 */
  dirtyData?: S
}

const isFunc = (t: unknown) => typeof t === 'function'
const { assign } = Object

export function useStates<S extends Object>(defaultValue: S | (() => S)): UseStatesReturn<S> {

  // 派生状态
  const [ data, setData ] = useState<S>(defaultValue)
  // 存储当前hooks的一些状态
  const store = useRef<UseStatesStore<S>>({ newData: undefined!, dirtyData: undefined })

  return [
    useMemo(() => store.current.newData = data, [ data ]),
    useCallback((
      function (fakeValueOrUpdateKey: any, fakeNewValue: any) {
        const storeValue = store.current
        const { newData, dirtyData } = storeValue
        const oldValue = dirtyData || newData
        // 判断是否是单节点更新
        if (typeof fakeValueOrUpdateKey === 'string') {
          const newValue = isFunc(fakeNewValue) ? fakeNewValue(oldValue[fakeValueOrUpdateKey]) : fakeNewValue
          if (oldValue[fakeValueOrUpdateKey] !== newValue) {
            // 先放到脏数据中
            storeValue.dirtyData = assign(oldValue, { [fakeValueOrUpdateKey]: newValue })
          }
        }
        // 批量更新
        else {
          const nextState: Partial<S> = isFunc(fakeValueOrUpdateKey) ? fakeValueOrUpdateKey(oldValue) : fakeValueOrUpdateKey
          // 判断是否需要更新
          if (Object.keys(nextState).some(k => nextState[k] !== oldValue[k])) {
            storeValue.dirtyData = assign(oldValue, nextState)
          }
        }
        // 如果脏数据中没值，那么放到微任务队列中，等待宏任务执行完毕出发更新
        if (!dirtyData){
          queueMicrotask(()=>{
            setData({ ...storeValue.dirtyData! })
            // 清空脏数据
            storeValue.dirtyData = undefined
          }) 
        }
      }
    ), []) as UseStatesReturn<S>[1],
    useCallback(() => store.current.newData, [])
  ]
}
```

