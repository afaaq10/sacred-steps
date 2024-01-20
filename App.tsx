/**
 * sacred-steps
 *
 * @author Afaaq Majeed
 *
 * @copyright 2024 Afaaq Majeed
 */

import React, { useState, useRef } from 'react';
import { Text, TouchableOpacity, View, SafeAreaView, StyleSheet } from 'react-native';
import { Colors } from './src/colors/colors';

export interface TawafCounterProps {
	onFinish: () => void;
}

export default function App({ onFinish }: any) {
	const [round, setRound] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [elapsedTime, setElapsedTime] = useState<number[]>([]);
	const intervalRef = useRef<number | null>(null);

	const startStopHandler = () => {
		if (!isRunning) {
			setRound(0);
			setStartTime(Date.now());
			setIsRunning(true);
			intervalRef.current = setInterval(() => {
				setElapsedTime((prev) => [...prev, Date.now()]);
			}, 1000);
		} else {
			setRound((prevRound) => prevRound + 1);
			clearInterval(intervalRef.current);
			setIsRunning(false);
			if (round === 6) {
				onFinish(); // Call the provided onFinish callback when all rounds are completed
			}
		}
	};

	const resetHandler = () => {
		setRound(0);
		setIsRunning(false);
		setStartTime(null);
		setElapsedTime([]);
		clearInterval(intervalRef.current);
	};

	const formatTime = (time: number) => {
		const seconds = Math.floor(time / 1000);
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={{ justifyContent: "center", flex: 1, gap: 55 }}>
				<View style={styles.buttonContainer}>
					<TouchableOpacity onPress={resetHandler} style={[styles.counterButton, { backgroundColor: 'white' }]}>
						<Text style={styles.buttonText}>Reset</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={startStopHandler} style={styles.counterButton}>
						<Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
					</TouchableOpacity>
				</View>
				<Text style={styles.counterText}>{round > 0 && `Round ${round} Complete`}</Text>
				<Text style={styles.counterText}>{round > 0 && `Time for Round ${round}: ${formatTime(elapsedTime[round - 1] - startTime!)}`}</Text>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 20,
		padding: 16,
		backgroundColor: Colors.Dark,
	},
	counterText: {
		fontSize: 18,
		textAlign: "center",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	counterButton: {
		backgroundColor: "yellow",
		padding: 10,
		borderRadius: 15,
		width: 115,
	},
	buttonText: {
		color: 'black',
		textAlign: 'center',
		fontSize: 16,
		fontWeight: "bold",
	}
})
