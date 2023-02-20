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
      function (valueOrUpdateKey: any, newValueOrGetNewValue: any) {
        const storeValue = store.current
        const { newData, dirtyData } = storeValue
        const oldValue = dirtyData || newData
        // 判断是否是单节点更新
        if (typeof valueOrUpdateKey === 'string') {
          const newValue = isFunc(newValueOrGetNewValue) ? newValueOrGetNewValue(oldValue[valueOrUpdateKey]) : newValueOrGetNewValue
          if (oldValue[valueOrUpdateKey] !== newValue) {
            // 先放到脏数据中
            storeValue.dirtyData = assign(oldValue, { [valueOrUpdateKey]: newValue })
          }
        }
        // 批量更新
        else {
          const nextState: Partial<S> = isFunc(valueOrUpdateKey) ? valueOrUpdateKey(oldValue) : valueOrUpdateKey
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
