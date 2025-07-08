import { z } from 'zod';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      
      req.validatedData = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

// Common validation schemas
export const schemas = {
  register: z.object({
    body: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email format'),
      phone: z.string().min(10, 'Phone number must be at least 10 digits'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      gender: z.enum(['male', 'female']).optional(),
      avatar: z.string().url().optional()
    })
  }),

  login: z.object({
    body: z.object({
      phone: z.string().min(10, 'Phone number required'),
      password: z.string().min(1, 'Password required')
    })
  }),

  updateProfile: z.object({
    body: z.object({
      name: z.string().min(2).optional(),
      email: z.string().email().optional(),
      avatar: z.string().url().optional(),
      gender: z.enum(['male', 'female']).optional()
    })
  }),

  createOutfit: z.object({
    body: z.object({
      image: z.string().url('Invalid image URL'),
      category: z.string().min(1, 'Category is required')
    })
  }),

  createTask: z.object({
    body: z.object({
      title: z.string().min(1, 'Title is required'),
      description: z.string().optional(),
      time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
      priority: z.enum(['low', 'medium', 'high']).default('medium'),
      category: z.string().default('Personal'),
      reminderSet: z.boolean().default(true)
    })
  }),

  createDonation: z.object({
    body: z.object({
      name: z.string().min(1, 'Item name is required'),
      category: z.enum(['clothes', 'shoes']),
      description: z.string().optional(),
      condition: z.enum(['excellent', 'good', 'fair']).default('good'),
      image: z.string().url().optional()
    })
  })
};