import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Empleados = () => {
  const [loading, setLoading] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const navigation = useNavigation();

  const page = "https://llamadasdeatencionbackend-rucz-dev.fl0.io";

  useEffect(() => {
    getMultiple = async () => {
      let values;
      try {
        values = await AsyncStorage.multiGet(["token", "userName"]);
      } catch (e) { }
      const token = values[0][1];
      const config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      setLoading(true);
      axios
        .get(
          `${page}/api/empleados?filters[estado][$eq]=true`,
          config
        )
        .then((res) => setEmpleados(res.data.data))
        .catch(function (error) {
          console.log(error);
        });
      setLoading(false);
    };
    getMultiple();
  }, []);

  return (
    <>
      <TouchableOpacity>
        <Button
          title="Agregar Empleado"
          onPress={() => navigation.navigate("AgregarEmpleado")}
        />
      </TouchableOpacity>

      <FlatList
        data={empleados.sort((a, b) =>
          a.attributes.nombreCompleto.localeCompare(b.attributes.nombreCompleto)
        )}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.container}>
            <Text>Nombre: {item.attributes.nombreCompleto}</Text>
          </View>
        )}
      />
      <ActivityIndicator
        animating={loading}
        size="large"
        color="#1976d2"
        style={{
          alignContent: "center",
          flex: 4,
          alignItems: "center",
        }}
      />
    </>
  );
};

export default Empleados;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
    borderColor: "#a9a9a9",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 100,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#1976d2",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
