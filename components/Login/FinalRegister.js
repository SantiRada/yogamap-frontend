import { StyleSheet, View, Text, Pressable, Share, ToastAndroid } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColors } from '../../Colors';

import { TitleRegister } from './TitleRegister';
import { useNavigation } from '@react-navigation/native';

export function FinalRegister({prof}) {

    const navigation = useNavigation();

    const handleShare = async () => {
        try {
          const result = await Share.share({
            message: `¡Checkea mi perfil en la app de Yogamap! https://yogamap.com.ar/prof/index.php?id=${prof}`,
          });
    
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // Compartido en una actividad específica
            } else {
              // Compartido directamente
            }
          } else if (result.action === Share.dismissedAction) {
            // Compartir fue cancelado
          }
        } catch (error) {
          console.error('Error al compartir:', error.message);
        }

        // ToastAndroid.show('¡Enlace copiado!', ToastAndroid.SHORT);
    };

    const Colors = useColors();
    const styles = DynamicStyles(Colors);

    return (
        <View style={styles.container}>
            <TitleRegister />

            <Text style={{color: '#fff',textAlign:'center',fontSize:18,fontWeight:'bold'}}>¡Comparte el link a tu perfil!</Text>
            <Pressable style={[styles.btn, {width: '20%'}]} onPress={ () => { handleShare() } }>
                <MaterialIcons name="share" size={36} style={styles.textBtn} />
            </Pressable>

            <Pressable style={styles.btn} onPress={ () => { navigation.navigate('TabGroup') } }>
                <Text style={styles.textBtn}>Continuar</Text>
            </Pressable>
        </View>
    );
};

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems:'center',
      backgroundColor: Colors.background,
    },
    btn: {
        backgroundColor: '#8C5BFF',
        height: 50,
        width: '100%',
        marginTop: 24,
        marginBottom: 16,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBtn: {
        color: Colors.text,
        textAlign: 'center',
        fontSize: 16,
    },
});
  