const QUESTION_TYPES = {
  ROMAJI_TO_KANA: 'romajiToKana',
  KANA_TO_ROMAJI: 'kanaToRomaji',
  SOUND_TO_KANA: 'soundToKana',
  KANA_TO_SOUND: 'kanaToSound',
};

const highPriorityQty = 7;
const mediumPriorityQty = 2;
const lowPriorityQty = 1;

export const generatePrioritizedQuestions = (kanaData, count = 10) => {
  // Filter hanya kana yang unlocked
  const unlockedKanas = kanaData.filter((kana) => kana.unlocked);

  console.log(`Unlocked Kanas: ${unlockedKanas.length}`);

  // Kategorikan kana berdasarkan poin

  const lowPriorityKanas = unlockedKanas.filter(
    (kana) => kana.points > 70 && kana.points <= 100,
  );
  const mediumPriorityKanas = unlockedKanas.filter(
    (kana) => kana.points >= 40 && kana.points <= 70,
  );
  const highPriorityKanas = unlockedKanas.filter((kana) => kana.points < 40);

  // console.log(
  //   `Low Priority Kanas: ${lowPriorityKanas.length} dan ${JSON.stringify(lowPriorityKanas)}`,
  //   `Medium Priority Kanas: ${mediumPriorityKanas.length} dan ${JSON.stringify(mediumPriorityKanas)}`,
  //   `High Priority Kanas: ${highPriorityKanas.length} dan ${JSON.stringify(highPriorityKanas)}`,
  // );

  // Hitung jumlah pertanyaan per kategori (7:2:1)
  const highCount = Math.min(highPriorityQty, highPriorityKanas.length);
  const mediumCount = Math.min(
    highCount == 0 ? highPriorityQty : mediumPriorityQty,
    mediumPriorityKanas.length,
  );
  const lowCount = Math.min(lowPriorityQty, lowPriorityKanas.length);

  console.log(
    `Low Count: ${lowCount}, Medium Count: ${mediumCount}, High Count: ${highCount}`,
  );

  // Jika kategori lowPriority kurang, distribusikan ke kategori lainnya
  let remaining = count - (lowCount + mediumCount + highCount);
  let extraMedium = 0;
  let extraHigh = 0;

  console.log(`Remaining: ${remaining}`);

  if (remaining > 0) {
    if (mediumPriorityKanas.length > mediumCount) {
      extraMedium = Math.min(
        remaining,
        mediumPriorityKanas.length - mediumCount,
      );
      remaining -= extraMedium;
    }

    if (remaining > 0 && highPriorityKanas.length > lowCount) {
      extraHigh = Math.min(remaining, highPriorityKanas.length - highCount);
      remaining -= extraHigh;
    }

    console.log(`Extra Medium: ${extraMedium}, Extra High: ${extraHigh}`);

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

          console.log(
            `high: ${highPriorityKanas.length}, medium: ${mediumPriorityKanas.length}, low: ${lowPriorityKanas.length}`,
          );

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
  const selectedMedium = selectRandomKanas(
    mediumPriorityKanas,
    mediumCount + extraMedium,
  );
  const selectedHigh = selectRandomKanas(
    highPriorityKanas,
    highCount + extraHigh,
  );

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
  const questions = selectedKanas.map((correctKana) => {
    // Tentukan jenis pertanyaan secara acak dari semua tipe yang tersedia
    const questionTypes = [
      QUESTION_TYPES.ROMAJI_TO_KANA,
      QUESTION_TYPES.KANA_TO_ROMAJI,
      QUESTION_TYPES.SOUND_TO_KANA,
      QUESTION_TYPES.KANA_TO_SOUND,
    ];
    const questionType =
      questionTypes[Math.floor(Math.random() * questionTypes.length)];

    // Dapatkan 4 kana lain sebagai opsi salah
    const wrongOptions = unlockedKanas
      .filter((k) => k.character !== correctKana.character)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    // Gabungkan dan acak urutan opsi
    const allOptions = [correctKana, ...wrongOptions].sort(
      () => 0.5 - Math.random(),
    );

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
      priority:
        correctKana.points < 50
          ? 'low'
          : correctKana.points <= 70
            ? 'medium'
            : 'high',
    };
  });

  return questions;
};

// Fungsi untuk mendapatkan distribusi prioritas
export const getPriorityDistribution = (questions) => {
  const distribution = {
    low: 0,
    medium: 0,
    high: 0,
  };

  questions.forEach((q) => {
    distribution[q.priority]++;
  });

  return distribution;
};

// Fungsi baru untuk generate 10 pertanyaan yang dioptimalkan
export const generateOptimizedQuestions = (kanaData) => {
  // 1. Filter kana yang unlocked == true
  const unlockedKanas = kanaData.filter((kana) => kana.unlocked);

  if (unlockedKanas.length === 0) {
    return [];
  }

  // 2. Kategorikan berdasarkan poin
  const highPriorityKanas = unlockedKanas.filter((kana) => kana.points < 50);
  const mediumPriorityKanas = unlockedKanas.filter(
    (kana) => kana.points >= 50 && kana.points <= 80,
  );
  const lowPriorityKanas = unlockedKanas.filter(
    (kana) => kana.points > 80 && kana.points <= 100,
  );

  // 3. Tentukan jumlah pertanyaan per prioritas: 7 high, 2 medium, 1 low
  const targetDistribution = {
    high: 7,
    medium: 2,
    low: 1,
  };

  // const selectedKanas = [];
  const usedKanaTypeCombos = new Set(); // Track kana-character + type combinations

  // Fungsi untuk memilih kana secara acak dari kategori tertentu
  const selectFromCategory = (category, count) => {
    const selected = [];

    if (category.length === 0) return selected;

    // Untuk high priority, izinkan kana yang sama dengan tipe berbeda
    // Untuk medium dan low, hindari duplikasi kana sama sekali
    const shuffled = [...category].sort(() => Math.random() - 0.5);
    const toSelect = Math.min(count, category.length);

    for (let i = 0; i < toSelect; i++) {
      selected.push(shuffled[i]);
    }

    return selected;
  };

  // Track kana dengan priority asli dan priority yang ditugaskan
  const selectedKanasWithPriority = [];

  // Pilih dari high priority - pastikan selalu 7 pertanyaan
  let selectedHigh = selectFromCategory(
    highPriorityKanas,
    targetDistribution.high,
  );
  selectedHigh.forEach((kana) => {
    selectedKanasWithPriority.push({ kana, assignedPriority: 'high' });
  });

  // Jika high priority kurang dari 7, pinjam dari medium priority
  let remainingHigh = targetDistribution.high - selectedHigh.length;
  if (remainingHigh > 0) {
    let borrowedFromMedium = selectFromCategory(
      mediumPriorityKanas,
      remainingHigh,
    );
    borrowedFromMedium.forEach((kana) => {
      selectedKanasWithPriority.push({ kana, assignedPriority: 'high' }); // Tetap ditandai sebagai high priority
    });
  }

  // Pilih dari medium priority yang tersisa (2 pertanyaan)
  let selectedMedium = selectFromCategory(
    mediumPriorityKanas,
    targetDistribution.medium,
  );
  selectedMedium.forEach((kana) => {
    selectedKanasWithPriority.push({ kana, assignedPriority: 'medium' });
  });

  // Pilih dari low priority (1 pertanyaan)
  let selectedLow = selectFromCategory(
    lowPriorityKanas,
    targetDistribution.low,
  );
  selectedLow.forEach((kana) => {
    selectedKanasWithPriority.push({ kana, assignedPriority: 'low' });
  });

  // Jika masih kurang dari 10, isi dengan kana acak dari unlocked
  while (selectedKanasWithPriority.length < 10) {
    if (unlockedKanas.length === 0) break;

    const randomIndex = Math.floor(Math.random() * unlockedKanas.length);
    const kana = unlockedKanas[randomIndex];
    // Berikan priority medium untuk pengisian
    selectedKanasWithPriority.push({ kana, assignedPriority: 'medium' });
  }

  // Extract kana untuk proses question generation
  const selectedKanas = selectedKanasWithPriority.map((item) => item.kana);

  // 4. Generate pertanyaan dengan tipe yang variatif
  const questions = [];

  selectedKanasWithPriority.forEach(({ kana, assignedPriority }) => {
    // 4 jenis pertanyaan yang tersedia
    const availableTypes = [
      QUESTION_TYPES.ROMAJI_TO_KANA,
      QUESTION_TYPES.KANA_TO_ROMAJI,
      QUESTION_TYPES.SOUND_TO_KANA,
      QUESTION_TYPES.KANA_TO_SOUND,
    ];

    // Cari tipe yang belum digunakan untuk kombinasi kana + tipe ini
    let questionType;
    const availableForKana = availableTypes.filter(
      (type) => !usedKanaTypeCombos.has(`${kana.character}-${type}`),
    );

    if (availableForKana.length > 0) {
      // Pilih acak dari tipe yang tersedia
      questionType =
        availableForKana[Math.floor(Math.random() * availableForKana.length)];
    } else {
      // Jika semua tipe sudah digunakan, pilih acak dari semua tipe (izinkan duplikasi untuk high priority)
      if (assignedPriority === 'high') {
        questionType =
          availableTypes[Math.floor(Math.random() * availableTypes.length)];
      } else {
        questionType =
          availableTypes[Math.floor(Math.random() * availableTypes.length)];
      }
    }

    // Track penggunaan kombinasi kana + tipe
    usedKanaTypeCombos.add(`${kana.character}-${questionType}`);

    // Dapatkan 4 kana lain sebagai opsi salah
    const wrongOptions = unlockedKanas
      .filter((k) => k.character !== kana.character)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    // Gabungkan dan acak urutan opsi
    const allOptions = [kana, ...wrongOptions].sort(() => 0.5 - Math.random());

    questions.push({
      type: questionType,
      question: (() => {
        switch (questionType) {
          case QUESTION_TYPES.ROMAJI_TO_KANA:
            return kana.romaji;
          case QUESTION_TYPES.KANA_TO_ROMAJI:
          case QUESTION_TYPES.KANA_TO_SOUND:
            return kana.character;
          case QUESTION_TYPES.SOUND_TO_KANA:
            return kana.character; // Will be replaced with sound playback
          default:
            return kana.romaji;
        }
      })(),
      options: allOptions,
      correctAnswer: kana,
      priority: assignedPriority, // Gunakan assignedPriority bukan priority asli
      originalPriority:
        kana.points < 50 ? 'high' : kana.points < 70 ? 'medium' : 'low', // Keep original for reference
    });
  });

  // Log distribusi untuk debugging
  const assignedDistribution = {
    high: questions.filter((q) => q.priority === 'high').length,
    medium: questions.filter((q) => q.priority === 'medium').length,
    low: questions.filter((q) => q.priority === 'low').length,
  };

  const originalDistribution = {
    high: questions.filter((q) => q.originalPriority === 'high').length,
    medium: questions.filter((q) => q.originalPriority === 'medium').length,
    low: questions.filter((q) => q.originalPriority === 'low').length,
  };

  console.log(
    `Assigned distribution - High: ${assignedDistribution.high}, Medium: ${assignedDistribution.medium}, Low: ${assignedDistribution.low}`,
  );
  console.log(
    `Original distribution - High: ${originalDistribution.high}, Medium: ${originalDistribution.medium}, Low: ${originalDistribution.low}`,
  );
  console.log(
    `Generated ${questions.length} questions with ${usedKanaTypeCombos.size} unique kana-type combinations`,
  );

  return questions;
};
