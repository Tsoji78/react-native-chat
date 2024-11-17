import React, { useState, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, ActivityIndicator, Text } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { MenuProvider } from "react-native-popup-menu";
import { AuthenticatedUserProvider, AuthenticatedUserContext } from "./contexts/AuthenticatedUserContext";
import { UnreadMessagesProvider, UnreadMessagesContext } from "./contexts/UnreadMessagesContext";

// Import your screens here...

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { unreadCount, setUnreadCount } = useContext(UnreadMessagesContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = route.name === 'Chats' ? 'chatbubbles' : 'settings';
          iconName += focused ? '' : '-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        presentation: 'modal',
      })}
    >
      <Tab.Screen 
        name="Chats" 
        options={{ 
          tabBarBadge: unreadCount > 0 ? unreadCount : null,
          tabBarBadgeStyle: { backgroundColor: colors.primary }
        }}
      >
        {() => <Chats setUnreadCount={setUnreadCount} />}
      </Tab.Screen>
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
    <Stack.Screen
      name="Chat"
      component={Chat}
      options={({ route }) => ({
        headerTitle: () => <ChatHeader chatName={route.params?.chatName} chatId={route.params?.id} />,
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ChatMenu chatName={route.params?.chatName} chatId={route.params?.id} />
          </View>
        ),
      })}
    />
    {/* Other screen configurations... */}
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      cardStyle: { backgroundColor: '#fff' }
    }}
  >
    <Stack.Screen name='Login' component={Login} />
    <Stack.Screen name='SignUp' component={SignUp} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure Firebase is initialized before setting up the auth listener
    if (!auth) {
      setError('Firebase auth not initialized');
      setIsLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        try {
          setUser(authenticatedUser || null);
          setIsLoading(false);
        } catch (err) {
          setError(err.message);
          setIsLoading(false);
        }
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );

    return unsubscribeAuth;
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', textAlign: 'center' }}>
          Error initializing app: {error}
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <MenuProvider>
      <AuthenticatedUserProvider>
        <UnreadMessagesProvider>
          <RootNavigator />
        </UnreadMessagesProvider>
      </AuthenticatedUserProvider>
    </MenuProvider>
  );
};

export default App;