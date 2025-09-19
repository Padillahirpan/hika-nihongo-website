export const checkUnlockConditions = (kanaData) => {
  const updatedData = [...kanaData];
  const rows = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n', 
    'sokuon', 'ga', 'za', 'da', 'ba', 'pa', 
    'kya', 'sha', 'cha', 'nya', 'rya', 'gya', 'ja', 'bya', 'pya',
  ];
  let changed = false;

  for (let i = 0; i < rows.length - 1; i++) {
    const currentRow = rows[i];
    const nextRow = rows[i + 1];
    
    // Periksa apakah baris berikutnya masih terkunci
    const isNextRowLocked = updatedData.filter(k => k.row === nextRow && !k.unlocked).length > 0;
    
    if (!isNextRowLocked) continue;
    
    // Hitung total poin untuk baris saat ini
    const currentRowKanas = updatedData.filter(k => k.row === currentRow);
    const totalPoints = currentRowKanas.reduce((sum, kana) => sum + kana.points, 0);
    const averagePoints = totalPoints / currentRowKanas.length;
  
    // Jika rata-rata poin mencapai 70, buka baris berikutnya
    if (averagePoints >= 70) {
      updatedData.forEach(kana => {
        if (kana.row === nextRow) {
          kana.unlocked = true;
        }
      });
      changed = true;
      console.log(`Unlocked ${nextRow} row!`);
    }
  }

  if (changed) {
    return { data: [...updatedData], changed: true };
  } else {
    return { data: [...kanaData], changed: false };
  }
};

// Fungsi untuk mendapatkan status kunci berdasarkan baris
export const getRowStatus = (kanaData) => {
  const rows = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n'];
  const status = {};
  
  rows.forEach(row => {
    const rowKanas = kanaData.filter(k => k.row === row);
    status[row] = {
      unlocked: rowKanas.every(k => k.unlocked),
      averagePoints: rowKanas.reduce((sum, kana) => sum + kana.points, 0) / rowKanas.length
    };
  });
  
  return status;
};

export const groupByCategory = (data) => {
  return data.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
};