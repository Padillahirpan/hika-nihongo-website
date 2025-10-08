const QUESTION_TYPES = {
  ROMAJI_TO_KANA: 'romajiToKana',
  KANA_TO_ROMAJI: 'kanaToRomaji',
  SOUND_TO_KANA: 'soundToKana',
  KANA_TO_SOUND: 'kanaToSound',
};

const highPriorityQty = 7
const mediumPriorityQty = 2
const lowPriorityQty = 1

export const generatePrioritizedQuestions = (kanaData, count = 10) => {
  // Filter hanya kana yang unlocked
  const unlockedKanas = kanaData.filter(kana => kana.unlocked);
  
  // Kategorikan kana berdasarkan poin
  
  const lowPriorityKanas = unlockedKanas.filter(kana => kana.points > 70 && kana.points <= 100)
  const mediumPriorityKanas = unlockedKanas.filter(kana => kana.points >= 40 && kana.points <= 70);
  const highPriorityKanas = unlockedKanas.filter(kana => kana.points < 40);
  
  // Hitung jumlah pertanyaan per kategori (7:2:1)
  const lowCount = Math.min(lowPriorityQty, lowPriorityKanas.length);
  const mediumCount = Math.min(mediumPriorityQty, mediumPriorityKanas.length);
  const highCount = Math.min(highPriorityQty, highPriorityKanas.length);
  
  // Jika kategori lowPriority kurang, distribusikan ke kategori lainnya
  let remaining = count - (lowCount + mediumCount + highCount);
  let extraMedium = 0;
  let extraHigh = 0;

  if (remaining > 0) {
    if (mediumPriorityKanas.length > mediumCount) {
      extraMedium = Math.min(remaining, mediumPriorityKanas.length - mediumCount);
      remaining -= extraMedium;
    }
    
    if (remaining > 0 && highPriorityKanas.length > lowCount) {
      extraHigh = Math.min(remaining, highPriorityKanas.length - highCount);
      remaining -= extraHigh;
    }
    
    // Jika masih ada sisa, isi dengan kana dari kategori mana saja
    if (remaining > 0) {
      const allKanas = [...unlockedKanas];
      // Hapus yang sudah terpilih
      const selectedIndices = new Set();
      
      // Tambahkan sisa dari mana saja
      while (remaining > 0 && selectedIndices.size < allKanas.length) {
        const randomIndex = Math.floor(Math.random() * allKanas.length);
        if (!selectedIndices.has(randomIndex)) {
          selectedIndices.add(randomIndex);
          const kana = allKanas[randomIndex];
          
          if (kana.points < 50) {
            highPriorityKanas.push(kana);
          } else if (kana.points <= 70) {
            mediumPriorityKanas.push(kana);
          } else {
            lowPriorityKanas.push(kana);
          }

          remaining--;
        }
      }
    }
  }
  
  // Fungsi untuk memilih kana secara acak dari sebuah array
  const selectRandomKanas = (array, count) => {
    const selected = [];
    const indices = new Set();
    
    if (array.length === 0) return selected;
    
    while (selected.length < count && indices.size < array.length) {
      const randomIndex = Math.floor(Math.random() * array.length);
      if (!indices.has(randomIndex)) {
        indices.add(randomIndex);
        selected.push(array[randomIndex]);
      }
    }
    
    return selected;
  };
  
  // Pilih kana dari setiap kategori
  const selectedLow = selectRandomKanas(lowPriorityKanas, lowCount);
  const selectedMedium = selectRandomKanas(mediumPriorityKanas, mediumCount + extraMedium);
  const selectedHigh = selectRandomKanas(highPriorityKanas, highCount + extraHigh);

  // Gabungkan semua kana yang terpilih
  const selectedKanas = [...selectedLow, ...selectedMedium, ...selectedHigh];
  
  // Jika masih kurang, isi dengan kana acak
  if (selectedKanas.length < count) {
    const needed = count - selectedKanas.length;
    const additional = selectRandomKanas(unlockedKanas, needed);
    selectedKanas.push(...additional);
  }
  
  // Acak urutan pertanyaan
  selectedKanas.sort(() => Math.random() - 0.5);
  
  // Buat soal untuk setiap kana yang terpilih
  const questions = selectedKanas.map(correctKana => {
    // Tentukan jenis pertanyaan secara acak dari semua tipe yang tersedia
    const questionTypes = [
      QUESTION_TYPES.ROMAJI_TO_KANA,
      QUESTION_TYPES.KANA_TO_ROMAJI,
      QUESTION_TYPES.SOUND_TO_KANA,
      QUESTION_TYPES.KANA_TO_SOUND
    ];
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    // Dapatkan 4 kana lain sebagai opsi salah
    const wrongOptions = unlockedKanas
      .filter(k => k.character !== correctKana.character)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
    
    // Gabungkan dan acak urutan opsi
    const allOptions = [correctKana, ...wrongOptions].sort(() => 0.5 - Math.random());
    
    return {
      type: questionType,
      question: (() => {
        switch (questionType) {
          case QUESTION_TYPES.ROMAJI_TO_KANA:
            return correctKana.romaji;
          case QUESTION_TYPES.KANA_TO_ROMAJI:
          case QUESTION_TYPES.KANA_TO_SOUND:
            return correctKana.character;
          case QUESTION_TYPES.SOUND_TO_KANA:
            return correctKana.character; // This will be replaced with actual sound playback
          default:
            return correctKana.romaji;
        }
      })(),
      options: allOptions,
      correctAnswer: correctKana,
      priority: correctKana.points < 50 ? 'low' : 
                correctKana.points <= 70 ? 'medium' : 'high'
    };
  });
  
  return questions;
};

// Fungsi untuk mendapatkan distribusi prioritas
export const getPriorityDistribution = (questions) => {
  const distribution = {
    low: 0,
    medium: 0,
    high: 0
  };
  
  questions.forEach(q => {
    distribution[q.priority]++;
  });
  
  return distribution;
};