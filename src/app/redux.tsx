'use client';

import { useRef } from 'react';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  Provider,
} from 'react-redux';
import globalReducer from '@/state';
// import { api } from "@/state/api";
import { setupListeners } from '@reduxjs/toolkit/query';
// redux-persist 참조: https://kyounghwan01.github.io/blog/React/redux/redux-persist/
import {
  persistStore, // 리덕스 스토어를 퍼시스트 가능하게 만드는 함수. 이 함수로 생성된 퍼시스터(persistor)는 스토어 상태를 저장소(localStorage 등)에 저장하고 복원함.
  persistReducer, // 리듀서를 감싸서 상태를 자동으로 저장하고 복원할 수 있는 형태로 바꿔주는 고차 리듀서(Higher-Order Reducer)

  // 아래 상수들은 redux toolkit의 미들웨어 설정에 주로 사용됨
  FLUSH, // 상태를 저장소에 강제로 flush(쓰기)하라는 액션 타입
  REHYDRATE, // 저장소에 있던 persisted state를 복원하라는 액션 타입 (앱 시작 시 발생)
  PAUSE, // 퍼시스트 작동을 일시정지하는 액션 타입
  PERSIST, // 퍼시스트를 시작하는 액션 타입 (persistStore 호출 시 발생)
  PURGE, // 저장소에 저장된 persisted state를 모두 제거하라는 액션 타입
  REGISTER, // persistReducer가 등록되었음을 알리는 액션 타입
} from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { api } from '@/state/api';

const storage = createWebStorage('local');

const persistConfig = {
  key: 'root',
  // localStorage에 저장합니다.
  storage,
  // global reducer만 localstorage에 저장합니다.
  whitelist: ['global'],
  // blacklist -> 그것만 제외합니다
};

export const rootReducer = combineReducers({
  global: globalReducer,
  [api.reducerPath]: api.reducer, // api.reducerPath는 리덕스 툴킷의 쿼리 미들웨어에서 사용하는 고유한 키. 이 키를 사용하여 쿼리 미들웨어가 데이터를 캐시하고 관리함.
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 스토어 함수 정의
export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefault) =>
      getDefault({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware),
  });
};

// 리덕스 타입 정의
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 리덕스 프로바이더 컴포넌트 정의
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(undefined);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch); // 페이지 포커스 변경이나 인터넷 재연결 시 자동으로 데이터를 다시 가져오도록 리스너를 설정해주는 함수
  }

  const persistor = persistStore(storeRef.current);

  return (
    <Provider store={storeRef.current}>
      {/* storeRef.current가 jsx이므로 children으로 전달 */}
      <PersistGate persistor={persistor} loading={null}>
        {/* persist 상태가 복원될 때까지 대기시킴 */}
        {children}
      </PersistGate>
    </Provider>
  );
}
