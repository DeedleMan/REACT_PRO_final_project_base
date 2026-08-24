import { configureStore } from '@reduxjs/toolkit';
import AppApi from '../api/ApiServise';
import { userSlice } from './slices/user';
import { cartSlice } from './slices/cart';
import { productsSlice } from './slices/products';
import { authApi } from './api/authApi';
import { productsApi } from './api/productsApi';

// Утилиты для localStorage
const storage = {
	getItem: (key: string): string | null => {
		try {
			return localStorage.getItem(key);
		} catch {
			return null;
		}
	},
};

// Получаем токен и user из localStorage при инициализации
const getInitialAccessToken = (): string => {
	try {
		return storage.getItem('accessToken') || '';
	} catch {
		return '';
	}
};

const getInitialUser = (): Partial<User> | null => {
	try {
		const userStr = storage.getItem('user');
		return userStr ? JSON.parse(userStr) : null;
	} catch {
		return null;
	}
};

const initialAccessToken = getInitialAccessToken();
const initialUser = getInitialUser();

const initialState = {
	[userSlice.name]: {
		user: initialUser,
		accessToken: initialAccessToken,
	},
};

export const store = configureStore({
	reducer: {
		[userSlice.name]: userSlice.reducer,
		[cartSlice.name]: cartSlice.reducer,
		[productsSlice.name]: productsSlice.reducer,
		[authApi.reducerPath]: authApi.reducer,
		[productsApi.reducerPath]: productsApi.reducer,
	},
	preloadedState: initialAccessToken ? initialState : undefined,
	devTools: process.env.NODE_ENV !== 'production',
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			thunk: {
				extraArgument: AppApi,
			},
			serializableCheck: false,
			immutableCheck: false,
		}).concat([authApi.middleware, productsApi.middleware]),
});
