/**
* sacred-steps
*
* @author Afaaq Majeed
*
* @copyright 2024 Afaaq Majeed
*/

import React from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Text as RNText } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { Colors } from './src/colors/colors';

export default function App() {
    const [counter, setCounter] = React.useState(0);
    const [buttonText, setButtonText] = React.useState('Start');
    const [dashArray, setDashArray] = React.useState('0 31.4');
    const [startTime, setStartTime] = React.useState(null);
    const [roundTimes, setRoundTimes] = React.useState([]);
    const [totalTime, setTotalTime] = React.useState(0);
    const intervalRef = React.useRef(null);

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedHours = hours > 0 ? `${String(hours).padStart(2, '0')}h ` : '';
        const formattedMinutes = `${String(minutes).padStart(2, '0')}m `;
        const formattedSeconds = `${String(seconds).padStart(2, '0')}s`;

        return formattedHours + formattedMinutes + formattedSeconds;
    };

    const handleNextPress = () => {
        if (counter === 0) {
            setButtonText('Next');
            setStartTime(new Date());
            setTotalTime(0);
            startInterval();
        }

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
        } else {
            setCounter(0);
            setButtonText('Start');
            setStartTime(null);
            setRoundTimes([]);
            setTotalTime(0);
            clearInterval(intervalRef.current);
        }
    };

    const handleReset = () => {
        setCounter(0);
        setDashArray('0 31.4');
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
                        <SvgText x="53%" y="55%" fontSize="5" fontWeight="bold" fill="white" textAnchor="middle">
                            {counter}
                        </SvgText>
                    </Svg>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleReset} style={[styles.counterButton, { backgroundColor: 'white' }]}>
                            <RNText style={styles.buttonText}>Reset</RNText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNextPress} style={styles.counterButton}>
                            <RNText style={styles.buttonText}>{buttonText}</RNText>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <RNText style={styles.totalTimeHeader}>Total Time:</RNText>
                        <RNText style={styles.roundTimeText}>{formatTime(totalTime)}</RNText>
                        {renderRoundTimes()}
                    </View>
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


