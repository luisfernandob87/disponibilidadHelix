import {
  Button,
  StyleSheet,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const AgregarEmpleado = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [nombre, setNombre] = useState("");

  const [value, setValue] = useState("");
  const { getItem, setItem } = useAsyncStorage("token");

  const readItemFromStorage = async () => {
    const item = await getItem();
    setValue(item);
  };
  readItemFromStorage();

  const dataJson = {
    data: {
      nombreCompleto: nombre,
    },
  };
  const config = {
    headers: {
      Authorization: "Bearer " + value,
    },
  };
  const submit = () => {
    if (nombre == "") {
      Alert.alert("Ingrese el nombre del empleado");
    } else {
      setLoading(true);
      //
      console.log(config);
      console.log(dataJson);

      axios
        .post(
          "https://strapi-production-db11.up.railway.app/api/empleados",
          dataJson,
          config
        )
        .then((res) => console.log(res))
        .catch(function (error) {
          console.log(error);
        });
      setLoading(false);

      navigation.navigate("Menu");
    }
  };
  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={loading}
        size="large"
        color="#1976d2"
        style={{ marginTop: 30 }}
      />
      <TextInput
        style={styles.inputs}
        value={nombre}
        placeholder="Nombre Completo"
        onChangeText={setNombre}
      />
      <Button style={styles.btnSubmit} title="Crear" onPress={submit} />
    </View>
  );
};

export default AgregarEmpleado;

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
    width: 300,
    borderRadius: 10,
  },
});
