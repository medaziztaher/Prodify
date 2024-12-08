const mongoose = require('mongoose');
const MONGODB_URL =process.env.MONGODB_URL


const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connecté à MongoDB');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB', error);
    process.exit(1);
  }
};

module.exports = connectDB;