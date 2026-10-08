'use strict';
require('dotenv').config();
const {createApp}=require('./src/app');
const {connectMongo,mongoose}=require('./src/mongo');
async function start(){const port=Number(process.env.PORT||3000);if(process.env.MONGODB_URI && !/YOUR_|YOUR_CLUSTER/.test(process.env.MONGODB_URI)){try{await connectMongo(process.env.MONGODB_URI);console.log('MongoDB connected.')}catch(e){console.error('MongoDB connection failed:',e.message);if(process.env.NODE_ENV==='production')process.exit(1);}}
 else if(process.env.NODE_ENV==='production')throw new Error('MONGODB_URI must be configured in production.');
 else console.warn('Preview mode: no MongoDB connection. APIs return 503 until configured.');
 const server=createApp().listen(port,()=>console.log(`Khushpreet portfolio: http://localhost:${port}`));
 async function stop(){server.close();await mongoose.disconnect();process.exit(0)}process.on('SIGTERM',stop);process.on('SIGINT',stop);
 return server;}
if(require.main===module)start().catch(e=>{console.error(e);process.exitCode=1});
module.exports={start};
