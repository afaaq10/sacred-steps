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

const backgroundImage = require('./assets/mataf.jpg');

export default function App() {
    const [counter, setCounter] = React.useState(0);
    const [buttonText, setButtonText] = React.useState('Start');
    const [dashArray, setDashArray] = React.useState('0 31.4');
    const [startTime, setStartTime] = React.useState<Date | null>(null);
    const [roundTimes, setRoundTimes] = React.useState<number[]>([]);
    const [totalTime, setTotalTime] = React.useState(0);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    const formatTime = (milliseconds: number) => {
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
            const roundTime = endTime.getTime() - startTime!.getTime();

            setRoundTimes((prevRoundTimes) => [...prevRoundTimes, roundTime]);
            setCounter((prevCounter) => prevCounter + 1);
            if (counter === 6) {
                setButtonText('Finish');
                if (intervalRef.current !== null) {
                    clearInterval(intervalRef.current);
                }
            } else {
                setStartTime(new Date());
            }
        }
    };

    const handleFinishPress = () => {
        const endTime = new Date();
        const roundTime = endTime.getTime() - startTime!.getTime();

        setRoundTimes((prevRoundTimes) => [...prevRoundTimes, roundTime]);
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }
        setCounter(8);
    };

    const handleReset = () => {
        setCounter(0);
        setButtonText('Start');
        setStartTime(null);
        setRoundTimes([]);
        setTotalTime(0);
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }
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
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            setTotalTime((prevTotalTime) => prevTotalTime + 1000);
        }, 1000);
    };


    const renderRoundTimes = () => {
        return roundTimes.map((time, index) => (
            <View key={index} style={styles.roundTimeItem}>
                <RNText style={styles.roundTimeCard}>Round {index + 1}:</RNText>
                <RNText style={styles.roundTimeCard}>{formatTime(time)}</RNText>
            </View>
        ));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <RNText style={styles.title}>Sacred Steps</RNText>
            </View>
            {counter === 0 ? (
                <ImageBackground source={backgroundImage} style={styles.imageBackground}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleStartPress} style={styles.startButton}>
                            <RNText style={styles.startButtonText}>Bismillah</RNText>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            ) : (
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', gap: 25, marginTop: 45 }}>
                        <Svg height="170" width="170" viewBox="0 0 20 20">
                            <Circle r="5" cx="10" cy="10" fill={Colors.Dark} stroke={Colors.DARK_MEDIUM} strokeWidth="10" />
                            {counter > 0 && (
                                <Circle
                                    r="5"
                                    cx="10"
                                    cy="10"
                                    fill="transparent"
                                    stroke={Colors.ORANGE_MEDIUM}
                                    strokeWidth="10"
                                    strokeDasharray={dashArray}
                                    transform="rotate(-90) translate(-20)"
                                />
                            )}
                            <SvgText x="53%" y="55%" fontSize="5" fontWeight="bold" fill="white" textAnchor="middle">
                                {counter > 0 && counter <= 7 ? counter : 0}
                            </SvgText>
                        </Svg>
                        <View style={styles.buttonContainer}>
                            {counter === 8 && (
                                <TouchableOpacity onPress={handleReset} style={[styles.counterButton, { backgroundColor: Colors.DARK_MEDIUM }]}>
                                    <RNText style={styles.buttonText}>Reset</RNText>
                                </TouchableOpacity>
                            )}
                            {counter < 8 && (
                                <>
                                    <TouchableOpacity onPress={handleReset} style={[styles.counterButton, { backgroundColor: Colors.DARK_MEDIUM }]}>
                                        <RNText style={styles.buttonText}>Reset</RNText>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={counter === 7 ? handleFinishPress : handleNextPress} style={[styles.counterButton, { backgroundColor: Colors.ORANGE_DARK }]}>
                                        <RNText style={styles.buttonText}>{buttonText}</RNText>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 7 }}>
                            <RNText style={styles.totalTimeHeader}>Total Time :</RNText>
                            <RNText style={styles.roundTimeText}>{formatTime(totalTime)}</RNText>
                        </View>
                    </View>
                    {renderRoundTimes()}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Dark,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: Colors.WHITE,
        textAlign: "center",
        marginTop: 55,
        fontSize: 25,
        // fontFamily: "Helvetica",
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        opacity: 0.8,
        backgroundColor: Colors.Light
    },
    startButton: {
        backgroundColor: Colors.BLUE_GREEN,
        padding: 9,
        borderRadius: 16,
        marginBottom: 30,
        width: "50%",
    },
    startButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 30,
    },
    counterButton: {
        padding: 9,
        borderRadius: 22,
        width: 128,
        height: 42,
        borderWidth: 1,
        borderColor: Colors.ORANGE_DARK,
        elevation: 7,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },

    totalTimeHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "white",

    },
    roundTimeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 21,
        color: "white",
        width: 290,
        height: 36,
        borderWidth: 1,
        borderColor: Colors.ORANGE_LIGHT,
        borderRadius: 7,
        padding: 5,
    },
    roundTimeText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    roundTimeCard: {
        color: 'white',
        fontSize: 14,
    }
});
