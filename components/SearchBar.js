import { View, StyleSheet, Pressable, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import useColors from '../Colors';

export function SearchBar({ text,setStateSearch }){

    const navigation = useNavigation();

    const clickSearchbar = () => {

        if(setStateSearch) { setStateSearch(true); }
        else { navigation.navigate('Buscar'); }

    }

    const Colors = useColors();
    const styles = DynamicStyles(Colors);

    return(
        <View style={ styles.container }>
            <Pressable style={styles.input} onPress={ () => { clickSearchbar() } }>
                <MaterialIcons style={styles.icon} name="search" size={24} color="black" />
                <Text style={styles.text}>{text}</Text>
            </Pressable>
        </View>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: { 
        position: 'relative',
        marginBottom: 16,
    },
    icon: {
        position: 'absolute',
        zIndex: 5,
        top: 12,
        left: 12,
        color: Colors.headerIcons,
    },
    input: {
        color: '#fff',
        fontSize: 16,
        backgroundColor: Colors.inputBG,
        padding: 14,
        paddingLeft: (16+28),
        borderRadius: 12,
    },
    text: { color: Colors.placeholder, },
});