import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import useColors from '../../Colors';

export function TitleRegister({link, texting, func}){

    const navigation = useNavigation();

    handleClic = () => {
        if(func) { func(); }
        else if(link) { navigation.navigate(link) }
    }

    const Colors = useColors();
    const styles = DynamicStyles(Colors);

    return(
        <View style={styles.titleRegister}>
            { (link || func) && 
                <Pressable onPress={ () => { handleClic() } } style={styles.topButton}>
                    <MaterialIcons name="keyboard-arrow-left" size={24} color={Colors.text} style={{opacity: 0.5,}} />
                    <Text style={{ color: Colors.text, opacity: 0.5, }}>{texting}</Text>
                </Pressable>
            }
            <View style={styles.titlecontent}>
                <Image source={{ uri: "https://yogamap.com.ar/assets/logo.png" }} style={styles.logo} />
                <Text style={styles.title}>YOGAmap</Text>
                <Text style={styles.subtitle}>Encontrá profes, escuelas, eventos y reuniones del mundo del yoga</Text>
            </View>
        </View>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
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
      marginTop: 32,
      marginBottom: 16,
      width: 75,
      height: 75,
    },
    title: {
        width: '100%',
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        color:Colors.text,
        marginBottom: 8,
    },
    subtitle: {
      color: Colors.text,
      opacity: 0.5,
      textAlign: 'center',
      marginHorizontal: 44,
      marginBottom: 32,
    },
});