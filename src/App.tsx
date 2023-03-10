import React, {useCallback, useEffect, useState} from 'react';
import words from "./Vocab.json"
import './App.css';
import {Hangman} from "./components/Hangman";
import {Word} from "./components/Word";
import {Keyboard} from "./components/Keyboard";

function getWord() {
    return words[Math.floor(Math.random() * words.length)]
}
function App() {
    const [wordGuess, setWordGuess] = useState(getWord)
    const [guessLetters, setGuessLetters] = useState<string[]>([])

    const incorrectLetters = guessLetters.filter(letter=> !wordGuess.includes(letter))

    const isLoser = incorrectLetters.length >= 6
    const isWinner = wordGuess
        .split("")
        .every(letter => guessLetters.includes(letter))

    const addGuessLetter = useCallback(
        (letter: string) => {
            if (guessLetters.includes(letter) || isLoser || isWinner) return

            setGuessLetters(currentLetters => [...currentLetters, letter])
        },
        [guessLetters, isWinner, isLoser]
    )
    useEffect(()=>{
        const handler = (e:KeyboardEvent)=>{
            const key = e.key
            if(!key.match(/^[a-z]$/)) return
            e.preventDefault()
            addGuessLetter(key)
        }
        document.addEventListener("keypress", handler)
        return () => {
            document.removeEventListener("keypress", handler)
        }
    }, [guessLetters])



    useEffect(()=>{
        const handler = (e:KeyboardEvent)=>{
            const key = e.key
            if (key !== "Enter") return
            e.preventDefault()
            setGuessLetters([])
            setWordGuess(getWord())
        }
        document.addEventListener("keypress", handler)
        return () => {
            document.removeEventListener("keypress", handler)}
    }, [])

    return (
        <div style={{
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            margin: "0 auto",
            marginTop: "2rem",
            alignItems: "center",
        }}>

            <div style={{fontSize: "2rem", textAlign: "center"}}>
                {isWinner && "Winner! - Refresh to try again"}
                {isLoser && "Nice try - Refresh to try again"}
            </div>
            <Hangman numberOfGuesses={incorrectLetters.length}/>

            <Word
                reveal={isLoser}
                guessLetters={guessLetters}
                  wordGuess={wordGuess}/>

            <div style={{ alignSelf: "stretch" }}>
            <Keyboard
                disabled = {isWinner || isLoser}
                activeLetters={guessLetters.filter(letter =>
                wordGuess.includes(letter))}
                inactiveLetters={incorrectLetters}
                addGuessLetter={addGuessLetter}
            /></div>

        </div>
    );
}

export default App;
