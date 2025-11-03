import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not set');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName: uri.split('/').pop().split('?')[0] });
  console.log('MongoDB connected');
};
