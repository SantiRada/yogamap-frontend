import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import axios from 'axios';
import useColors from '../../Colors';

import { TypeAccountRegister } from './TypeAccountRegister';
import { TypeYogaAndClientRegister } from './TypeYogaAndClientRegister';
import { ImageAndCertificateRegister } from './ImageAndCertificateRegister';
import { PayAndCommunityRegister } from './PayAndCommunityRegister';
import { UbicationRegister } from './UbicationRegister';
import { FinalRegister } from './FinalRegister';

export function RegisterProf({ route }) {
    const { id } = route.params;
    const [space, setSpace] = useState(0);
    const advance = () => { setSpace(space + 1); }
    const reverse = () => { setSpace(space - 1); }
    const [typeAccount, setTypeAccount] = useState('');
    const [typeYoga, setTypeYoga] = useState([]);
    const [typeAlumn, setTypeAlumn] = useState([]);
    const [image, setImage] = useState([]);
    const [certificate, setCertificate] = useState([]);
    const [pay, setPay] = useState([]);
    const [community, setCommunity] = useState(true);
    const [ubication, setUbication] = useState('');

    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/update/registerprof.php', {
                    id: id,
                    typeAccount: typeAccount,
                    typeYoga: typeYoga,
                    typeAlumn: typeAlumn,
                    image: image,
                    certificate: certificate,
                    pay: pay,
                    community: community,
                    ubication: ubication
                }, { headers: { 'Content-Type': 'application/json' } });
    
                if (response.data.success) {
                    console.log("Registro de Profe: ", response.data.success);
                } else {
                    console.log("Registro de Profe FALLIDO: ", response.data.message);
                }
            } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar los eventos...");
            }
        };

        if(space == 5) { connection(); }
    }, [space]);

    const Colors = useColors();
    const styles = DynamicStyles(Colors);
    
    return (
        <View style={styles.container}>
            {space == 0 && 
                <TypeAccountRegister
                    advance={advance}
                    typeAccount={typeAccount}
                    setTypeAccount={setTypeAccount}
                />
            }
            {space == 1 && 
                <TypeYogaAndClientRegister
                    reverse={reverse}
                    advance={advance}
                    typeYoga={typeYoga}
                    typeAlumn={typeAlumn}
                    setTypeYoga={setTypeYoga}
                    setTypeAlumn={setTypeAlumn}
                />
            }
            {space == 2 && 
                <ImageAndCertificateRegister
                    reverse={reverse}
                    advance={advance}
                    image={image}
                    setImage={setImage}
                    certificate={certificate}
                    setCertificate={setCertificate}
                />
            }
            {space == 3 && 
                <PayAndCommunityRegister
                    reverse={reverse}
                    advance={advance}
                    pay={pay}
                    setPay={setPay}
                    community={community}
                    setCommunity={setCommunity}
                />
            }
            {space == 4 && 
                <UbicationRegister
                    reverse={reverse}
                    advance={advance}
                    ubication={ubication}
                    setUbication={setUbication}
                />
            }
            {space == 5 && <FinalRegister prof={id} />}
        </View>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.background,
        paddingHorizontal: '4%',
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
    input: {
        backgroundColor: Colors.inputBG,
        width: '100%',
        padding: 8,
        paddingLeft: 24,
        color: '#fff',
        borderRadius: 8,
        marginBottom: 16,
    },
    btn: {
        backgroundColor: '#8C5BFF',
        height: 50,
        width: '100%',
        marginBottom: 16,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnBase: {
        height: 50,
        width: '100%',
        marginBottom: 16,
        borderRadius: 16,
        borderColor: '#8C5BFF',
        borderWidth: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBtn: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    weight: {
        fontWeight: 'bold',
    },
});
