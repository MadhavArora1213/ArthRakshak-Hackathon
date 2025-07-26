"use client"

import React, { createContext, useState, useEffect, useCallback, useContext } from "react"
import { Audio } from "expo-av"

// Define the context default values
const AudioContext = createContext({
  isPlaying: false,
  playAudio: async () => {},
  stopAudio: async () => {},
  setCurrentLanguage: () => {},
})

// Audio Provider Component
export const AudioProvider = ({ children }) => {
  const [sound, setSound] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("en")

  const audioFiles = {
    en: [
      require("../../assets/en/intro.mp3"),
      require("../../assets/en/social_proof.mp3"),
      require("../../assets/en/fake_platform.mp3"),
      require("../../assets/en/investment.mp3"),
      require("../../assets/en/fake_returns.mp3"),
      require("../../assets/en/withdrawal_trap.mp3"),
      require("../../assets/en/scam_revealed.mp3"),
      require("../../assets/en/results.mp3"),
    ],
    hi: [
      require("../../assets/hi/intro.mp3"),
      require("../../assets/hi/social_proof.mp3"),
      require("../../assets/hi/fake_platform.mp3"),
      require("../../assets/hi/investment.mp3"),
      require("../../assets/hi/fake_returns.mp3"),
      require("../../assets/hi/withdrawal_trap.mp3"),
      require("../../assets/hi/scam_revealed.mp3"),
      require("../../assets/hi/results.mp3"),
    ],
    pa: [
      require("../../assets/pa/intro.mp3"),
      require("../../assets/pa/social_proof.mp3"),
      require("../../assets/pa/fake_platform.mp3"),
      require("../../assets/pa/investment.mp3"),
      require("../../assets/pa/fake_returns.mp3"),
      require("../../assets/pa/withdrawal_trap.mp3"),
      require("../../assets/pa/scam_revealed.mp3"),
      require("../../assets/pa/results.mp3"),
    ],
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  const playAudio = useCallback(
    async (index, language) => {
      if (sound) {
        await sound.stopAsync()
        await sound.unloadAsync()
      }

      try {
        const { sound: newSound } = await Audio.Sound.createAsync(audioFiles[language][index])
        setSound(newSound)
        await newSound.playAsync()
        setIsPlaying(true)

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false)
          }
        })
      } catch (error) {
        console.error("Error playing audio:", error)
        setIsPlaying(false)
      }
    },
    [sound],
  )

  const stopAudio = useCallback(async () => {
    if (sound) {
      await sound.stopAsync()
      setIsPlaying(false)
    }
  }, [sound])

  const value = {
    isPlaying,
    playAudio,
    stopAudio,
    setCurrentLanguage,
  }

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

// Custom hook to use the audio context
export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}

export default AudioContext
