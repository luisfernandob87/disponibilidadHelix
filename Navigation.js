import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import Login from "./screens/Login";
import Menu from "./screens/Menu";

const AddStack = createNativeStackNavigator();

function MyStack() {
  return (
    <AddStack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerBackTitleStyle: false, headerShown: true }}
    >
      <AddStack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <AddStack.Screen
        name="Menu"
        component={Menu}
        options={{
          headerShown: false,
        }}
      />
    </AddStack.Navigator>
  );
}
export default function Navigation() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
