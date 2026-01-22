const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Get user profile
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user', message: error.message });
    }
});

// Update user profile
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { name, phone, profileImage } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (profileImage) user.profileImage = profileImage;

        await user.save();

        res.json({ message: 'Profile updated successfully', user: await User.findById(user._id).select('-password') });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile', message: error.message });
    }
});

// Get wallet details
router.get('/:id/wallet', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('wallet');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ wallet: user.wallet });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch wallet', message: error.message });
    }
});

// Add money to wallet
router.post('/:id/wallet/add', authenticateToken, async (req, res) => {
    try {
        const { amount, description } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.wallet.balance += amount;
        user.wallet.transactions.push({
            type: 'credit',
            amount,
            description: description || 'Wallet top-up'
        });

        await user.save();

        res.json({ message: 'Money added successfully', wallet: user.wallet });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add money', message: error.message });
    }
});

// Add vehicle
router.post('/:id/vehicles', authenticateToken, async (req, res) => {
    try {
        const { type, plateNumber, model, isEV } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.vehicles.push({ type, plateNumber, model, isEV });
        await user.save();

        res.json({ message: 'Vehicle added successfully', vehicles: user.vehicles });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add vehicle', message: error.message });
    }
});

// Remove vehicle
router.delete('/:id/vehicles/:vehicleId', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.vehicles = user.vehicles.filter(v => v._id.toString() !== req.params.vehicleId);
        await user.save();

        res.json({ message: 'Vehicle removed successfully', vehicles: user.vehicles });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove vehicle', message: error.message });
    }
});

// Add saved place
router.post('/:id/saved-places', authenticateToken, async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.savedPlaces.push({ name, address, latitude, longitude });
        await user.save();

        res.json({ message: 'Place saved successfully', savedPlaces: user.savedPlaces });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save place', message: error.message });
    }
});

// Remove saved place
router.delete('/:id/saved-places/:placeId', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.savedPlaces = user.savedPlaces.filter(p => p._id.toString() !== req.params.placeId);
        await user.save();

        res.json({ message: 'Place removed successfully', savedPlaces: user.savedPlaces });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove place', message: error.message });
    }
});

const bcrypt = require('bcryptjs');

// Change Password
router.post('/:id/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash and save new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to change password', message: error.message });
    }
});

module.exports = router;
