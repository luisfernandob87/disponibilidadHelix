import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import time from "../assets/time.png";
import llamada from "../assets/llamada.png";
import salida from "../assets/salida.png";
import AsyncStorage, {
  useAsyncStorage,
} from "@react-native-async-storage/async-storage";
import axios from "axios";

const Menu = () => {
  const navigation = useNavigation();

  const [value, setValue] = useState("value");
  const { getItem, setItem } = useAsyncStorage("userName");

  const readItemFromStorage = async () => {
    const item = await getItem();
    setValue(item);
  };

  const page = "https://servicedesk-dev-is.onbmc.com";

  useEffect(() => {
    readItemFromStorage();
  }, []);

  const usuario = value.replace(".", " ");

  const btnSalida = () => {
    AsyncStorage.clear();
    navigation.navigate("Login");
  };

  const habilitarDeshabilitar = () => {
    getMultiple = async () => {
      let values;
      try {
        values = await AsyncStorage.multiGet(["token", "userName"]);
      } catch (e) { }
      const token = values[0][1];
      const userName = values[1][1];
      console.log(token);
      console.log(userName);

      const config = {
        headers: {
          Authorization: + token,
        },
      };
      axios
        .get(
          `${page}/api/arsys/v1.0/entry/CTM:People?fields=values(Person ID, Remedy Login ID, Profile Status, Full Name, Corporate E-Mail, Assignment Availability)&q=%27Remedy%20Login%20ID%27%3D%20%22${userName}%22`,
          config
        )
        .then((res) => console.log(res)

        //   {
        //   let newArray = res.data.data.map((item) => {
        //     return { key: item.id, value: item.attributes.nombreCompleto };
        //   });
        //   setData(newArray);

        // }
      )
        .catch(function (error) {
          console.log(error);
        });
      
    };
    getMultiple();
  }

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
        onPress={() => habilitarDeshabilitar()}
      >
        <Image
          source={time}
          style={{ aspectRatio: 0.6, resizeMode: "contain" }}
        />
        <Text style={styles.texto}>Habilitar o Deshabilitar</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
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
      </TouchableOpacity> */}
      <TouchableOpacity
        style={{
          flex: 4,
          alignItems: "center",
          marginTop: "20%",
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
