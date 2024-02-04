/**
 * sacred-steps
 *
 * @author Afaaq Majeed
 *
 * @copyright 2024 Afaaq Majeed
 */

import React from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { Colors } from './src/colors/colors';

export default function App() {
    const [counter, setCounter] = React.useState(0);
    const [buttonText, setButtonText] = React.useState('Start');
    const [dashArray, setDashArray] = React.useState('0 31.4');

    const handleNextPress = () => {
        if (counter === 0) setButtonText('Next');
        if (counter < 7) {
            setCounter((prevCounter) => prevCounter + 1);
            if (counter === 6) setButtonText('Finish');
        } else {
            setCounter(0);
            setButtonText('Start');
        }
    };

    const handleReset = () => {
        setCounter(0);
        setDashArray('0 31.4');
    };

    const calculateDashArray = () => {
        const totalSegments = 7;
        const circumference = 31.4;

        if (counter === 0) return '0 31.4';
        else if (counter < totalSegments) {
            const segmentSize = circumference / totalSegments;
            const filledLength = segmentSize * counter;
            const remainingLength = circumference - filledLength;
            return `${filledLength} ${remainingLength}`;
        } else {
            return '31.4 0';
        }
    };

    React.useEffect(() => {
        setDashArray(calculateDashArray());
    }, [counter]);

    console.log(dashArray);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', gap: 65, marginTop: 85 }}>
                    <Svg height="170" width="170" viewBox="0 0 20 20">
                        <Circle r="5" cx="10" cy="10" fill={Colors.Dark} stroke={Colors.Gray} strokeWidth="10" />
                        <Circle
                            r="5"
                            cx="10"
                            cy="10"
                            fill="transparent"
                            stroke="tomato"
                            strokeWidth="10"
                            strokeDasharray={dashArray}
                            transform="rotate(-90) translate(-20)"
                        />
                        <SvgText x="50%" y="50%" fontSize="5" fontWeight="bold" fill="white" textAnchor="middle">
                            {counter}
                        </SvgText>
                    </Svg>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleReset} style={[styles.counterButton, { backgroundColor: 'white' }]}>
                            <Text style={styles.buttonText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNextPress} style={styles.counterButton}>
                            <Text style={styles.buttonText}>{buttonText}</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text>Test</Text>
                        <Text>Test</Text>
                    </View>
                    <Text>Test</Text>
                    <View style={styles.totalTimeContainer}></View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        padding: 16,
        backgroundColor: Colors.Dark,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 30,
    },
    counterButton: {
        backgroundColor: 'yellow',
        padding: 9,
        borderRadius: 15,
        width: 115,
        color: 'black',
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalTimeContainer: {
        marginTop: 20,
    },
});
