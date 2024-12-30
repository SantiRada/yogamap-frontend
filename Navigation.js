import { StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Home } from './screen/Home';
import { Buscar } from './screen/Buscar';
import { Eventos } from './screen/Eventos';
import { Chat } from './screen/Chat';
import { Perfil } from './screen/Perfil';

import { Notifications } from './screen/Notifications';
import { Configuration } from './screen/Configuration';
import { WayClass } from './screen/WayClass';

import { ShowNotification } from './components/Show/ShowNotification';
import { ShowEvent } from './components/Show/ShowEvent';
import { ShowTypeOfYoga } from './components/Show/ShowTypeOfYoga';
import { ShowProf } from './components/Show/ShowProf';
import { ShowCommunity } from './components/Show/ShowCommunity';
import { ShowFormacion } from './components/Show/ShowFormacion';
import { DetailsCommunity } from './components/DetailsCommunity';

import { Ayuda } from './components/Configuration/Ayuda';
import { InfoApp } from './components/Configuration/InfoApp';
import { Notificaciones } from './components/Configuration/Notificaciones';
import { Cuenta } from './components/Configuration/Cuenta';

import { EditCommunity } from './components/Edit/EditCommunity';
import { EditProf } from './components/Edit/EditProf';
import { EditEvent } from './components/Edit/EditEvent';
import { EditTypeOfYoga } from './components/Edit/EditTypeOfYoga';
import { EditPublicProfile } from './components/Edit/EditPublicProfile';

import { DatosPersonales } from './components/Edit/DatosPersonales';
import { Horarios } from './components/Edit/Horarios';
import { Fotos } from './components/Edit/Fotos';
import { Precios } from './components/Edit/Precios';
import { Ubicacion } from './components/Edit/Ubicacion';
import useColors from './Colors';

import { Start } from './components/Login/Start';
import { Login } from './components/Login/Login';
import { Register } from './components/Login/Register';
import { Onboarding } from './components/Login/Onboarding';
import { RegisterProf } from './components/Login/RegisterProf';

import { CreateEvent } from './components/Create/CreateEvent';
import { CreateFormacion } from './components/Create/CreateFormacion';

// Stack Navigator
const Stack = createNativeStackNavigator();

// Tab Navigator
const Tab = createBottomTabNavigator();

function TabGroup(){

    const Colors = useColors()
    const styles = DynamicStyles(Colors);

    return(
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused}) => {
                    let iconName;
                    if(route.name == "Inicio"){ iconName = "home"; }
                    else if(route.name == "Buscar"){ iconName = "search"; }
                    else if(route.name == "Eventos"){ iconName = "calendar-month"; }
                    else if(route.name == "Chat"){ iconName = "chat"; }
                    else if(route.name == "Perfil"){ iconName = "person"; }

                    return (<MaterialIcons name={iconName} color={focused ? Colors.text : Colors.ligthText} size={30} />);
                },
                tabBarLabel: ({focused}) => (
                    <Text style={{ color:focused?Colors.text: Colors.ligthText, fontSize: 12, }}>
                        {route.name}
                    </Text>
                ),
                tabBarStyle: {
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                    backgroundColor: Colors.navBar,
                },
                headerStyle: { backgroundColor: Colors.background },
                headerTitleStyle:{ color: Colors.text },
            })}
        >
            <Tab.Screen name="Inicio" component={Home} />
            <Tab.Screen name="Buscar" component={Buscar} />
            <Tab.Screen name="Eventos" component={Eventos} />
            <Tab.Screen name="Chat" component={Chat} />
            <Tab.Screen name="Perfil" component={Perfil} />
        </Tab.Navigator>
    );
}

function StackGroup(){

    const Colors = useColors()
    const styles = DynamicStyles(Colors);

    return(
        <Stack.Navigator
            initialRouteName={"Start"}
            >
            <Stack.Screen
                name="Start"
                component={Start}
                options={() => ({
                    animationEnabled: true,
                    headerShown: false,
                    lazy: false,
                    animation: 'slide_from_right',
                })}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={() => ({
                    animationEnabled: true,
                    headerShown: false,
                    lazy: false,
                    animation: 'slide_from_right',
                })}
            />
            <Stack.Screen
                name="Register"
                component={Register}
                options={() => ({
                    animationEnabled: true,
                    headerShown: false,
                    lazy: false,
                    animation: 'slide_from_right',
                })}
            />
            <Stack.Screen
                name="RegisterProf"
                component={RegisterProf}
                options={() => ({
                    animationEnabled: true,
                    headerShown: false,
                    lazy: false,
                    animation: 'slide_from_right',
                })}
            />
            <Stack.Screen
                name="Onboarding"
                component={Onboarding}
                options={() => ({
                    animationEnabled: true,
                    headerShown: false,
                    lazy: false,
                    animation: 'slide_from_right',
                })}
            />
            <Stack.Screen
                name="TabGroup"
                component={TabGroup}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    headerShown: true,
                    tabBarVisible: true, // Asegura que el bottom tab se muestre en el Home
                }}
            />
            <Stack.Screen
                name="Buscar"
                component={Buscar}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Eventos"
                component={Eventos}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Chat"
                component={Chat}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Perfil"
                component={Perfil}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Configuración"
                component={Configuration}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="Notificaciones"
                component={Notifications}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_left',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="ShowEvent"
                component={ShowEvent}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="ShowProf"
                component={ShowProf}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="ShowTypeOfYoga"
                component={ShowTypeOfYoga}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="ShowNotification"
                component={ShowNotification}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="ShowCommunity"
                component={ShowCommunity}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="DetailsCommunity"
                component={DetailsCommunity}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="Cuenta"
                component={Cuenta}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="Editar Perfil Público"
                component={EditPublicProfile}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="NotificacionesConfig"
                component={Notificaciones}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="Ayuda"
                component={Ayuda}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="EditProf"
                component={EditProf}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="DatosPersonales"
                component={DatosPersonales}
                options={({ navigation }) => ({
                    title: 'Datos Personales',
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="InfoApp"
                component={InfoApp}
                options={({ navigation }) => ({
                    title: 'Info. de la Aplicación',
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="Horarios"
                component={Horarios}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="Fotos"
                component={Fotos}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="Precios"
                component={Precios}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="Ubicacion"
                component={Ubicacion}
                options={({ navigation }) => ({
                    title: "Ubicación",
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="EditEvent"
                component={EditEvent}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="EditTypeOfYoga"
                component={EditTypeOfYoga}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="EditCommunity"
                component={EditCommunity}
                options={({ navigation }) => ({
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    lazy: false,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="WayClass"
                component={WayClass}
                options={({ navigation }) => ({
                    title: 'Contactar',
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="CreateEvent"
                component={CreateEvent}
                options={({ navigation }) => ({
                    title: 'Creando Evento',
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="CreateFormacion"
                component={CreateFormacion}
                options={({ navigation }) => ({
                    title: 'Creando Formación',
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
            <Stack.Screen
                name="ShowFormacion"
                component={ShowFormacion}
                options={({ navigation }) => ({
                    title: 'Formaciones',
                    headerStyle: { backgroundColor: Colors.background },
                    headerTitleStyle:{ color: Colors.text2 },
                    animationEnabled: true,
                    animation: 'slide_from_right',
                    headerLeft: () => (
                        <MaterialIcons 
                            name="arrow-back" 
                            size={24}
                            style={ styles.iconLeft }
                            onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            />
        </Stack.Navigator>
    );
}

export default function Navigation(){
    return (
    <NavigationContainer>
        <StatusBar style="light" />
        <StackGroup />
    </NavigationContainer>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    iconLeft: {
        color: Colors.headerIcons,
        marginRight: 8,
    } 
});