import { hiraganaData } from "../data/hiraganaData";

export async function getCurrentHiragana() {
  const parsedProgress = JSON.parse(localStorage.getItem('hiraganaProgress') || '{}');
  const updatedHiraganaData = hiraganaData
    .filter(item => item.hiragana !== " ")
    .map(item => ({
        ...item,
        masteryLevel: parsedProgress[item.romaji] ?? item.masteryLevel
    }));  
  return updatedHiraganaData;
}