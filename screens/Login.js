import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import logo from "../assets/icasa_logo.png";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
 
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const data = {
    username: usuario,
    password: password,
  };
 
  AsyncStorage.clear();
 
  const page = "https://servicedesk-dev-is.onbmc.com";
 
  const submit = () => {
    if (usuario == "" || password == "") {
      Alert.alert("Ingrese usuario y contraseña");
    } else {
      setLoading(true);
      axios
        .post(
          `${page}/api/jwt/login`,
          data,  {headers: {
            'Accept': '*/*',
            'X-Requested-By': 'XMLHttpRequest',
            'content-type': 'application/x-www-form-urlencoded'
          }}
        )
        .then((res) => {
          const usr = ["username", usuario];
          const tkn = ["token", res.data];
          try {
            AsyncStorage.multiSet([usr, tkn]);
          } catch (error) {

          }
          navigation.navigate("Menu");


        }
      )
        .catch(function (error) {
          console.log(error);
          Alert.alert("Contraseña o usuario incorrecto comuniquese con el Administrador");
        });
    }
    setLoading(false);
    setPassword("");

  };
  return (
    <View style={styles.container}>
      <Image source={logo} />
      <TextInput
        style={styles.inputs}
        value={usuario}
        placeholder="Usuario"
        onChangeText={setUsuario}
      />
      <TextInput
        style={styles.inputs}
        value={password}
        secureTextEntry={true}
        placeholder="Contraseña"
        onChangeText={setPassword}
      />
      <Button style={styles.btnSubmit} title="Acceder" onPress={submit} />
      <ActivityIndicator
        animating={loading}
        size="large"
        color="#1976d2"
        style={{ marginTop: 30 }}
      />
    </View>
  );
};
 
export default Login;
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnSubmit: {
    backgroundColor: "#1976d2",
  },
  inputs: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
});