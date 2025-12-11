# PlantCarePlanner 🌱

PlantCarePlanner is a web application that helps users manage the care of their plants by automatically generating a personalized care calendar. Users enter the plants they own, and the system creates a maintenance schedule that includes watering, fertilization, pruning, repotting, and other care tasks.

## Features

- 🌿 **Plant Database**: Includes common houseplants, outdoor plants, herbs, and garden varieties with predefined care requirements
- 📝 **User Plant Collection**: Add your plants with custom care settings and tags
- 📅 **Automated Care Calendar**: Dynamic care schedule that automatically generates tasks based on your plants
- ✅ **Task Management**: Mark tasks as complete and automatically schedule the next occurrence
- 📧 **Email Notifications**: Automated email reminders via Firebase Functions (daily digest or individual emails)
- 📊 **Dashboard**: Overview with statistics and upcoming tasks
- 🔐 **Google Authentication**: Secure login with Google (any user can sign in)

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Firebase (Firestore, Auth, Functions)
- **Deployment**: GitHub Pages
- **Styling**: Custom CSS with nature-inspired theme

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** > **Google** provider
3. Create a **Firestore Database** (start in test mode)
4. Copy your Firebase config to `src/config/firebase.js`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

### 5. Deploy

The app is configured to deploy automatically to GitHub Pages via GitHub Actions when you push to the `main` branch.

For manual deployment:
```bash
npm run deploy
```

## Project Structure

```
PlantCarePlanner/
├── src/
│   ├── components/       # React components
│   │   ├── Dashboard.jsx
│   │   ├── PlantDatabase.jsx
│   │   ├── MyPlants.jsx
│   │   ├── Calendar.jsx
│   │   ├── Settings.jsx
│   │   └── ...
│   ├── config/
│   │   └── firebase.js    # Firebase configuration
│   ├── utils/
│   │   ├── plantData.js   # Plant database and constants
│   │   └── taskScheduler.js # Task generation logic
│   └── App.jsx
├── functions/             # Firebase Functions for email notifications
├── public/               # Static assets
└── dist/                 # Build output (generated)
```

## Firebase Setup

### Required Firebase Services

1. **Authentication**: Google provider enabled
2. **Firestore**: Database for storing user plants and tasks
3. **Functions**: For sending email notifications (optional)

### Firestore Collections

- `userPlants`: User's plant collection
- `tasks`: Generated care tasks
- `users`: User settings and preferences

### Security Rules

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Firestore security rules.

## Email Notifications

Email notifications are handled by Firebase Functions. See `functions/index.js` for implementation.

To set up email notifications:
1. Configure email service in Firebase Functions
2. Deploy functions: `firebase deploy --only functions`
3. Enable notifications in app Settings

## Development

### Adding New Plants

Edit `src/utils/plantData.js` to add plants to the database. Each plant should include:
- Basic info (name, type, description)
- Care frequencies (watering, fertilizing, pruning, etc.)
- Care level (very-easy, easy, moderate)

### Customizing Styles

The app uses CSS custom properties defined in `src/index.css`. Modify these to change the color scheme:

```css
:root {
  --primary-green: #2d5016;
  --secondary-green: #4a7c3a;
  /* ... */
}
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions including:
- Firebase setup
- GitHub Pages configuration
- Email service setup
- Troubleshooting

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

