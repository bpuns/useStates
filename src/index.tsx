import { memo, useEffect } from 'react'
import ReactDom from 'react-dom'
import { type UseStatesDispatch, useStates } from './useStates'

type AppUseStates = {
  name: string,
  age: number,
  key: number
}

type AppUseStatesDispatch = UseStatesDispatch<AppUseStates>

function App() {

  const [state, setState, getNewState] = useStates<AppUseStates>({
    name: 'lin',
    age: 1,
    key: Math.random()
  })

  const updateState = (e: React.MouseEvent) => {
    e.stopPropagation()

    // 更新年龄
    setState('age', state.age + 1)
    // 更新姓名
    setState('name', `${state.name}+`)
    // 更新key
    setState('key', Math.random())

  }

  const updateStateCallback = (e: React.MouseEvent) => {
    e.stopPropagation()

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

  const batchUpdateState = (e: React.MouseEvent) => {

    e.stopPropagation()

    // 只更新 age 与 name,  key不变
    setState({
      // 更新年龄
      age: state.age + 1,
      // 更新姓名
      name: `${state.name}+`
    })

  }

  const batchUpdateStateCallback = (e: React.MouseEvent) => {

    e.stopPropagation()

    // 只更新 age 与 name,  key不变
    setState(preState => ({
      // 更新年龄
      age: preState.age + 1,
      // 更新姓名
      name: `${preState.name}+`
    }))

  }

  useEffect(() => {
    const click = () => {
      console.log('现在最新的state值为', getNewState())
    }
    document.addEventListener(click.name, click)
    return () => document.removeEventListener(click.name, click)
  }, [])

  return (
    <div>
      <p>姓名：{state.name}</p>
      <p>年龄：{state.age}</p>
      <p>随机数：{state.key}</p>
      <button onClick={updateState}>单节点更新：直接更新</button>
      <button onClick={updateStateCallback}>单节点更新：使用回调函数更新</button>
      <button onClick={batchUpdateState}>批量更新：直接更新</button>
      <button onClick={batchUpdateStateCallback}>批量更新：使用回调函数更新</button>
      <Child setState={setState} />
    </div>
  )
}

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

ReactDom.render(<App />, document.querySelector('#root')!)