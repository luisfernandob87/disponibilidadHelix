import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import time from "../assets/time.png";
import llamada from "../assets/llamada.png";
import salida from "../assets/salida.png";
import AsyncStorage, {
  useAsyncStorage,
} from "@react-native-async-storage/async-storage";

const Menu = () => {
  const navigation = useNavigation();

  const [value, setValue] = useState("value");
  const { getItem, setItem } = useAsyncStorage("userName");

  const readItemFromStorage = async () => {
    const item = await getItem();
    setValue(item);
  };
  useEffect(() => {
    readItemFromStorage();
  }, []);

  const usuario = value.replace(".", " ");

  const btnSalida = () => {
    AsyncStorage.clear();
    navigation.navigate("Login");
  };

  return (
    <View
      style={{
        flex: 1,
        alignSelf: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flex: 2,
          alignItems: "center",
          marginTop: "30%",
          maxHeight: 30,
        }}
      >
        <Text>Bienvenid@ 👋 {usuario}</Text>
      </View>
      <TouchableOpacity
        style={{
          flex: 3,
          alignItems: "center",
          marginTop: "10%",
          maxHeight: 135,
        }}
        onPress={() => navigation.navigate("EntradasTarde")}
      >
        <Image
          source={time}
          style={{ aspectRatio: 0.6, resizeMode: "contain" }}
        />
        <Text style={styles.texto}>Entradas Tarde</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flex: 4,
          alignItems: "center",
          marginTop: "10%",
          maxHeight: 135,
        }}
        onPress={() => navigation.navigate("Llamadas")}
      >
        <Image
          source={llamada}
          style={{ aspectRatio: 0.6, resizeMode: "contain" }}
        />
        <Text style={styles.texto}>Llamadas de Atención Administrativas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flex: 5,
          alignItems: "center",
          marginTop: "10%",
          maxHeight: 135,
        }}
        onPress={btnSalida}
      >
        <Image
          source={salida}
          style={{ aspectRatio: 0.4, resizeMode: "contain" }}
        />
        <Text style={styles.texto}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  texto: { textAlign: "center" },
});
