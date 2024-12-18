import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Pressable, Modal, Image, Dimensions, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import axios from 'axios';

export function PhotosProf({ id }) {
    const [modal, setModal] = useState(false);
    const [imageModal, setImageModal] = useState(null);
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/images.php', { id: id });

                if (response.data.success) { setPhotos(response.data.images); }
                else { console.log("Warn: ", response.data.message); }
            } catch (error) { console.log("ERROR: ", error); }
        }

        connection();
    }, [id]);

    const openModal = (index) => {
        setModal(true);
        setImageModal(index);
        console.log("IMG: ", photos[index]);
    }

    const closeModal = () => {
        setModal(false);
        setImageModal(null);
    }

    const handleSwipe = (dir) => {
        if (dir == "prev") {
            if(imageModal > 0) { setImageModal((imageModal - 1)); }
            else { setImageModal((photos.length - 1)); }
        }

        if (dir == "next") {
            if(imageModal >= (photos.length - 1)) { setImageModal(0); }
            else { setImageModal((imageModal + 1)); }
        }
    }

    const renderItem = ({ item, index }) => (
        <Pressable key={index} onPress={() => openModal(index)}>
            <Image source={{ uri: item }} style={styles.image} />
        </Pressable>
    );

    return (
        <View style={styles.container}>
            { photos && photos.length > 0 &&
                <>
                    <FlatList
                        data={photos}
                        renderItem={renderItem}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToAlignment="center"
                    />
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modal}
                        onRequestClose={closeModal}>
                        <Pressable style={styles.overlay} onPress={closeModal}>
                            <View style={styles.modalContent}>
                                <Image 
                                    source={{ uri: photos[imageModal] }} 
                                    style={styles.imageComplete} 
                                />
                            </View>
                            <View style={styles.arrowSector}>
                                <TouchableOpacity onPress={() => handleSwipe('prev')} style={styles.arrowButton}>
                                    <MaterialIcons name='chevron-left' size={36} color='#fff' />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleSwipe('next')} style={styles.arrowButton}>
                                    <MaterialIcons name='chevron-right' size={36} color='#fff' />
                                </TouchableOpacity>
                            </View>
                        </Pressable>
                    </Modal>
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
        marginTop: 8,
    },
    image: {
        width: 170,
        height: 170,
        marginRight: 16,
    },
    imageComplete: {
        width: 356,
        height: 200,
    },
    overlay: {
        backgroundColor: '#000000aa',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrowSector: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    arrowButton: {
        backgroundColor: '#ffffff20',
        padding: 16,
        borderRadius: 16,
    },
});
