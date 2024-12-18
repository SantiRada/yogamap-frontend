import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { GiftedChat } from 'react-native-gifted-chat';
import { StatusBar, View, StyleSheet, Text, TextInput, TouchableOpacity, Image, Pressable, Alert, ActivityIndicator, Modal, ToastAndroid } from 'react-native';
import axios from 'axios';

import * as Clipboard from 'expo-clipboard';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { getUserID, getUserName } from './../../UserData';

export function ShowCommunity({ route }) {
  const { id } = route.params;
  const [data, setData] = useState([]);

  // MANEJO DE CONSOLE.LOG
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
  
    // Filtrar todos los mensajes que contienen 'GiftedChat'
    const filterLogs = (method, ...args) => {
      if (!args[0]?.toString().includes('GiftedChat')) {
        method(...args);
      }
    };
  
    console.log = (...args) => filterLogs(originalConsoleLog, ...args);
    console.warn = (...args) => filterLogs(originalConsoleWarn, ...args);
    console.error = (...args) => filterLogs(originalConsoleError, ...args);
  
    return () => {
      console.log = originalConsoleLog;
      console.warn = originalConsoleWarn;
      console.error = originalConsoleError;
    };
  }, []);

  // TRAER LA INFORMACIÓN DEL CHAT DESDE BASE DE DATOS
  useEffect(() => {
    const connection = async () => {
      try{
        const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/unique/chat.php', { id, }, { headers: { 'Content-Type': 'application/json' } });

        if (response.data.success) {
          if(response.data.chat){ setData(response.data.chat); }
          else { setData([]); }
        }
      } catch(error){
        console.log("Falló la conexión al servidor al intentar recuperar la comunidad...", error);
      }
    }

    connection();
  }, [id]);

  const navigation = useNavigation();

  // MANEJO DE DATOS DEL USUARIO
  const [idUser, setUserID] = useState('');
  const [userName, setUserName] = useState('');
  useEffect(() => {
    const connection = async () => {
      const USERID = await getUserID();
      const USERNAME = await getUserName();

      setUserID(USERID);
      setUserName(USERNAME);
    }

    connection();
  }, []);

  const [messages, setMessages] = useState([]); // Listado de mensajes
  const [text, setText] = useState(''); // Input del usuario

  // TRAER LOS MENSAJES DESDE BASE DE DATOS
  useEffect(() => {
    const connection = async () => {
      try{
        const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/messages.php', { id, }, { headers: { 'Content-Type': 'application/json' } });
  
        if (response.data.success) {
          if(response.data.conversation) {
            const formattedMessages = response.data.conversation.map((msg, index) => ({ ...msg, _id: msg._id || `${msg.iduser}-${index}-${Date.now()}` }));
            setMessages(formattedMessages);
          } else { setMessages([]); }
        }
      } catch (error) { console.log("Falló la conexión al servidor para encontrar las conversaciones... ", error); }
    }
  
    connection();
  }, [id]);  

  const dataIcon = data['icon'] ? ('http://192.168.100.2/API_Yogamap/assets/prof/' + data['icon']) : "http://192.168.100.2/API_Yogamap/assets/icon.png";

  // MANEJAR EL TOP.BAR
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Pressable style={styles.customHeader} onPress={ () => { navigation.navigate('DetailsCommunity', { id: data['id'] }) } }>
          <View style={{flexDirection: 'row', alignItems:'center', gap: 8}}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              style={styles.iconLeft}
              onPress={() => navigation.goBack()}
            />
            <Image source={{ uri: dataIcon }} style={styles.headerImg} />
            <View>
              <Text style={styles.headerTitle}>{data['name']}</Text>
              { data['name'] != data['nameProf'] &&
                <Text style={styles.headerSubtitle}>{data['nameProf']}</Text>
              }
            </View>
          </View>
        </Pressable>
      ),
    });
  }, [navigation, data]);

  const saveMessage = async (message) => {
    const dataMessage = {
      "idgroup": data['id'],
      "iduser": idUser,
      "content": message,
      "time": new Date().toTimeString().split(' ')[0],
      "pin": 0,
    };

    try{
      await axios.post('http://192.168.100.2/API_Yogamap/public/insert/message.php', { message: dataMessage }, { headers: { 'Content-Type': 'application/json' } });
    } catch(error){ console.log("Falló la conexión al intentar guardar los mensajes... ", error); }
  }

  // RENDERIZADO ----------------------
  const onSend = (newMessages = []) => {
    if (newMessages.length > 0) {
      const formattedMessages = newMessages.map((message) => ({
        _id: message._id || Math.random().toString(36).substring(7),
        iduser: idUser,
        name: userName,
        content: message.text,
        time: new Date().toTimeString().split(' ')[0],
        user: {
          _id: idUser,
          name: userName
        }
      }));
  
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, formattedMessages)
      );
  
      const messageToSave = newMessages[0].text;
      setText('');
      saveMessage(messageToSave);
    }
  };

  const renderMessage = (props) => {
    let { id, content, time, iduser, _id, name } = props.currentMessage;

    const times = time.split(':');
    time = times[0] + ":" + times[1];
    const isMyMessage = (iduser == idUser) ? true : false;

    return (
      <Pressable key={_id} style={[styles.message, isMyMessage ? styles.my : styles.other]} onLongPress={ () => { openModal(props.currentMessage) } }>
        { !isMyMessage && <Text style={styles.messageName}>{name}</Text> }
        <Text style={styles.messageText}>{content}</Text>
        <Text style={styles.messageTime}>{time}</Text>
      </Pressable>
    );
  };
  const renderInputToolbar = (props) => {
    return (
      <View style={styles.sectionInput}>
        { (data['type'] != 2 && data['type'] != 3) ?
        <>
          <TextInput
          style={styles.input}
          onChangeText={(text) => setText(text)}
          placeholder="Escribe un mensaje"
          placeholderTextColor='#ffffff50'
          value={text}
        />
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            if (text.trim().length > 0) {
              props.onSend({ text: text.trim() }, true);
              setText('');
            }
          }}
        >
          <MaterialIcons name="send" size={24} color='#fff' />
        </TouchableOpacity>
        </> : <Text style={styles.aclaration}>En esta comunidad solo pueden escribir los administradores.</Text>
        }
      </View>
    );
  };

  // INFORMACIÓN Y FUNCIONES DEL MODAL
  const [modalVisible, setModalVisible] = useState(false);
  const [modal, setModal] = useState({});

  const openModal = (messageData) => {
    let { content, time, iduser, _id, name } = messageData;

    const times = time.split(':');
    time = times[0] + ":" + times[1];

    const DATA = {
      "_id": _id,
      "iduser": iduser,
      "name": name,
      "content": content,
      "time": time,
    };

    setModal(DATA);
    setModalVisible(true);
  }
  const copyToClipboard = (content) => {
    Clipboard.setStringAsync(content);
    ToastAndroid.show('¡Texto copiado!', ToastAndroid.SHORT);
    setModalVisible(false);
  }
  const handleRemoveMessage = (_id, content, time) => {
    Alert.alert(
      "Confirmación Necesaria",
      "Si confirmas, se eliminará este mensaje para todos los integrantes.",
      [
        {
          text: "Cancelar",
        },
        {
          text: "Confirmar",
          onPress: () => removeMessage(_id, content, time),
        }
      ]
    );
  }
  const removeMessage = async (_id,content,time) => {
    try {
      const response = await axios.post('http://192.168.100.2/API_Yogamap/public/delete/message.php', { content, time }, { headers: { 'Content-Type': 'application/json' } });

      if (response.data.success) {
        setMessages(prevMessages => prevMessages.filter(msg => msg._id !== _id));
        setModalVisible(false);
        ToastAndroid.show('Mensaje eliminado.', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log("Falló la conexión al servidor al intentar eliminar un mensaje...", error);
  }
  }

  return (
    <View style={styles.container}>
      { data ?
      <>
        <StatusBar barStyle="light" backgroundColor="#0c0715" />
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{ id: idUser }}
          renderMessage={renderMessage}
          renderInputToolbar={renderInputToolbar}
        />
      </> : <ActivityIndicator size="large" color="#0c0715" /> }

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.overlay} onPress={() => setModalVisible(false)} />
          <View style={styles.bottomSheet}>
            <Pressable style={{paddingRight:8,paddingTop:8,alignSelf: 'flex-end'}} onPress={() => setModalVisible(false)}>
              <MaterialIcons name='close' size={24} color='#eee' />
            </Pressable>
            <View style={styles.sectionMessage}>
              <View style={[styles.message, styles.other, {alignSelf: 'center'}]}>
                <Text style={styles.messageName}>{modal['name']}</Text>
                <Text style={styles.messageText}>{modal['content']}</Text>
                <Text style={styles.messageTime}>{modal['time']}</Text>
              </View>
            </View>
            <View style={styles.sectionButtons}>

              <Pressable style={styles.option} onPress={ () => { copyToClipboard(modal['content']) } }>
                <MaterialIcons name="content-copy" size={24} color='#fff' />
                <Text style={styles.optionText}>Copiar texto</Text>
              </Pressable>

              { idUser == modal['iduser'] &&
                <Pressable style={styles.option} onPress={ () => { handleRemoveMessage(modal['_id'], modal['content'], modal['time']) } }>
                  <MaterialIcons name="delete" size={24} color='#ff2727' />
                  <Text style={[styles.optionText, {color:'#ff2727'}]}>Eliminar mensaje</Text>
                </Pressable>
              }
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: '4%',
    height: '100%',
    backgroundColor: '#1A122E',
    gap: 16,
  },
  customHeader: {
    height: 80,
    backgroundColor: '#0c0715',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconLeft: { color: '#fff', },
  headerImg: {
    borderRadius: 100,
    width: 40,
    height: 40,
    marginRight: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
  },
  headerSubtitle: {
    color: '#ffffff70',
    fontSize: 14,
  },
  iconRight: { color: '#fff', },
  message: {
    minWidth: 160,
    maxWidth: '80%',
    backgroundColor: '#3C2C61',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  other: {
    alignSelf: 'flex-start',
    backgroundColor: '#3C2C61',

  },
  my: {
    alignSelf: 'flex-end',
    backgroundColor: '#5f4a8e',
  },
  messageName: {
    color: '#5ff5e0aa',
    fontSize: 12,
    textAlign: 'left',
  },
  messageText: {
    textAlign: 'left',
    color: '#ffffffdd',
    fontSize: 16,
    paddingRight: 40,
  },
  messageTime: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#ffffff50',
    marginTop: -8,
  },
  sectionInput: {
    width: '100%',
    flexDirection: 'row',
    height: 60,
  },
  input: {
    flex: 1,
    backgroundColor: '#3C2C61',
    paddingHorizontal: 16,
    color: '#fff',
    borderRadius: 16,
  },
  btn: {
    backgroundColor: '#8C5BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    height: '100%',
    paddingHorizontal: 16,
    marginLeft: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#281d46',
    padding: 16,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    elevation: 5,
  },
  sectionMessage: {
    paddingBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ffffff20',
  },
  optionText: { color: '#fff', },
  aclaration: {
    width: '100%',
    textAlign: 'center',
    alignSelf: 'flex-end',
    color: '#ffffff50',
  }
});
