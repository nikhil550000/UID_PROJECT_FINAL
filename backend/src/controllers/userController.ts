import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

// Generate JWT token
const generateToken = (email: string, role: string) => {
  return jwt.sign(
    { email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Login endpoint
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        phone_numbers: true,
        employee: true,
        admin: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated. Please contact administrator.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Get user permissions if employee
    let permissions: { permission_type: string }[] = [];
    if (user.employee) {
      permissions = await prisma.systemPermission.findMany({
        where: {
          role: user.role,
          department: user.employee.department,
          is_granted: true
        },
        select: {
          permission_type: true
        }
      });
    }

    // Generate JWT token
    const token = generateToken(user.email, user.role);

    // Update last login
    await prisma.user.update({
      where: { email },
      data: { 
        last_login: new Date(),
        failed_attempts: 0 // Reset failed attempts on successful login
      }
    });

    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
          primary_phone: user.primary_phone,
          employee: user.employee,
          admin: user.admin,
          permissions: permissions.map(p => p.permission_type)
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    // Increment failed attempts
    try {
      const { email } = req.body;
      if (email) {
        await prisma.user.update({
          where: { email },
          data: {
            failed_attempts: {
              increment: 1
            }
          }
        });
      }
    } catch (updateError) {
      console.error('Failed to update failed attempts:', updateError);
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error during login'
    });
  }
};

// Register endpoint
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = 'employee', primary_phone, department } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long'
      });
    }

    // Check password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return res.status(400).json({
        success: false,
        error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with associated employee/admin record
    const newUser = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password_hash: hashedPassword,
          role: role.toLowerCase(),
          primary_phone,
          is_active: true
        }
      });

      // Create employee record if role is employee
      if (role.toLowerCase() === 'employee' && department) {
        await tx.employee.create({
          data: {
            user_email: email,
            department,
            join_date: new Date()
          }
        });
      }

      // Create admin record if role is admin
      if (role.toLowerCase() === 'admin' && department) {
        await tx.admin.create({
          data: {
            user_email: email,
            admin_level: 1,
            department
          }
        });
      }

      return user;
    });

    // Generate JWT token
    const token = generateToken(newUser.email, newUser.role);

    // Return success response (don't include password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          primary_phone: newUser.primary_phone
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during registration'
    });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        primary_phone: true,
        is_active: true,
        last_login: true,
        created_at: true,
        updated_at: true,
        employee: {
          select: {
            department: true,
            employee_id: true,
            join_date: true
          }
        },
        admin: {
          select: {
            admin_level: true,
            department: true
          }
        },
        phone_numbers: {
          select: {
            phone: true,
            phone_type: true
          }
        }
        // Don't select password for security
      }
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
};

// Get user by email
export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        email: true,
        name: true,
        role: true,
        primary_phone: true,
        is_active: true,
        last_login: true,
        failed_attempts: true,
        created_at: true,
        updated_at: true,
        employee: {
          select: {
            department: true,
            employee_id: true,
            join_date: true,
            salary: true
          }
        },
        admin: {
          select: {
            admin_level: true,
            department: true,
            appointed_at: true
          }
        },
        phone_numbers: {
          select: {
            phone: true,
            phone_type: true
          }
        }
        // Don't select password for security
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get permissions if employee
    let permissions: string[] = [];
    if (user.employee) {
      const userPermissions = await prisma.systemPermission.findMany({
        where: {
          role: user.role,
          department: user.employee.department,
          is_granted: true
        },
        select: {
          permission_type: true
        }
      });
      permissions = userPermissions.map(p => p.permission_type);
    }

    res.json({
      success: true,
      data: {
        ...user,
        permissions
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
};

// Create user (admin endpoint)
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = 'employee', primary_phone, department, employee_id, admin_level } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with associated records
    const newUser = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password_hash: hashedPassword,
          role: role.toLowerCase(),
          primary_phone,
          is_active: true
        }
      });

      // Create employee record if role is employee
      if (role.toLowerCase() === 'employee' && department) {
        await tx.employee.create({
          data: {
            user_email: email,
            department,
            employee_id: employee_id || undefined,
            join_date: new Date()
          }
        });
      }

      // Create admin record if role is admin  
      if (role.toLowerCase() === 'admin' && department) {
        await tx.admin.create({
          data: {
            user_email: email,
            admin_level: admin_level || 1,
            department
          }
        });
      }

      return user;
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        primary_phone: newUser.primary_phone,
        is_active: newUser.is_active
      }
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { name, role, is_active, primary_phone } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        ...(name && { name }),
        ...(role && { role: role.toLowerCase() }),
        ...(typeof is_active === 'boolean' && { is_active }),
        ...(primary_phone !== undefined && { primary_phone })
      }
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        primary_phone: updatedUser.primary_phone,
        is_active: updatedUser.is_active
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { email }
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
};

// Add phone number for user
export const addPhoneNumber = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { phone, phone_type = 'secondary' } = req.body;

    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Email and phone number are required'
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Add phone number
    const phoneNumber = await prisma.userPhoneNumber.create({
      data: {
        user_email: email,
        phone,
        phone_type
      }
    });

    res.status(201).json({
      success: true,
      message: 'Phone number added successfully',
      data: phoneNumber
    });

  } catch (error) {
    console.error('Add phone error:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'Phone number already exists for this user'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to add phone number'
    });
  }
};

// Remove phone number
export const removePhoneNumber = async (req: Request, res: Response) => {
  try {
    const { email, phoneId } = req.params;

    if (!email || !phoneId) {
      return res.status(400).json({
        success: false,
        error: 'Email and phone ID are required'
      });
    }

    // Delete phone number
    await prisma.userPhoneNumber.delete({
      where: {
        id: parseInt(phoneId),
        user_email: email
      }
    });

    res.json({
      success: true,
      message: 'Phone number removed successfully'
    });

  } catch (error) {
    console.error('Remove phone error:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Phone number not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to remove phone number'
    });
  }
};
