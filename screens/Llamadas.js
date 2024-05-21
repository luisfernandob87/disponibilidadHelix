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

const Llamadas = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleJefeInmediato, setModalVisibleJefeInmediato] =
    useState(false);
  const [modalVisibleRrhh, setModalVisibleRrhh] = useState(false);

  const [selected, setSelected] = useState("");
  const [selectedDepto, setSelectedDepto] = useState("");
  const [selectedPuesto, setSelectedPuesto] = useState("");
  const [selectedGrado, setSelectedGrado] = useState("");
  const [data, setData] = useState([]);
  const [dataDepto, setDataDepto] = useState([]);
  const [dataPuesto, setDataPuesto] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [compromiso, setCompromiso] = useState("");
  const [accionCorrectiva, setAccionCorrectiva] = useState("");
  const [proximoGrado, setProximoGrado] = useState("");
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const page = "https://llamadasdeatencionbackend-rucz-dev.fl0.io";

  const datosGrado = [
    { key: "Llamada de atención verbal", value: "Llamada de atención verbal" },
    {
      key: "Llamada de atención escrita",
      value: "Llamada de atención escrita",
    },
    { key: "Suspensión", value: "Suspensión" },
    { key: "Descuento día y séptimo", value: "Descuento día y séptimo" },
  ];

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
  const [dateImplementacion, setDateImplementacion] = useState(new Date());
  const [showPickerImplementacion, setShowPickerImplementacion] =
    useState(false);
  const [fechaImplementacion, setFechaImplementacion] = useState("");

  const toggleDateImplementacion = () => {
    setShowPickerImplementacion(!showPickerImplementacion);
  };
  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDateImplementacion(currentDate);
      if (Platform.OS == "android") {
        toggleDateImplementacion();
        setFechaImplementacion(currentDate.toDateString());
      }
    } else {
      toggleDateImplementacion();
    }
  };

  const diaImplementacion = moment(fechaImplementacion)
    .format("L")
    .substring(0, 2);
  const mesImplementacion = moment(fechaImplementacion)
    .format("L")
    .substring(3, 5);
  const anioImplementacion = moment(fechaImplementacion)
    .format("L")
    .substring(6, 11);

  const fechadeImplementacion = `${anioImplementacion}-${mesImplementacion}-${diaImplementacion}`;

  const [dateInicioCompromiso, setDateInicioCompromiso] = useState(new Date());
  const [showPickerInicioCompromiso, setShowPickerInicioCompromiso] =
    useState(false);
  const [fechaInicioCompromiso, setFechaInicioCompromiso] = useState("");

  const toggleDateInicioCompromiso = () => {
    setShowPickerInicioCompromiso(!showPickerInicioCompromiso);
  };
  const onChangeInicioCompromiso = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDateInicioCompromiso(currentDate);
      if (Platform.OS == "android") {
        toggleDateInicioCompromiso();
        setFechaInicioCompromiso(currentDate.toDateString());
      }
    } else {
      toggleDateInicioCompromiso();
    }
  };

  const diaInicioCompromiso = moment(fechaInicioCompromiso)
    .format("L")
    .substring(0, 2);
  const mesInicioCompromiso = moment(fechaInicioCompromiso)
    .format("L")
    .substring(3, 5);
  const anioInicioCompromiso = moment(fechaInicioCompromiso)
    .format("L")
    .substring(6, 11);

  const fechadeInicioCompromiso = `${anioInicioCompromiso}-${mesInicioCompromiso}-${diaInicioCompromiso}`;

  const [dateFinalCompromiso, setDateFinalCompromiso] = useState(new Date());
  const [showPickerFinalCompromiso, setShowPickerFinalCompromiso] =
    useState(false);
  const [fechaFinalCompromiso, setFechaFinalCompromiso] = useState("");

  const toggleDateFinalCompromiso = () => {
    setShowPickerFinalCompromiso(!showPickerFinalCompromiso);
  };
  const onChangeFinalCompromiso = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDateFinalCompromiso(currentDate);
      if (Platform.OS == "android") {
        toggleDateFinalCompromiso();
        setFechaFinalCompromiso(currentDate.toDateString());
      }
    } else {
      toggleDateFinalCompromiso();
    }
  };

  const diaFinalCompromiso = moment(fechaFinalCompromiso)
    .format("L")
    .substring(0, 2);
  const mesFinalCompromiso = moment(fechaFinalCompromiso)
    .format("L")
    .substring(3, 5);
  const anioFinalCompromiso = moment(fechaFinalCompromiso)
    .format("L")
    .substring(6, 11);

  const fechadeFinalCompromiso = `${anioFinalCompromiso}-${mesFinalCompromiso}-${diaFinalCompromiso}`;

  const submit = () => {
    if (
      selectedDepto == "" ||
      selected == "" ||
      selectedPuesto == "" ||
      selectedGrado == "" ||
      descripcion == "" ||
      accionCorrectiva == "" ||
      compromiso == "" ||
      firmaJefe == "" ||
      firmaRrhh == "" ||
      firmaColaborador == "" ||
      fechadeImplementacion == "" ||
      fechadeInicioCompromiso == "" ||
      fechadeFinalCompromiso == "" ||
      proximoGrado == ""
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
              grado: selectedGrado,
              descripcion: descripcion,
              accionCorrectiva: accionCorrectiva,
              compromiso: compromiso,
              creadoPor: usuario,
              firmaJefeInmediato: firmaJefe,
              firmaRrhh: firmaRrhh,
              firmaColaborador: firmaColaborador,
              fechaImplementacion: fechadeImplementacion,
              inicioCompromiso: fechadeInicioCompromiso,
              finalCompromiso: fechadeFinalCompromiso,
              proximoGrado: proximoGrado,
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
          FORMATO DE ASESORÍA PARA MEJORAR
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
        <View style={{ padding: 10 }}>
          <SelectList
            setSelected={setSelectedGrado}
            data={datosGrado}
            placeholder="Tipo de Llamada de Atención: "
            searchPlaceholder="Buscar"
          />
        </View>
        <TextInput
          style={styles.input}
          value={descripcion}
          placeholder="Descripción"
          onChangeText={setDescripcion}
        />

        <View style={styles.input}>
          {!showPickerImplementacion && (
            <Pressable onPress={toggleDateImplementacion}>
              <TextInput
                style={{ color: "black" }}
                value={
                  fechaImplementacion === ""
                    ? "Fecha de Implementación"
                    : moment(fechaImplementacion).format("L")
                }
                onChangeText={setFechaImplementacion}
                editable={false}
                placeholder="Fecha de Implementación"
              />
            </Pressable>
          )}
        </View>

        {showPickerImplementacion && (
          <DateTimePicker
            display="calendar"
            testID="dateTimePicker"
            value={dateImplementacion}
            mode="date"
            is24Hour={true}
            locale="es-ES"
            onChange={onChange}
          />
        )}
        <TextInput
          style={styles.input}
          value={accionCorrectiva}
          placeholder="Acción Correctiva"
          onChangeText={setAccionCorrectiva}
        />
        <TextInput
          style={styles.input}
          value={compromiso}
          placeholder="Compromiso"
          onChangeText={setCompromiso}
        />
        <TextInput
          style={styles.input}
          value={proximoGrado}
          placeholder="Próximo llamado de atención"
          onChangeText={setProximoGrado}
        />

        <View style={styles.input}>
          {!showPickerInicioCompromiso && (
            <Pressable onPress={toggleDateInicioCompromiso}>
              <TextInput
                style={{ color: "black" }}
                value={
                  fechaInicioCompromiso === ""
                    ? "Fecha de inicio de compromiso"
                    : moment(fechaInicioCompromiso).format("L")
                }
                onChangeText={setFechaInicioCompromiso}
                editable={false}
                placeholder="Fecha de inicio de compromiso"
              />
            </Pressable>
          )}
        </View>

        {showPickerInicioCompromiso && (
          <DateTimePicker
            display="calendar"
            testID="dateTimePicker"
            value={dateInicioCompromiso}
            mode="date"
            is24Hour={true}
            locale="es-ES"
            onChange={onChangeInicioCompromiso}
          />
        )}

        <View style={styles.input}>
          {!showPickerFinalCompromiso && (
            <Pressable onPress={toggleDateFinalCompromiso}>
              <TextInput
                style={{ color: "black" }}
                value={
                  fechaFinalCompromiso === ""
                    ? "Fecha de final de compromiso"
                    : moment(fechaFinalCompromiso).format("L")
                }
                onChangeText={setFechaFinalCompromiso}
                editable={false}
                placeholder="Fecha de final de compromiso"
              />
            </Pressable>
          )}
        </View>

        {showPickerFinalCompromiso && (
          <DateTimePicker
            display="calendar"
            testID="dateTimePicker"
            value={dateFinalCompromiso}
            mode="date"
            is24Hour={true}
            locale="es-ES"
            onChange={onChangeFinalCompromiso}
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

export default Llamadas;

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
