# Hiragana Drilling App

## Overview

Hiragana Drilling App is a web-based tool designed to help users improve their Hiragana character recognition skills. The app features a home page that displays all Hiragana characters in a grid format, with each character color-coded based on its mastery level. Users can click on a character to drill it, and receive immediate feedback on whether their answer was correct.

## Feature Progress

- Homepage ✅
- Hiragana page ✅
- Hiragana drill page ✅
- Katakana page ✅
- Katakana drill page ✅
- Add kana data (Gojuon, Sokuon, Dakuon, Youon) ✅
- Vocabulary page ⏳
- Vocabulary drill page ⏳
- Settings page ⏳
- About page ⏳
- PWA ⏳

## Features in Detail

### Home Page
- Displays all Hiragana characters in a grid
- Color-coded mastery levels for each character
- Quick access to drilling practice
- Persistent progress tracking

### Drilling Page
- Interactive character practice
- Real-time feedback on answers
- Progress tracking
- Session history
- Mastery level updates

## Local Storage

The app uses localStorage to persist:
- Individual character mastery levels
- Practice session history
- Overall progress

## Styling

The project uses:
- Tailwind CSS for styling
- Custom Google Fonts:
  - Noto Sans Japanese for Hiragana characters
  - Plus Jakarta Sans for Latin text
- Responsive design for all screen sizes

## Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write ."
  }
}
```

## Development

To start development:

1. Run the development server:
```bash
npm run dev
```

2. Make your changes
3. Format your code:
```bash
npm run format
```

4. Build for production:
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Google Fonts for the beautiful typography

## Support

For support, please open an issue in the GitHub repository.