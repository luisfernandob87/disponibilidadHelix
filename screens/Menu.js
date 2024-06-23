import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import on from "../assets/toggle-right.png";
import off from "../assets/toggle-left.png";
import salida from "../assets/salida.png";
import AsyncStorage, {
  useAsyncStorage,
} from "@react-native-async-storage/async-storage";
import axios from "axios";


const Menu = () => {
  const navigation = useNavigation();

  const [value, setValue] = useState("value");
  const { getItem, setItem } = useAsyncStorage("username");
  const [usuario, setUsuario] = useState("");
  const [enable, setEnable] = useState(false);
  const [personId, setPersonId] = useState("");


  const readItemFromStorage = async () => {
    const item = await getItem();
    setValue(item);
  };

  const page = "https://servicedesk-dev-is.onbmc.com";

  useEffect(() => {
    readItemFromStorage();
    getMultiple = async () => {
      let values;
      try {
        values = await AsyncStorage.multiGet(["token", "username"]);
      } catch (e) { }
      const token = values[0][1];
      const username = values[1][1];

      const config = {
        headers: {
          Authorization:  token,
        },
      };
      axios
        .get(
          `${page}/api/arsys/v1.0/entry/CTM:People?fields=values(Person ID, Remedy Login ID, Profile Status, Full Name, Corporate E-Mail, Assignment Availability)&q=%27Remedy%20Login%20ID%27%3D%20%22${username}%22`,
          config
        )
        .then((res) => 
          {
            let tmpUsr = res.data.entries[0].values['Full Name'];
            setUsuario(tmpUsr)

            let tmpStatus = (res.data.entries[0].values['Assignment Availability']);

            let tmpPersonId = res.data.entries[0].values['Person ID']

            setPersonId(tmpPersonId)


               if (tmpStatus == 'Yes') {
                  setEnable(true)
                }          
        }
      )
        .catch(function (error) {
          console.log(error);
        });
      
    };
    getMultiple();

  }, [enable]);
  
  const btnSalida = () => {
    AsyncStorage.clear();
    navigation.navigate("Login");
  };

  const habilitarDeshabilitar = () => {
    readItemFromStorage();
    getMultiple = async () => {
      let values;
      try {
        values = await AsyncStorage.multiGet(["token", "username"]);
      } catch (e) { }
      const token = values[0][1];

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      };

      const habilitar = JSON.stringify({
        "values": {
          "Assignment Availability":"Yes"
        }
      })
      const deshabilitar = JSON.stringify({
        "values": {
          "Assignment Availability":"No"
        }
      })

      if (enable == false) {
        axios
        .put(`${page}/api/arsys/v1.0/entry/CTM:People/${personId}`,
         habilitar, config
        )
        .then((res) => 
          {
          console.log("ok"+res)
          setEnable(true)
        }
      )
        .catch(function (error) {
          console.log(error);
        });
      } else {
        axios
        .put(`${page}/api/arsys/v1.0/entry/CTM:People/${personId}`,
         deshabilitar, config
        )
        .then((res) => 
          {
          console.log("ok"+res)
          setEnable(false)
        }
      )
        .catch(function (error) {
          console.log(error);
        });
      }
     
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
          padding: 0,
        }}
        onPress={() => habilitarDeshabilitar()}
      >
        <Image        
          source={enable ? on : off}
          style={{ aspectRatio: 0.6, resizeMode: "contain" }}
        />
        <Text style={styles.texto}>{enable ? 'Deshabilitar' : 'Habilitar'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flex: 4,
          alignItems: "center",
          marginTop: "50%",
          maxHeight: 135,
        }}
        onPress={btnSalida}
      >
        <Image
          source={salida}
          style={{ aspectRatio: 0.6, resizeMode: "contain" }}
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
