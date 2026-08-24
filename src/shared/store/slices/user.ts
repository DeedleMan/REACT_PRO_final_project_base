import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
	user: Partial<User> | null;
	accessToken: string;
}

const createInitState = (): UserState => ({
	user: null,
	accessToken: '',
});

// Утилиты для localStorage
const storage = {
	getItem: (key: string): string | null => {
		try {
			return localStorage.getItem(key);
		} catch {
			return null;
		}
	},
	setItem: (key: string, value: string): void => {
		try {
			localStorage.setItem(key, value);
		} catch {}
	},
	removeItem: (key: string): void => {
		try {
			localStorage.removeItem(key);
		} catch {}
	},
};

export const userSlice = createSlice({
	name: 'user',
	initialState: createInitState(),
	reducers: {
		setAccessToken(state, action: PayloadAction<Pick<Token, 'accessToken'>>) {
			state.accessToken = action.payload.accessToken;
			storage.setItem('accessToken', action.payload.accessToken);
		},
		clearUser(state) {
			state.user = null;
			state.accessToken = '';
			storage.removeItem('accessToken');
		},
		setUser: (state, action: PayloadAction<UserState['user']>) => {
			state.user = action.payload;
			// Сохраняем user в localStorage
			if (action.payload) {
				storage.setItem('user', JSON.stringify(action.payload));
			}
		},
	},
	selectors: {
		getUser: (state: UserState) => state.user,
		getAccessToken: (state: UserState) => state.accessToken,
	},
});

export const userActions = { ...userSlice.actions };
export const userSelectors = userSlice.selectors;
