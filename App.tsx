/**
* sacred-steps
*
* @author Afaaq Majeed
*
* @copyright 2024 Afaaq Majeed
*/

import React from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Text as RNText } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { Colors } from './src/colors/colors';

const backgroundImage = require('./assets/splash.png');

export default function App() {
    const [counter, setCounter] = React.useState(0);
    const [buttonText, setButtonText] = React.useState('Start');
    const [dashArray, setDashArray] = React.useState('0 31.4');
    const [startTime, setStartTime] = React.useState(null);
    const [roundTimes, setRoundTimes] = React.useState([]);
    const [totalTime, setTotalTime] = React.useState(0);
    const intervalRef = React.useRef(null);

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.abs(Math.floor(milliseconds / 1000));
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedHours = hours > 0 ? `${String(hours).padStart(2, '0')}h ` : '';
        const formattedMinutes = `${String(minutes).padStart(2, '0')}m `;
        const formattedSeconds = `${String(seconds).padStart(2, '0')}s`;

        return formattedHours + formattedMinutes + formattedSeconds;
    };

    const handleStartPress = () => {
        setButtonText('Next');
        setCounter(1);
        setStartTime(new Date());
        startInterval();
    };

    const handleNextPress = () => {
        if (counter < 7) {
            const endTime = new Date();
            const roundTime = endTime - startTime;
            setRoundTimes((prevRoundTimes) => [...prevRoundTimes, roundTime]);
            setCounter((prevCounter) => prevCounter + 1);
            if (counter === 6) {
                setButtonText('Finish');
                clearInterval(intervalRef.current);
            } else {
                setStartTime(new Date());
            }
        }
    };

    const handleFinishPress = () => {
        // Capture the time taken for the 7th round
        const endTime = new Date();
        const roundTime = endTime - startTime;
        setRoundTimes((prevRoundTimes) => [...prevRoundTimes, roundTime]);
        clearInterval(intervalRef.current);
        // Set counter to a value greater than 7 to only display the reset button
        setCounter(8);
    };

    const handleReset = () => {
        setCounter(0);
        setButtonText('Start');
        setStartTime(null);
        setRoundTimes([]);
        setTotalTime(0);
        clearInterval(intervalRef.current);
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

    React.useEffect(() => {
        if (startTime !== null) {
            startInterval();
        }
    }, [startTime]);

    const startInterval = () => {
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setTotalTime((prevTotalTime) => prevTotalTime + 1000);
        }, 1000);
    };

    const renderRoundTimes = () => {
        return roundTimes.map((time, index) => (
            <View key={index} style={styles.roundTimeItem}>
                <RNText style={styles.roundTimeText}>Round {index + 1}:</RNText>
                <RNText style={styles.roundTimeText}>{formatTime(time)}</RNText>
            </View>
        ));
    };

    return (
        <SafeAreaView style={styles.container}>
            {counter === 0 ? (
                <ImageBackground source={backgroundImage} style={styles.imageBackground}>
                    <TouchableOpacity onPress={handleStartPress} style={styles.startButton}>
                        <RNText style={styles.startButtonText}>Start</RNText>
                    </TouchableOpacity>
                </ImageBackground>
            ) : (
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', gap: 65, marginTop: 85 }}>
                        <Svg height="170" width="170" viewBox="0 0 20 20">
                            <Circle r="5" cx="10" cy="10" fill={Colors.Dark} stroke={Colors.Gray} strokeWidth="10" />
                            {counter > 0 && (
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
                            )}
                            <SvgText x="53%" y="55%" fontSize="5" fontWeight="bold" fill="white" textAnchor="middle">
                                {counter}
                            </SvgText>
                        </Svg>
                        <View style={styles.buttonContainer}>
                            {counter === 8 && (
                                <TouchableOpacity onPress={handleReset} style={[styles.counterButton, { backgroundColor: 'white' }]}>
                                    <RNText style={styles.buttonText}>Reset</RNText>
                                </TouchableOpacity>
                            )}
                            {counter < 8 && (
                                <>
                                    <TouchableOpacity onPress={handleReset} style={[styles.counterButton, { backgroundColor: 'white' }]}>
                                        <RNText style={styles.buttonText}>Reset</RNText>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={counter === 7 ? handleFinishPress : handleNextPress} style={styles.counterButton}>
                                        <RNText style={styles.buttonText}>{buttonText}</RNText>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                        <View>
                            <RNText style={styles.totalTimeHeader}>Total Time:</RNText>
                            <RNText style={styles.roundTimeText}>{formatTime(totalTime)}</RNText>
                            {renderRoundTimes()}
                        </View>
                    </View>
                </ScrollView>
            )}
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
    imageBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: 'yellow',
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
    },
    startButtonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
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
        alignItems: 'center',
        color: "white",
    },
    totalTimeHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "white",
    },
    roundTimeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        color: "white",
    },
    roundTimeText: {
        color: 'white',
    },
});
