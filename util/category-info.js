// Fun and informative descriptions for each kana category
const categoryDescriptions = {
  Gojuon: {
    title: "🌟 Gojuon (五十音) - The Fantastic Fifty!",
    description: `Welcome to the foundation of Japanese writing! Gojuon literally means "50 sounds" (though it's actually 46 basic characters - they just rounded up for a catchier name! 😄).

Think of Gojuon as your Japanese alphabet's superheroes:
• The Vowel Squad (あ い う え お): Your starting lineup! These five are like the team leaders.
• The Consonant Crews: Each led by a different consonant (k, s, t, etc.), they team up with vowels to make awesome sounds!

Fun Fact: These characters are arranged in a super-smart way - they follow the "a, i, u, e, o" pattern, making them as easy to remember as your favorite song! 🎵`,
    examples: "あ (a), か (ka), さ (sa)...",
    difficulty: "Beginner-friendly! 🌱"
  },

  Sokuon: {
    title: "⚡ Sokuon (促音) - The Tiny Power-Up!",
    description: `Meet っ, the smallest but mightiest character in Japanese! This little superstar has one job: creating a brief pause that packs a punch!

It's like the "double tap" of Japanese writing:
• Makes consonants sound stronger (like in "Pokka" ポッカ)
• Creates that cool "stop-and-go" effect in words
• It's like adding a mini-turbo boost to your words! 🚀

Pro Tip: When you see っ, think of it as hitting the pause button on your game controller for a split second! ⏸️`,
    examples: "がっこう (gakkou - school), きって (kitte - stamp)",
    difficulty: "Small but tricky! 🎯"
  },

  "Dakuon & Handakuon": {
    title: "🎭 Dakuon & Handakuon (濁音 & 半濁音) - The Sound Transformers!",
    description: `Welcome to the transformation station! These are your regular kana characters with cool voice modifiers:

Dakuon (゛) - The Voice Activator:
• Turns K → G (か → が)
• Turns S → Z (さ → ざ)
• Turns T → D (た → だ)
• Like giving your kana a superhero voice changer! 🦸‍♂️

Handakuon (゜) - The Soft Power:
• Transforms H → P (は → ぱ)
• Like adding a gentle breeze to your sounds! 🌬️

Fun Fact: These marks are like magical accessories that transform your basic kana into new characters with new personalities! ✨`,
    examples: "ばか (baka), ぱん (pan), がんばれ (ganbare)",
    difficulty: "Medium - New sounds, same style! 🔄"
  },

  Youon: {
    title: "🎪 Youon (拗音) - The Dynamic Duo!",
    description: `Get ready for the coolest team-ups in Japanese! Youon is where characters join forces to create amazing new sounds!

It's like a dance party where:
• A regular-sized kana (き, し, ち...)
• Teams up with a tiny や, ゆ, or よ
• Together they create totally new sounds! 

Think of it as:
• Big kana: "Hey, want to make an awesome new sound?"
• Tiny や/ゆ/よ: "Let's do this!" 
• Together: "きょ (kyo)!" 🕺💃

Fun Fact: These combinations are like special fusion moves in your favorite anime - two characters combining their powers to create something awesome! ⚡`,
    examples: "きょうと (kyouto - Kyoto), しゃしん (shashin - photo)",
    difficulty: "Advanced - Double the fun! 🌟🌟"
  }
};

/**
 * Get detailed information about a kana category
 * @param {string} categoryTitle - The title of the category
 * @returns {string} Formatted information about the category
 */
export const getCategoryInfo = (categoryTitle) => {
  const info = categoryDescriptions[categoryTitle];
  if (!info) return "Category information not found! 🤔";

  return `${info.title}\n\n${info.description}\n\n📝 Examples: ${info.examples}\n\n🎮 Difficulty Level: ${info.difficulty}`;
};