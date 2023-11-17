import auth from "./reducers/auth";
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TaskApi } from './api/tasks/taskApi';
import { RegisterApi } from "./api/auth/registerApi";
import { LoginApi } from "./api/auth/loginApi";
import { ListApi } from "./api/lists/listApi";

export const store = configureStore({
    reducer: {
        auth,
        [LoginApi.reducerPath]: LoginApi.reducer,
        [RegisterApi.reducerPath]: RegisterApi.reducer,
        [ListApi.reducerPath]: ListApi.reducer,
        [TaskApi.reducerPath]: TaskApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(TaskApi.middleware),
  });
  
  setupListeners(store.dispatch);