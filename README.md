# Alpha Tech QR Service

QR Code service for lost pet rescue system - Alpha Tech Smart Pet Collar

## 🚀 Features

- **QR Code Generation**: Generate unique QR codes for each pet
- **Lost Pet Pages**: Responsive web pages when QR is scanned
- **Emergency Commands**: API endpoints for collar emergency functions
- **Real-time Notifications**: Automatic owner notifications on QR scan
- **Pet Information Display**: Complete pet and owner contact information

## 🏃 Quick Start

```bash
# Install dependencies
npm install

# Start the service
npm start

# Development mode
npm run dev
```

## 📡 API Endpoints

### QR Management
- `GET /found/:qrCode` - Display pet found page
- `POST /qr/register` - Register new QR code
- `GET /qr/list` - List all QR codes

### Collar Commands
- `POST /collar/emergency` - Send emergency commands to collar
- `GET /collar/status/:petId` - Get collar status

### Health Check
- `GET /health` - Service health status

## 🔧 Environment Variables

```bash
PORT=3004
NODE_ENV=development
```

## 🏗️ Tech Stack

- **Node.js** + **Express.js**
- **CORS** enabled
- **Axios** for HTTP requests
- **Real-time notifications**

## 📱 QR Code Flow

1. **Pet gets lost** → Owner activates SOS mode
2. **Collar emits sounds/lights** → Attracts attention
3. **Person finds pet** → Scans QR code
4. **Displays pet info** → Shows contact details
5. **Automatic notification** → Owner gets alerted
6. **Successful reunion** → Pet returns home safely

## 🚨 Emergency Features

- **Lost Mode Activation**: Enables collar sounds and lights
- **Priority QR Display**: Enhanced visibility for lost pets
- **Instant Notifications**: Real-time alerts to pet owners
- **Contact Integration**: Direct calling, WhatsApp, and email

## 📄 License

MIT License - Alpha Tech Smart Pet Collar System

---

🐕 **Saving pets, one QR code at a time** 🐾