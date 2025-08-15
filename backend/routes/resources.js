// backend/routes/resources.js
import express from 'express';
import Resource from '../models/Resource.js';
import { ensureAuth } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all resources (paginated) for the main Resources page
// @route   GET /api/resources
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalResources = await Resource.countDocuments();
        const resources = await Resource.find({})
            .populate('author', 'displayName image')
            .sort({ timestamp: 'desc' })
            .skip(skip)
            .limit(limit)
            .lean();
        
        res.json({
            resources,
            currentPage: page,
            totalPages: Math.ceil(totalResources / limit),
        });
    } catch (err) {
        console.error('Error fetching paginated resources:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- THIS IS THE MISSING ROUTE ---
// @desc    Get resources for the currently logged-in user (for the Profile page)
// @route   GET /api/resources/me
router.get('/me', ensureAuth, async (req, res) => {
    try {
        const resources = await Resource.find({ author: req.user.id })
            .populate('author', 'displayName image')
            .sort({ timestamp: 'desc' })
            .lean();
        res.json(resources);
    } catch (err) {
        console.error('Error fetching user resources:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});
// ---------------------------------

// @desc    Create a new resource
// @route   POST /api/resources
router.post('/', ensureAuth, async (req, res) => {
    const { title, description, url, cloudinaryId } = req.body;
    if (!title || !description || !url || !cloudinaryId) {
        return res.status(400).json({ message: 'Missing required fields for resource.' });
    }
    try {
        const newResource = new Resource({
            title, description, url, cloudinaryId,
            author: req.user.id
        });
        let resource = await newResource.save();
        resource = await resource.populate('author', 'displayName image');
        res.status(201).json(resource);
    } catch (err) {
        console.error('Error creating resource:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource || resource.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not Authorized' });
        }
        await resource.deleteOne();
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting resource:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;