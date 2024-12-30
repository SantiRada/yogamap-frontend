import { StyleSheet, View, ScrollView, Text, Pressable, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TitleRegister } from './TitleRegister';
import useColors from '../../Colors';

import * as ImagePicker from 'expo-image-picker';

export function ImageAndCertificateRegister({ reverse, advance, image, setImage, certificate, setCertificate }) {
    const askForPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('¡Permiso denegado!', 'Necesitas conceder permiso para acceder a la galería.');
            return false;
        }
        return true;
    };

    const pickImage = async (type) => {
        const hasPermission = await askForPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            if(type == "image"){
                setImage({
                    uri: result.assets[0].uri,
                    type: result.assets[0].type,
                    name: result.assets[0].fileName
                });
            }else{
                setCertificate({
                    uri: result.assets[0].uri,
                    type: result.assets[0].type,
                    name: result.assets[0].fileName
                });
            }
        } else {
            console.log('Usuario canceló la selección de imagen');
        }
    };

    const Colors = useColors();
    const styles = DynamicStyles(Colors);

    return (
        <View style={styles.container}>
            <TitleRegister func={reverse} texting="Tipo de Yoga y Practicantes" />
            <ScrollView>
                <Text style={styles.question}>Imagen de la Escuela/Profe</Text>
                <Text style={styles.aclaration}>Se recomienda seleccionar una imagen cuadrada.</Text>
                { image ?
                <View style={[styles.content, { marginBottom: 16 }]}>
                    <Pressable onPress={ () => pickImage("image") } style={styles.input}>
                        <Text style={styles.textInput}>Imagen Seleccionada</Text>
                        <View style={{flexDirection: 'row', gap: 8}}>
                            <MaterialIcons name='check' size={24} color='#22c74f' />
                            <MaterialIcons name='edit' size={24} color='#8C5BFF' />
                        </View>
                    </Pressable>
                    <View style={{justifyContent: 'center'}}>
                        <Image source={{ uri: image.uri }} style={styles.imgPreview} />
                    </View>
                </View> : 
                <View style={[styles.content, { marginBottom: 16 }]}>
                    <Pressable onPress={ () => pickImage("image") } style={styles.input}>
                        <Text style={styles.textInput}>Seleccionar Imagen</Text>
                        <MaterialIcons name='attach-file' size={24} color='#8C5BFF' />
                    </Pressable>
                </View>
                }
                <Text style={styles.question}>Certificado de Profesional</Text>
                <Text style={styles.aclaration}>Para validarte como profe/escuela debes subir un certificado que valide tu capacitación.</Text>
                { certificate ?
                <View style={styles.content}>
                    <Pressable onPress={ () => pickImage("certificate") } style={styles.input}>
                        <Text style={styles.textInput}>Certificado Seleccionado</Text>
                        <View style={{flexDirection: 'row', gap: 8}}>
                            <MaterialIcons name='check' size={24} color='#22c74f' />
                            <MaterialIcons name='edit' size={24} color='#8C5BFF' />
                        </View>
                    </Pressable>
                    <View style={{justifyContent: 'center'}}>
                        <Image source={{ uri: certificate.uri }} style={styles.imgPreview} />
                    </View>
                </View> :
                 <View style={styles.content}>
                    <Pressable onPress={ () => pickImage("certificate") } style={styles.input}>
                        <Text style={styles.textInput}>Seleccionar Certificado</Text>
                        <MaterialIcons name='attach-file' size={24} color='#8C5BFF' />
                    </Pressable>
                </View>
                }
                {(image && certificate) && 
                    <Pressable style={styles.btn} onPress={advance}>
                        <Text style={styles.textBtn}>Continuar</Text>
                    </Pressable>
                }
            </ScrollView>
        </View>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.background,
    },
    question: {
        fontSize: 18,
        color: '#fff',
    },
    aclaration: {
        fontSize: 14,
        opacity: 0.5,
        color: '#fff',
    },
    imgPreview: {
        width: 100,
        height: 100,
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#3C2C61',
        padding: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    textInput: {
        color: '#ffffff50',
        fontSize: 16,
    },
    btn: {
        backgroundColor: '#8C5BFF',
        height: 50,
        width: '100%',
        marginTop: 24,
        marginBottom: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    textBtn: {
        color: '#fff',
        fontSize: 16,
    },
});
