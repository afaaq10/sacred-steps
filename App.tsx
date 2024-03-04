/**
 * Sacred Steps
 *
 * @author    Afaaq Majeed
 * @link      https://github.com/afaaq10/sacred-steps
 * @copyright 2024 Afaaq Majeed
 */

import React from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Text, Animated } from 'react-native';
import { useFonts } from 'expo-font';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { Colors } from './src/colors/colors';
import { Fonts } from './src/colors/utils/fonts';
import { StatusBar } from 'expo-status-bar';

export default function App() {
    const [fontsLoaded] = useFonts({
        [Fonts.JosefinSlabSemiBold]: require('./assets/fonts/Josefin_Slab/JosefinSlab-SemiBold.ttf'),
    });

    const bounceAnimation = React.useRef(new Animated.Value(0)).current;

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
            }

            setStartTime(new Date());
            startInterval();
        }
    };

    const handleFinishPress = () => {
        startBounceAnimation();
        const endTime = new Date();
        const roundTime = endTime.getTime() - startTime!.getTime();

        setRoundTimes((prevRoundTimes) => [...prevRoundTimes, roundTime]);
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }

        setTotalTime(roundTimes.reduce((a, v) => a + v));
        setCounter(8);
    };

    const handleReset = () => {
        startBounceAnimation();
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

        if (counter === 0) {
            return '0 31.4';
        } else if (counter < totalSegments) {
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

    React.useEffect(() => {
        if (fontsLoaded) {
            startBounceAnimation();
        }
    }, [fontsLoaded]);

    const startBounceAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnimation, { toValue: 1, duration: 500, useNativeDriver: false }),
                Animated.timing(bounceAnimation, { toValue: 0, duration: 500, useNativeDriver: false }),
            ]),
        ).start();
    };

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
                <Text style={styles.roundTimeCard}>Round {index + 1}</Text>
                <Text style={styles.roundTimeCard}>{formatTime(time)}</Text>
            </View>
        ));
    };

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            {counter === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 48 }}>
                    <Text style={styles.title}>Sacred Steps</Text>
                    <TouchableOpacity onPress={handleStartPress}>
                        <Animated.View style={[styles.animationContainer, { transform: [{ translateY: bounceAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) }] }]}>
                            <Text style={styles.startText} onPress={handleStartPress}>Bismillah</Text>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView style={{ flex: 1, padding: 16, width: '100%' }}>
                    <Text style={styles.title}>Sacred Steps</Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center', gap: 12, marginVertical: 12 }}>
                        <Svg height="160" width="160" viewBox="0 0 20 20">
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
                            <SvgText x="50%" y="58%" fontSize="5" fontWeight="bold" fill="white" textAnchor="middle">
                                {counter > 0 && counter <= 7 && counter}
                                {counter > 7 && '-'}
                            </SvgText>
                            {counter > 0 &&
                                <SvgText x="50%" y="75%" fontSize="2" fontWeight="bold" fill="white" textAnchor="middle">
                                    {formatTime(totalTime)}
                                </SvgText>
                            }
                        </Svg>
                        <View style={styles.buttonContainer}>
                            {counter === 8 &&
                                <TouchableOpacity onPress={handleReset} style={[styles.counterButton, { backgroundColor: Colors.DARK_MEDIUM }]}>
                                    <Text style={styles.buttonText}>Reset</Text>
                                </TouchableOpacity>
                            }
                            {counter < 8 &&
                                <>
                                    <TouchableOpacity onPress={handleReset} style={[styles.counterButton, { backgroundColor: Colors.DARK_MEDIUM }]}>
                                        <Text style={styles.buttonText}>Reset</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={counter === 7 ? handleFinishPress : handleNextPress} style={[styles.counterButton, { backgroundColor: Colors.ORANGE_DARK }]}>
                                        <Text style={styles.buttonText}>{buttonText}</Text>
                                    </TouchableOpacity>
                                </>
                            }
                        </View>
                    </View>
                    <View style={{ gap: 8 }}>{renderRoundTimes()}</View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Dark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animationContainer: {
        backgroundColor: Colors.BLUE_GREEN,
        padding: 16,
        borderRadius: 16,
    },
    startText: {
        color: 'white',
        fontSize: 28,
        fontFamily: Fonts.JosefinSlabSemiBold,
    },
    title: {
        color: Colors.WHITE,
        textAlign: 'center',
        marginTop: 23,
        fontSize: 42,
        fontFamily: Fonts.JosefinSlabSemiBold,
        textShadowColor: Colors.ORANGE_DARK,
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        opacity: 0.8,
        backgroundColor: Colors.Light
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    counterButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 48,
        borderWidth: 1,
        borderColor: Colors.ORANGE_DARK,
        elevation: 6,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
    },
    totalTimeHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    roundTimeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.ORANGE_LIGHT,
        borderRadius: 4,
        padding: 12,
    },
    roundTimeText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    roundTimeCard: {
        color: 'white',
        fontSize: 18,
    }
});
