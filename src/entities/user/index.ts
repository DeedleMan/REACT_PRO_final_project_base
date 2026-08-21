import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
	user: Partial<User> | null;
	accessToken: string;
}

const createInitState = (): UserState => ({
	user: null,
	accessToken: '',
});

export const userSlice = createSlice({
	name: 'user',
	initialState: createInitState(),
	reducers: {
		setAccessToken(state, action: PayloadAction<Pick<Token, 'accessToken'>>) {
			state.accessToken = action.payload.accessToken;
		},
		clearUser() {
			return createInitState();
		},
		setUser: (state, action: PayloadAction<UserState['user']>) => {
			state.user = action.payload;
		},
	},
	selectors: {
		getUser: (state: UserState) => state.user,
		getAccessToken: (state: Token) => state.accessToken,
	},
});

export const userActions = { ...userSlice.actions };
export const userSelectors = userSlice.selectors;
