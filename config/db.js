// import mongoose from 'mongoose';

// /**
//  * MongoDB database connection function
//  * MongoDB database se connect karne ke liye function
//  */
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       // Mongoose ke latest features use karne ke liye
//       // useNewUrlParser aur useUnifiedTopology ab default hai
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;

import mongoose from 'mongoose';

// 🔴 Production me index auto create mat hone do
mongoose.set('autoIndex', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,

      maxPoolSize: 10,
      minPoolSize: 2,

      retryWrites: true,
      family: 4, // ⭐ IPv4 force (timeout fix)
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
