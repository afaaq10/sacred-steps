import React, { useState, useRef } from 'react';
import { Text, TouchableOpacity, View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Colors } from './src/colors/colors';

export interface TawafCounterProps {
	onFinish: () => void;
}

export default function App({ onFinish }: any) {
	const [round, setRound] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [elapsedTimes, setElapsedTimes] = useState<number[]>([]);
	const intervalRef = useRef<number | null>(null);

	const startStopHandler = () => {
		if (!isRunning) {
			setRound(1);
			setStartTime(Date.now());
			setIsRunning(true);
			intervalRef.current = setInterval(() => {
				setElapsedTimes((prev) => [...prev, Date.now() - startTime!]);
			}, 1000);
		} else {
			setRound((prevRound) => prevRound + 1);
			clearInterval(intervalRef.current);
			setIsRunning(false);
			if (round === 7) {
				onFinish();
			}
		}
	};


	const nextHandler = () => {
		if (round < 7) {
			setRound((prevRound) => prevRound + 1);
			setElapsedTimes((prev) => [...prev, Date.now()]);
		}
	};


	const resetHandler = () => {
		setRound(0);
		setIsRunning(false);
		setStartTime(null);
		setElapsedTimes([]);
		clearInterval(intervalRef.current);
	};

	const formatTime = (time: number | undefined) => {
		if (time === undefined || time < 0) {
			return "00:00:00";
		}

		const seconds = Math.floor(time / 1000);
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;

		const formattedHours = hours > 0 ? `${hours}:` : '';
		const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;
		const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

		return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
	};


	// ...

	const renderRoundTimes = () => {
		return elapsedTimes.map((time, index) => (
			<View key={index} style={styles.roundTime}>
				<Text style={styles.roundTimeText}>{`Round ${index + 1}`}</Text>
				<Text style={styles.roundTimeText}>{formatTime(time - startTime!)}</Text>
			</View>
		));
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={{ flex: 1 }}>
				<View style={{ justifyContent: "center", alignItems: "center", gap: 65, marginTop: 65 }}>
					<View style={styles.circle}>
						<Text style={[styles.buttonText, { color: "white" }]}>{round}</Text>
					</View>
					<View style={styles.buttonContainer}>
						<TouchableOpacity onPress={resetHandler} style={[styles.counterButton, { backgroundColor: 'white' }]}>
							<Text style={styles.buttonText}>Reset</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={isRunning ? startStopHandler : nextHandler} style={styles.counterButton}>
							<Text style={styles.buttonText}>{isRunning ? 'Stop' : round === 7 ? 'Finish' : 'Start'}</Text>
						</TouchableOpacity>
					</View>
					{round > 0 && round < 7 && (
						<>
							<Text style={styles.counterText}>{`Round ${round} Complete`}</Text>
							<Text style={styles.counterText}>{`Time for Round ${round}: ${formatTime(elapsedTimes[round - 1] - startTime!)}`}</Text>
						</>
					)}
					{round === 7 && (
						<>
							<Text style={styles.counterText}>{`Total Time: ${formatTime(elapsedTimes[6] - startTime!)}`}</Text>
							{/* <TouchableOpacity onPress={resetHandler} style={styles.counterButton}>
								<Text style={styles.buttonText}>Reset</Text>
							</TouchableOpacity> */}
						</>
					)}
					<View style={styles.totalTimeContainer}>
						{renderRoundTimes()}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	circle: {
		width: 135,
		height: 135,
		borderWidth: 0.5,
		borderRadius: 70,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: "white",
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
		textAlign: "center",
		color: Colors.Light,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		gap: 30,
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
