// backend/models/Resource.js
import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    
    // We only store the URL from Cloudinary and its ID
    url: { type: String, required: true },
    cloudinaryId: { type: String, required: true },

    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now }
});

const Resource = mongoose.model('Resource', ResourceSchema);
export default Resource;