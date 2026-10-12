import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';

import { restoreSession } from '../lib/auth';
import { getFavoriteIds } from '../lib/favorites';
import { setFavorites, signedIn, signedOut, store } from '../store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <RootNavigator />
    </Provider>
  );
}

function RootNavigator() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const userId = useSelector((state) => state.auth.user?.id);

  // On launch, sign the user back in if they have a saved session.
  useEffect(() => {
    restoreSession()
      .then((user) => dispatch(user ? signedIn(user) : signedOut()))
      .catch(() => dispatch(signedOut()));
  }, [dispatch]);

  // Load the user's favorites once after sign-in so every screen can read them.
  useEffect(() => {
    if (!userId) {
      return;
    }
    getFavoriteIds(userId)
      .then((ids) => dispatch(setFavorites(ids)))
      .catch(() => {});
  }, [dispatch, userId]);

  // Wait until we know who is signed in, so the guards below don't
  // briefly send a signed-in user to the sign-in screen.
  if (authStatus === 'loading') {
    return null;
  }

  const isSignedIn = authStatus === 'signedIn';

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
