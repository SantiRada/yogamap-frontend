import { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getProfID, profData } from './../ProfData'; // Modificar aquí
import axios from 'axios';

import { ListNotification } from '../components/List/ListNotification';

const Top = createMaterialTopTabNavigator();

export function TopTab() {
    const [hasFormation, setHasFormation] = useState(false);

    const Colors = useColors()
    const styles = DynamicStyles(Colors)

    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('https://yogamap.com.ar/public/select/formacionesperprof.php', { id: getProfID() }, { headers: { 'Content-Type': 'application/json' } });
                
                if (response.data.success) { setHasFormation(true); }
                else { setHasFormation(false); }
            } catch (error) {
                console.log("Falló la conexión al servidor...", error);
            }
        }

        connection();
    }, []);

    return (
        <Top.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#1A122E',
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarLabelStyle: {
                    textTransform: 'capitalize',
                    fontSize: 16,
                },
                tabBarIndicatorStyle: {
                    height: 4,
                    borderRadius: 8,
                    backgroundColor: '#3C2C61',
                },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#ccc',
            }}
        >
            <Top.Screen name="Todas" children={() => <ListNotification type={1} />} />
            <Top.Screen name="Clases" children={() => <ListNotification type={2} />} />
            {hasFormation && <Top.Screen name="Formaciones" children={() => <ListNotification type={3} />} />}
        </Top.Navigator>
    );
}

export function Notifications() {
    const [isLoading, setIsLoading] = useState(true);
    const [profId, setProfId] = useState(null);

    useEffect(() => {
        const loadProfData = async () => {
            const data = await profData();
            if (data) { setProfId(getProfID()); }
            setIsLoading(false);
        }

        loadProfData();
    }, []);

    if (isLoading) { return <ActivityIndicator size="large" color="#ffffff" />; }



    return (
        <View style={styles.container}>
            {profId ? <TopTab /> : <ListNotification type={1} />}
        </View>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1A122E',
        gap: 16,
    },
});