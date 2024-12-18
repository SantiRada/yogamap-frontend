import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Pressable, Image, Text } from 'react-native';

import { VoidEvent } from './Void/VoidEvent';
import { getProfID } from './../ProfData';
import { FavItems } from './FavItems';

export function FeedEvent({ dataEvent }){

    const idProf = getProfID() ?? null;

    const navigation = useNavigation();
    let data = dataEvent;

    return(
        <View style={styles.listEvent}>
            { data.length > 0 ? 
                data.map((item, index) => (
                    <Pressable key={index} style={styles.event} onPress={ () => { navigation.navigate('ShowEvent', {id: item.id, idProf: idProf}) } }>
                        <View style={styles.sectorTitle}>
                            <Pressable style={styles.sectorProf} onPress={ () => { navigation.navigate('ShowProf', { id: item.profId } ) } }>
                                <Image source={{ uri: item.imgProf ? ("http://192.168.100.2/API_Yogamap/assets/prof/" + item.imgProf) : "http://192.168.100.2/API_Yogamap/assets/icon.png" }} style={styles.profImage} />
                                <Text style={styles.profName}>{item.nameProf}</Text>
                            </Pressable>
                            <FavItems id={item.id} type="event" />
                        </View>
                        <View style={styles.sectorImg}>
                            <Image source={{ uri: "http://192.168.100.2/API_Yogamap/assets/events/" + item.image }} style={styles.imgEvent} />
                            <View style={styles.filter}></View>
                            <View style={styles.sectorText}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.desc}>{item.themes}</Text>
                            </View>
                        </View>
                    </Pressable>
                )) : 
                <VoidEvent voidData={true} />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    listEvent: {
        flexDirection: 'column',
        gap: 8,
        paddingVertical: 16,
        marginBottom: 16,
    },
    event: {
        gap: 8,
        marginBottom: 16,
    },
    sectorTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 16,
    },
    sectorProf: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    profImage: {
        width: 35,
        height: 35,
    },
    profName: {
        fontSize: 16,
        color: '#fff',
    },
    sectorImg: {
        position: 'relative',
    },
    imgEvent: {
        width: '100%',
        height: 210,
        borderRadius: 8,
    },
    filter: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#00000060',
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    sectorText: {
        position: 'absolute',
        bottom: 16,
        left: 16,
    },
    title:{
        color: '#fff',
        fontSize: 18,
    },
    desc: { color: '#ffffffac' },
});