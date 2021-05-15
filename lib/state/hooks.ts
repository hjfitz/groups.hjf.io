import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import type {RootState, AppDispatch} from '@/state/store'

// nice typings for useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
