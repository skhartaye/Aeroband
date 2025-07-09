<<<<<<< HEAD
# Aeroband

A modern, customizable web application built with React, TypeScript, and Vite. Designed for deployment on custom domains with full developer control.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite
- **Responsive Design**: Mobile-first approach with modern CSS
- **Custom Domain Ready**: Configured for deployment on custom domains
- **Developer Friendly**: Easy to customize and extend
- **Performance Optimized**: Fast loading and smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Modern CSS with CSS Variables
- **Routing**: React Router DOM
- **Deployment**: Netlify (with custom domain support)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/skhartaye/Aeroband.git
   cd Aeroband
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🌐 Deployment

### Netlify Deployment

1. **Connect to Netlify**
   - Push your code to GitHub
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Custom Domain Setup**
   - In Netlify dashboard, go to Domain settings
   - Add your custom domain (aeroband.org)
   - Configure DNS settings as instructed

### Squarespace Domain Configuration

Since you have a Squarespace domain, you'll need to:

1. **Configure DNS Records**
   - Add CNAME record pointing to your Netlify site
   - Or use Netlify's nameservers if transferring DNS

2. **SSL Certificate**
   - Netlify provides automatic SSL certificates
   - Ensure HTTPS is enabled

## 🎨 Customization

### Colors and Styling
Edit CSS variables in `src/index.css`:
```css
:root {
  --primary-color: #6366f1;
  --primary-dark: #4f46e5;
  --secondary-color: #f8fafc;
  /* ... more variables */
}
```

### Content
- **Home Page**: Edit `src/pages/Home.tsx`
- **About Page**: Edit `src/pages/About.tsx`
- **Contact Page**: Edit `src/pages/Contact.tsx`
- **Navigation**: Edit `src/components/Header.tsx`

### Adding New Pages
1. Create new component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Header.tsx`

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   └── Header.tsx      # Navigation header
├── pages/              # Page components
│   ├── Home.tsx        # Home page
│   ├── About.tsx       # About page
│   └── Contact.tsx     # Contact page
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Environment Variables

Create a `.env` file for environment-specific variables:
```env
VITE_API_URL=your_api_url
VITE_SITE_NAME=Aeroband
```

## 🚀 Performance

- **Code Splitting**: Automatic with Vite
- **Image Optimization**: Use WebP format when possible
- **Caching**: Configured for optimal caching
- **Lazy Loading**: Implement for heavy components

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔒 Security

- HTTPS enforced
- Security headers configured
- XSS protection enabled
- Content Security Policy ready

## 📞 Support

For questions or support:
- Email: hello@aeroband.org
- Website: aeroband.org

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for custom domain development 
=======
# Aeroband
>>>>>>> 63a5a9269e87925e1038a5beddc8718f9ac03cc5
