import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Pressable } from 'react-native';
import styles from '../style/style';
import Entypo from '@expo/vector-icons/Entypo';


const START = 'plus';
const CROSS = 'cross';
const CIRCLE = 'circle';
const NBR_OF_COLS = 5;
const NBR_OF_ROWS = 5;

let initialBoard = new Array(NBR_OF_COLS * NBR_OF_ROWS).fill(START);

export default function Gameboard() {

    const [status, setStatus] = useState('Game has not started');
    const [board, setBoard] = useState(initialBoard);
    const [locations,] = useState([]);
    const [nbrofbombs, setNbrofbombs] = useState(15);
    const [nbrofhits, setNbrofhits] = useState(0);
    const [nbrofships, setNbrofships] = useState(3);
    const refTimer = useRef();
    const [startTime, setStartTime] = useState(30);
    const [timerEnd, setTimerEnd] = useState(false);
    const [button, setButton] = useState('Start game');
    const [random, setRandom] = useState(false);

    const items = [];
    for (let x = 0; x < NBR_OF_ROWS; x++) {
        const cols = [];
        for (let y = 0; y < NBR_OF_COLS; y++) {
            cols.push(
                <Pressable
                    key={x * NBR_OF_COLS + y}
                    style={styles.item}
                    onPress={() => drawItem(x * NBR_OF_COLS + y)}>
                    <Entypo
                        key={x * NBR_OF_COLS + y}
                        name={board[x * NBR_OF_COLS + y]}
                        size={32}
                        color={chooseItemColor(x * NBR_OF_COLS + y)} />
                </Pressable>
            );

        }
        let row =
            <View key={"row" + x}>
                {cols.map((item) => item)}
            </View>
        items.push(row);
    }


    function shipLocation() {
        for (let i = 0; i < nbrofships; i++) {
            let randomNumber = Math.floor(Math.random() * (NBR_OF_ROWS * NBR_OF_COLS));
            if (locations.includes(randomNumber) === random) {
                locations.push(randomNumber);

            } else {
                randomNumber = Math.floor(Math.random() * (NBR_OF_ROWS * NBR_OF_COLS));
                locations.push(randomNumber);
                setRandom(random === !random);
            }
        }
    }

    function drawItem(number) {

        if (timerEnd && nbrofbombs > 0) {
            setNbrofbombs(nbrofbombs => nbrofbombs - 1);

            if (board[number] === START) {
                if (locations.includes(number)) {
                    board[number] = CIRCLE;
                    setNbrofships(nbrofships => nbrofships - 1);
                    setNbrofhits(nbrofhits => nbrofhits + 1);
                }


                else {
                    board[number] = CROSS;
                }
            }
            else if (board[number] === CROSS || CIRCLE) {
                setNbrofbombs(nbrofbombs => nbrofbombs + 1);
            }
        }

        else {
            setStatus('Start game')

        }


    }



    function chooseItemColor(number) {
        if (board[number] === CROSS) {
            return "#FF3031"
        }
        else if (board[number] === CIRCLE) {
            return "#45CE30"

        }
        else {
            return "#74B9FF"
        }
    }

    function setTime() {
        const time = setInterval(() => setStartTime(startTime => startTime - 1), 1000);
        refTimer.current = time;
    }

    function Stop() {
        clearInterval(refTimer.current);
    }


    function resetGame() {
        let initialBoard = new Array(NBR_OF_COLS * NBR_OF_ROWS).fill(START);
        setStartTime(30);
        setBoard(initialBoard);
        setNbrofhits(0);
        setNbrofbombs(15);
        setNbrofships(3);
        shipLocation();
        setStatus('Game is on...');
        if (timerEnd) {
            Stop();
            setTime();
        } else {
            setTimerEnd(timerEnd => !timerEnd);
            setTime();
            setStatus('Game is on...');
            setButton('New game');
            setBoard(initialBoard);
        }
    }




    useEffect(() => {
        if (nbrofhits === 3) {
            Stop();
            setStatus("You won");


        }
        if (nbrofbombs === 0) {
            Stop();
            setStatus("You lost. Ships remaining");


        }
    }, [nbrofhits, nbrofbombs]);

    useEffect(() => {
        if (startTime === 0) {
            Stop();
            setStatus("You lost. Time's out");

        }
    }, [startTime]);


 
    return (

        <View style={styles.gameboard}>
            <View style={styles.flex}>{items}</View>
            <Text style={styles.gameinfo}>
                Hits: {nbrofhits} Bombs: {nbrofbombs} Ships: {nbrofships}  </Text>
            <Text style={styles.gameinfo}>Time: {startTime} sec </Text>
            <Text style={styles.gameinfo}>Status: {status}</Text>
            <Pressable style={styles.button} onPress={() => resetGame()}>
                <Text style={styles.buttonText}>{button}</Text>
            </Pressable>
        </View>
    );


}