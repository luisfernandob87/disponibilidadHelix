import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import Login from "./screens/Login";
import Menu from "./screens/Menu";
import EntradasTarde from "./screens/EntradasTarde";
import Llamadas from "./screens/Llamadas";

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
      <AddStack.Screen
        name="Llamadas"
        component={Llamadas}
        options={{
          title: "Registrar Llamada de Atención",
          headerTitleAlign: "center",
          headerTintColor: "#1976d2",
        }}
      />
      <AddStack.Screen
        name="EntradasTarde"
        component={EntradasTarde}
        options={{
          title: "Registrar Entrada Tarde",
          headerTitleAlign: "center",
          headerTintColor: "#1976d2",
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
