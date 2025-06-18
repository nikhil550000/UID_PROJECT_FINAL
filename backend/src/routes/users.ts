import express from 'express';
import {
  getAllUsers,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  registerUser,
  addPhoneNumber,
  removePhoneNumber
} from '../controllers/userController';

const router = express.Router();

// Authentication routes
router.post('/login', loginUser);
router.post('/register', registerUser);

// User CRUD routes
router.get('/', getAllUsers);
router.get('/:email', getUserByEmail);
router.post('/', createUser);
router.put('/:email', updateUser);
router.delete('/:email', deleteUser);

// Phone number management
router.post('/:email/phones', addPhoneNumber);
router.delete('/:email/phones/:phoneId', removePhoneNumber);

export default router;
