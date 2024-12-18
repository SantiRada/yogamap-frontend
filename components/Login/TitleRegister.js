import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export function TitleRegister({link, texting, func}){

    const navigation = useNavigation();

    handleClic = () => {
        if(func) { func(); }
        else if(link) { navigation.navigate(link) }
    }

    return(
        <View style={styles.titleRegister}>
            { (link || func) && 
                <Pressable onPress={ () => { handleClic() } } style={styles.topButton}>
                    <MaterialIcons name="keyboard-arrow-left" size={24} color='#fff' style={{opacity: 0.5,}} />
                    <Text style={{ color: '#fff', opacity: 0.5, }}>{texting}</Text>
                </Pressable>
            }
            <View style={styles.titlecontent}>
                <Image source={{ uri: "http://192.168.100.2/API_Yogamap/assets/logo.png" }} style={styles.logo} />
                <Text style={styles.title}>YOGAmap</Text>
                <Text style={styles.subtitle}>Encontrá profes, escuelas, eventos y reuniones del mundo del yoga</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    titleRegister: { paddingTop: 80, },
    topButton: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      top: 40,
      left: 0,
    },
    logo: {
      alignSelf: 'center',
      width: 75,
      height: 75,
    },
    title: {
        width: '100%',
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
      color: '#fff',
      opacity: 0.5,
      textAlign: 'center',
      marginHorizontal: 44,
      marginBottom: 32,
    },
});