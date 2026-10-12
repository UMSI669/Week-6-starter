import { createSlice } from '@reduxjs/toolkit';
//cmt: This is a slice of the redux store. It manages the authentication state of the user. It has two actions: signedIn and signedOut. The initial state is loading, and the user is null. When the user signs in, the status is set to signedIn and the user is set to the payload. When the user signs out, the status is set to signedOut and the user is set to null.
// Who is signed in. `status` starts as 'loading' while the saved session is restored.
const authSlice = createSlice({
  name: 'auth',
  initialState: { status: 'loading', user: null },
  reducers: {
    signedIn: (state, action) => {
      state.status = 'signedIn';
      state.user = action.payload;
    },
    signedOut: (state) => {
      state.status = 'signedOut';
      state.user = null;
    },
  },
});

export const { signedIn, signedOut } = authSlice.actions;
export default authSlice.reducer;
