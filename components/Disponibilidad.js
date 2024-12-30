import { StyleSheet, View, Pressable, Text } from 'react-native';
import useColors from '../Colors';

export function Disponibilidad(){

    const Colors = useColors()
    const styles = DynamicStyles(Colors)

    return(
        <View style={styles.container}>
            <Pressable>

            </Pressable>
        </View>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        flex: 1,
    },

});