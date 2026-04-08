import { z } from 'zod';

export const formSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    )
    .optional(),
    
  fullname: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
    
  pincode: z
    .string()
    .length(6, 'Pincode must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Pincode must contain only digits'),
    
  gender: z
    .enum(['male', 'female', 'other'], {
      errorMap: () => ({ message: 'Please select a gender' })
    }),
    
  phone: z
    .string()
    .length(10, 'Phone number must be exactly 10 digits')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'),
    
  banners: z
    .array(z.instanceof(File))
    .max(5, 'Maximum 5 banners allowed')
    .refine(
      (files) => files.every(file => file.size <= 5000000),
      'Each banner must be less than 5MB'
    )
    .refine(
      (files) => files.every(file => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)),
      'Banners must be in .jpg, .jpeg, .png or .webp format'
    )
    .optional(),
    
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be less than 200 characters'),
    
  discountPercentage: z
    .number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%')
    .optional()
});
