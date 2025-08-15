// backend/routes/posts.js
import express from 'express';
import Post from '../models/Post.js';
import { ensureAuth } from '../middleware/auth.js';

const router = express.Router();

// GET all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate('author', 'displayName image')
            .populate('comments.author', 'displayName image')
            .sort({ timestamp: 'desc' })
            .lean();
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET posts for the currently logged-in user
router.get('/me', ensureAuth, async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user.id })
            .populate('author', 'displayName image')
            .populate('comments.author', 'displayName image')
            .sort({ timestamp: 'desc' })
            .lean();
        res.json(posts);
    } catch (err) {
        console.error('Error fetching user posts:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST a new post
router.post('/', ensureAuth, async (req, res) => {
    try {
        const newPost = new Post({ content: req.body.content, author: req.user.id });
        let post = await newPost.save();
        post = await post.populate('author', 'displayName image');
        res.status(201).json(post);
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- THIS IS THE CRUCIAL ROUTE ---
// @desc    Delete a post
// @route   DELETE /api/posts/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not Authorized' });
    }
    await post.deleteOne();
    res.status(204).send(); // Success, no content to send back
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Server Error while deleting post.' });
  }
});
// ---------------------------------

// Like/Unlike a post
router.patch('/:id/like', ensureAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const likeIndex = post.likes.indexOf(req.user.id);
        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1);
        } else {
            post.likes.push(req.user.id);
        }
        await post.save();
        res.json(post);
    } catch (err) {
        console.error('Error liking post:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add a comment to a post
router.post('/:id/comments', ensureAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        post.comments.push({ text: req.body.text, author: req.user.id });
        await post.save();
        const updatedPost = await Post.findById(post._id)
            .populate('author', 'displayName image')
            .populate('comments.author', 'displayName image');
        res.status(201).json(updatedPost);
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;