const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

// Base de datos simulada de QR codes
const qrDatabase = {
  'PETD9DB6E1B': {
    petId: 'c9233072-2116-4b8f-87c3-d332893a7f43',
    petName: 'kelmin',
    ownerId: '6cfc0a78-f926-4993-b88a-c45d17e94487',
    ownerName: 'Fabian',
    ownerPhone: '+57 300 123 4567',
    ownerEmail: 'fabian@alphatech.com',
    petBreed: 'Doberman',
    petColor: 'Black and brown',
    emergencyContact: '+57 300 987 6543',
    isActive: true
  },
  'PET686293B4': {
    petId: 'lesly-pet-id',
    petName: 'lesly',
    ownerId: '0581b193-636f-4df5-828d-d1426fa2b014',
    ownerName: 'Noah',
    ownerPhone: '+57 300 123 4567',
    ownerEmail: 'noah123@mail.com',
    petBreed: 'Doberman',
    petColor: 'Black and brown',
    emergencyContact: '+57 300 987 6543',
    isActive: true
  }
};

// Endpoint para manejar QR escaneados
app.get('/found/:qrCode', async (req, res) => {
  const { qrCode } = req.params;
  
  // console.log(`🔍 QR Code escaneado: ${qrCode}`);
  
  const petData = qrDatabase[qrCode];
  
  if (!petData || !petData.isActive) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invalid QR Code - Alpha Tech</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
          .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .error { color: #e74c3c; font-size: 48px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error">❌</div>
          <h2>Invalid QR Code</h2>
          <p>Este código QR no está registrado o ha sido desactivado.</p>
          <p>Si crees que esto es un error, contacta a Alpha Tech.</p>
        </div>
      </body>
      </html>
    `);
  }

  // Registrar el escaneo
  try {
    await axios.post('http://localhost:3003/notifications', {
      type: 'PET_FOUND',
      title: '🐕 Mascota Encontrada',
      message: `¡Alguien ha escaneado el QR de ${petData.petName}! Revisa la ubicación.`,
      priority: 'HIGH',
      ownerId: petData.ownerId,
      petId: petData.petId,
      petName: petData.petName,
      metadata: {
        qrCode,
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent']
      }
    });
    // console.log(`✅ Notificación enviada al dueño de ${petData.petName}`);
  } catch (error) {
    console.error('❌ Error enviando notificación:', error.message);
  }

  // Página de mascota encontrada
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Pet Found! - Alpha Tech</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 20px; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
        }
        .container { 
          max-width: 500px; 
          margin: 0 auto; 
          background: white; 
          color: #333;
          padding: 30px; 
          border-radius: 15px; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .header { text-align: center; margin-bottom: 30px; }
        .pet-icon { font-size: 60px; margin-bottom: 15px; }
        .pet-info { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .contact-btn { 
          display: block; 
          width: 100%; 
          padding: 15px; 
          margin: 10px 0; 
          background: #28a745; 
          color: white; 
          text-decoration: none; 
          border-radius: 8px; 
          text-align: center; 
          font-weight: bold;
          border: none;
          font-size: 16px;
        }
        .contact-btn:hover { background: #218838; }
        .whatsapp { background: #25d366; }
        .whatsapp:hover { background: #1da851; }
        .emergency { background: #dc3545; }
        .emergency:hover { background: #c82333; }
        .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .label { font-weight: bold; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="pet-icon">🐕</div>
          <h1>Pet Found!</h1>
          <p>Thank you for helping a reunir a <strong>${petData.petName}</strong> con su familia</p>
        </div>

        <div class="pet-info">
          <h3>Información de la Mascota</h3>
          <div class="info-row">
            <span class="label">Nombre:</span>
            <span>${petData.petName}</span>
          </div>
          <div class="info-row">
            <span class="label">Raza:</span>
            <span>${petData.petBreed}</span>
          </div>
          <div class="info-row">
            <span class="label">Color:</span>
            <span>${petData.petColor}</span>
          </div>
          <div class="info-row">
            <span class="label">Dueño:</span>
            <span>${petData.ownerName}</span>
          </div>
        </div>

        <h3>Contactar al Dueño</h3>
        <p>El dueño ha sido notificado automáticamente. También puedes contactarlo directamente:</p>
        
        <a href="tel:${petData.ownerPhone}" class="contact-btn">
          📞 Llamar: ${petData.ownerPhone}
        </a>
        
        <a href="https://wa.me/${petData.ownerPhone.replace(/[^0-9]/g, '')}" class="contact-btn whatsapp">
          💬 WhatsApp
        </a>
        
        <a href="mailto:${petData.ownerEmail}" class="contact-btn">
          ✉️ Email: ${petData.ownerEmail}
        </a>
        
        <a href="tel:${petData.emergencyContact}" class="contact-btn emergency">
          🚨 Contacto de Emergencia: ${petData.emergencyContact}
        </a>

        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
          <p>🏷️ Powered by Alpha Tech - Smart Pet Collar</p>
          <p>Sistema de monitoreo inteligente para mascotas</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Endpoint para registro automático desde el backend
app.post('/qr/auto-register', (req, res) => {
  const { qrCode, petData } = req.body;
  
  if (!qrCode || !petData) {
    return res.status(400).json({
      success: false,
      message: 'qrCode y petData son requeridos'
    });
  }
  
  // Registrar el QR code con los datos de la mascota
  qrDatabase[qrCode] = {
    petId: petData.petId,
    petName: petData.petName,
    ownerId: petData.ownerId,
    ownerName: petData.ownerName,
    ownerPhone: petData.ownerPhone,
    ownerEmail: petData.ownerEmail,
    petBreed: petData.petBreed,
    petColor: petData.petColor,
    emergencyContact: petData.emergencyContact,
    isActive: petData.isActive,
    createdAt: new Date().toISOString()
  };
  
  // console.log(`✅ QR Code auto-registrado: ${qrCode} para ${petData.petName}`);
  
  res.json({
    success: true,
    message: 'QR Code registrado automáticamente',
    qrCode,
    url: `http://localhost:3004/found/${qrCode}`
  });
});

// Endpoint para registrar nuevos QR codes
app.post('/qr/register', (req, res) => {
  const { petName, ownerName, phone } = req.body;
  
  const qrCode = `PET${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  
  qrDatabase[qrCode] = {
    petId: `pet-${Date.now()}`,
    petName,
    ownerId: `owner-${Date.now()}`,
    ownerName,
    ownerPhone: phone,
    ownerEmail: `${(ownerName || 'unknown').toLowerCase()}@example.com`,
    petBreed: 'Mixed',
    petColor: 'Unknown',
    emergencyContact: phone,
    isActive: true,
    createdAt: new Date().toISOString()
  };
  
  // console.log(`✅ QR Code registrado: ${qrCode} para ${petName}`);
  
  res.json({
    success: true,
    message: 'QR Code registrado exitosamente',
    qrCode,
    url: `http://localhost:3004/found/${qrCode}`
  });
});

// Endpoint para listar QR codes
app.get('/qr/list', (req, res) => {
  res.json(qrDatabase);
});

// Collar emergency endpoint
app.post('/collar/emergency', (req, res) => {
  const { petId, action, settings } = req.body;
  
  // console.log(`🚨 Collar Emergency Command: ${action} for pet ${petId}`);
  
  switch (action) {
    case 'ACTIVATE_LOST_MODE':
      // console.log(`✅ Lost mode ACTIVATED for pet ${petId}`);
      // console.log(`   - Sound: ${settings?.soundEnabled ? 'ON' : 'OFF'}`);
      // console.log(`   - Lights: ${settings?.lightEnabled ? 'ON' : 'OFF'}`);
      // console.log(`   - Sound interval: ${settings?.soundInterval || 30}s`);
      break;
      
    case 'DEACTIVATE_LOST_MODE':
      // console.log(`✅ Lost mode DEACTIVATED for pet ${petId}`);
      break;
  }
  
  // console.log(`📡 Sending command to ESP32 collar...`);
  
  res.json({
    success: true,
    message: `Command ${action} sent successfully`,
    collarState: {
      isLost: action === 'ACTIVATE_LOST_MODE',
      soundEnabled: settings?.soundEnabled || false,
      lightEnabled: settings?.lightEnabled || false,
      soundInterval: settings?.soundInterval || 30,
      lightPattern: settings?.lightPattern || 'OFF'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Alpha Tech QR Service',
    timestamp: new Date().toISOString(),
    registeredQRs: Object.keys(qrDatabase).length
  });
});

app.listen(PORT, () => {
  // console.log(`🏷️ Alpha Tech QR Service running on port ${PORT}`);
  // console.log(`📱 QR Codes registrados: ${Object.keys(qrDatabase).length}`);
});