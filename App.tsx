/**
 * sacred-steps
 *
 * @author Afaaq Majeed
 *
 * @copyright 2024 Afaq Majeed
 */
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Colors } from './src/colors/colors';

export default function App() {
    const [counter, setCounter] = useState(0);
    const [buttonText, setButtonText] = useState('Start');

    const handleNextPress = () => {
        if (counter === 0) setButtonText("Next")
        if (counter < 7) {
            setCounter((prevCounter) => prevCounter + 1);
            if (counter === 6) {
                setButtonText('Finish');
            }
        } else {
            setCounter(0);
            setButtonText('Start');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', gap: 65, marginTop: 65 }}>
                    <View style={styles.circle}>
                        <Text style={[styles.buttonText, { color: 'white' }]}>{counter}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => {}} style={[styles.counterButton, { backgroundColor: 'white' }]}>
                            <Text style={styles.buttonText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNextPress} style={styles.counterButton}>
                            <Text style={styles.buttonText}>{buttonText}</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.counterText}>Test</Text>
                        <Text style={styles.counterText}>Test</Text>
                    </View>
                    <Text style={styles.counterText}>Test</Text>
                    <View style={styles.totalTimeContainer}></View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    circle: {
        width: 135,
        height: 135,
        borderWidth: 0.5,
        borderRadius: 70,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        marginTop: 35,
    },
    container: {
        flex: 1,
        gap: 20,
        padding: 16,
        backgroundColor: Colors.Dark,
    },
    counterText: {
        fontSize: 18,
        textAlign: 'center',
        color: Colors.Light,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 30,
    },
    counterButton: {
        backgroundColor: 'yellow',
        padding: 10,
        borderRadius: 15,
        width: 115,
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    roundTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    roundTimeText: {
        color: Colors.Light,
    },
    totalTimeContainer: {
        marginTop: 20,
    },
});
