import {
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  View,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage, {
  useAsyncStorage,
} from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import moment from "moment/moment";
import "moment/locale/es";
import { SelectList } from "react-native-dropdown-select-list";
import Signature from "react-native-signature-canvas";
import DateTimePicker from "@react-native-community/datetimepicker";

const EntradasTarde = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleJefeInmediato, setModalVisibleJefeInmediato] =
    useState(false);
  const [modalVisibleRrhh, setModalVisibleRrhh] = useState(false);

  const [selected, setSelected] = useState("");
  const [selectedDepto, setSelectedDepto] = useState("");
  const [selectedPuesto, setSelectedPuesto] = useState("");
  const [data, setData] = useState([]);
  const [dataDepto, setDataDepto] = useState([]);
  const [dataPuesto, setDataPuesto] = useState([]);
  const [scrollEnabled, setScrollEnabled] = useState(false);

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
      axios
        .get(
          `${page}/api/empleados?filters[estado][$eq]=true`,
          config
        )
        .then((res) => {
          let newArray = res.data.data.map((item) => {
            return { key: item.id, value: item.attributes.nombreCompleto };
          });
          setData(newArray);
        })
        .catch(function (error) {
          console.log(error);
        });
      axios
        .get(
          `${page}/api/departamentos?filters[estado][$eq]=true`,
          config
        )
        .then((res) => {
          let newArray = res.data.data.map((item) => {
            return { key: item.id, value: item.attributes.descripcion };
          });
          setDataDepto(newArray);
        })
        .catch(function (error) {
          console.log(error);
        });
      axios
        .get(
          `${page}/api/puestos?filters[estado][$eq]=true`,
          config
        )
        .then((res) => {
          let newArray = res.data.data.map((item) => {
            return { key: item.id, value: item.attributes.descripcion };
          });
          setDataPuesto(newArray);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    getMultiple();
  }, []);

  const [firmaColaborador, setFirmaColaborador] = useState("");
  const [firmaJefe, setFirmaJefe] = useState("");
  const [firmaRrhh, setFirmaRrhh] = useState("");
  const [value, setValue] = useState("");
  const { getItem, setItem } = useAsyncStorage("token");

  const readItemFromStorage = async () => {
    const item = await getItem();
    setValue(item);
  };
  readItemFromStorage();

  const config = {
    headers: {
      Authorization: "Bearer " + value,
    },
  };

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [hora, setHora] = useState("");

  const toggleDate = () => {
    setShowPicker(!showPicker);
  };
  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS == "android") {
        toggleDate();
        setHora(currentDate);
      }
    } else {
      toggleDate();
    }
  };

  const entradaTarde = moment(date).format("HH:mm:ss");

  const fechaCreacion = moment(new Date()).format("YYYY-MM-DD");

  const submit = () => {
    if (
      selectedDepto == "" ||
      selected == "" ||
      selectedPuesto == "" ||
      firmaJefe == "" ||
      firmaRrhh == "" ||
      firmaColaborador == "" ||
      entradaTarde == ""
    ) {
      Alert.alert("Por favor llenar toda la información que se solicita");
    } else {
      setLoading(true);
      getMyObject = async () => {
        try {
          const usuario = await AsyncStorage.getItem("userName");
          const dataJson = {
            data: {
              departamento: {
                id: selectedDepto,
              },
              empleado: {
                id: selected,
              },
              puesto: {
                id: selectedPuesto,
              },
              grado: "Llegada tarde",
              descripcion: "Llegada tarde",
              accionCorrectiva: data.accionCorrectiva,
              compromiso: data.compromiso,
              creadoPor: usuario,
              firmaJefeInmediato: firmaJefe,
              firmaRrhh: firmaRrhh,
              firmaColaborador: firmaColaborador,
              fechaImplementacion: fechaCreacion,
              inicioCompromiso: data.inicioCompromiso,
              finalCompromiso: data.finalCompromiso,
              proximoGrado: data.proximoGrado,
              entradaTarde: entradaTarde,
            },
          };
          axios
            .post(
              `${page}/api/llamadade-atencions`,
              dataJson,
              config
            )
            .then((res) => console.log(res))
            .catch(function (error) {
              console.log(error);
            });
        } catch (e) { }
      };
      getMyObject();
      setLoading(false);
      navigation.navigate("Menu");
    }
  };

  const fecha = moment(new Date()).format("DD/MM/YYYY");

  return (
    <>
      <ScrollView style={{ marginLeft: 10, marginRight: 10 }}>
        <Text style={{ padding: 10, textAlign: "center" }}>
          FORMATO DE ENTRADA TARDE
        </Text>
        <Text style={{ padding: 10 }}>Fecha: {fecha}</Text>
        <View style={{ padding: 10 }}>
          <SelectList
            setSelected={setSelected}
            data={data}
            placeholder="Nombre colaborador (a):"
            searchPlaceholder="Buscar"
          />
        </View>
        <View style={{ padding: 10 }}>
          <SelectList
            setSelected={setSelectedDepto}
            data={dataDepto}
            placeholder="Departamento:"
            searchPlaceholder="Buscar"
          />
        </View>
        <View style={{ padding: 10 }}>
          <SelectList
            setSelected={setSelectedPuesto}
            data={dataPuesto}
            placeholder="Puesto:"
            searchPlaceholder="Buscar"
          />
        </View>
        <View style={styles.input}>
          {!showPicker && (
            <Pressable onPress={toggleDate}>
              <TextInput
                style={{ color: "black" }}
                value={
                  hora === ""
                    ? "Hora de entrada tarde"
                    : moment(hora).format("HH:mm")
                }
                onChangeText={setHora}
                editable={false}
                placeholder="Hora de entrada tarde"
              />
            </Pressable>
          )}
        </View>

        {showPicker && (
          <DateTimePicker
            display="default"
            testID="dateTimePicker"
            value={date}
            mode="time"
            is24Hour={true}
            locale="es-ES"
            onChange={onChange}
          />
        )}

        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Firma Colaborador</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Cerrar</Text>
                </Pressable>
                <ScrollView scrollEnabled={scrollEnabled}>
                  <View
                    style={{
                      height: 350,
                      width: 400,
                      alignItems: "center",
                    }}
                  >
                    <Signature
                      onOK={(img) => (
                        setFirmaColaborador(img), setModalVisible(!modalVisible)
                      )}
                      onBegin={() => setScrollEnabled(false)}
                      onEnd={() => setScrollEnabled(true)}
                      descriptionText="Firma Colaborador"
                      clearText="Borrar"
                      confirmText="Guardar"
                      imageType="image/png"
                      dotSize="0.5"
                    />
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
          <View style={styles.containerButton}>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.textStyle}>Firma Colaborador</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleJefeInmediato}
            onRequestClose={() => {
              setModalVisibleJefeInmediato(!modalVisibleJefeInmediato);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Firma Jefe Inmediato</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() =>
                    setModalVisibleJefeInmediato(!modalVisibleJefeInmediato)
                  }
                >
                  <Text style={styles.textStyle}>Cerrar</Text>
                </Pressable>
                <ScrollView scrollEnabled={scrollEnabled}>
                  <View
                    style={{
                      height: 350,
                      width: 400,
                      alignItems: "center",
                    }}
                  >
                    <Signature
                      onOK={(img) => (
                        setFirmaJefe(img),
                        setModalVisibleJefeInmediato(!modalVisibleJefeInmediato)
                      )}
                      onBegin={() => setScrollEnabled(false)}
                      onEnd={() => setScrollEnabled(true)}
                      descriptionText="Firma Jefe Inmediato"
                      clearText="Borrar"
                      confirmText="Guardar"
                      imageType="image/png"
                      dotSize="0.5"
                    />
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
          <View style={styles.containerButton}>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => setModalVisibleJefeInmediato(true)}
            >
              <Text style={styles.textStyle}>Firma Jefe Inmediato</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleRrhh}
            onRequestClose={() => {
              setModalVisibleRrhh(!modalVisibleRrhh);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Firma RRHH o Testigo</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisibleRrhh(!modalVisibleRrhh)}
                >
                  <Text style={styles.textStyle}>Cerrar</Text>
                </Pressable>
                <ScrollView scrollEnabled={scrollEnabled}>
                  <View
                    style={{
                      height: 350,
                      width: 400,
                      alignItems: "center",
                    }}
                  >
                    <Signature
                      onOK={(img) => (
                        setFirmaRrhh(img),
                        setModalVisibleRrhh(!modalVisibleRrhh)
                      )}
                      onBegin={() => setScrollEnabled(false)}
                      onEnd={() => setScrollEnabled(true)}
                      descriptionText="Firma RRHH o Testigo"
                      clearText="Borrar"
                      confirmText="Guardar"
                      imageType="image/png"
                      dotSize="0.5"
                    />
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
          <View style={styles.containerButton}>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => setModalVisibleRrhh(true)}
            >
              <Text style={styles.textStyle}>Firma RRHH o Testigo</Text>
            </Pressable>
          </View>
          <ActivityIndicator
            animating={loading}
            size="large"
            color="#1976d2"
            style={{ marginTop: 10, marginBottom: 10 }}
          />
        </View>
      </ScrollView>
      <Button onPress={submit} title="Crear"></Button>
    </>
  );
};

export default EntradasTarde;

const styles = StyleSheet.create({
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
    height: 500,
    width: 400,
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
    marginLeft: 10,
    marginRight: 10,
  },
  containerButton: {
    width: "100%",
  },
  buttonOpen: {
    backgroundColor: "#1976d2",
  },
  buttonClose: {
    backgroundColor: "#1976d2",
    marginBottom: 10,
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
  input: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 10,
  },
});
