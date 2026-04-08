import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './validationSchema';

const App = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [bannerPreviews, setBannerPreviews] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    setValue,
    watch,
    reset
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: '',
      // pincode: '',
      // gender: '',
      // phone: '',
      // address: '',
      // discountPercentage: 0
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      clearErrors('image');
    }
  };

  const handleBannerChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setValue('banners', files);
      
      const newPreviews = files.map(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBannerPreviews(prev => [...prev.filter(p => p.id !== file.name), {
            id: file.name,
            url: reader.result,
            name: file.name
          }]);
        };
        reader.readAsDataURL(file);
        return { id: file.name, url: '', name: file.name };
      });
      
      clearErrors('banners');
    }
  };

  const removeBanner = (id) => {
    setBannerPreviews(prev => prev.filter(p => p.id !== id));
    const currentBanners = watch('banners') || [];
    const filteredBanners = currentBanners.filter(file => file.name !== id);
    setValue('banners', filteredBanners);
  };

  const onSubmit = async (data) => {
    try {
      console.log('Form submitted:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        reset();
        setImagePreview(null);
        setBannerPreviews([]);
      }, 3000);
      
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Registration Form</h1>
      
      {isSubmitted && (
        <div className="success-message">
          Form submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Image Upload */}
        <div className="form-group">
          <label className="form-label">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          {errors.image && (
            <p className="error-message">{errors.image.message}</p>
          )}
          {imagePreview && (
            <div className="file-preview">
              <div className="file-preview-item">
                <img src={imagePreview} alt="Profile" />
              </div>
            </div>
          )}
        </div>

        {/* Full Name */}
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            {...register('fullname')}
            className="form-input"
            placeholder="Enter your full name"
          />
          {errors.fullname && (
            <p className="error-message">{errors.fullname.message}</p>
          )}
        </div>

        {/* Pincode */}
        {/* <div className="form-group">
          <label className="form-label">Pincode *</label>
          <input
            type="text"
            {...register('pincode')}
            className="form-input"
            placeholder="Enter 6-digit pincode"
            maxLength={6}
          />
          {errors.pincode && (
            <p className="error-message">{errors.pincode.message}</p>
          )}
        </div> */}

        {/* Gender */}
        {/* <div className="form-group">
          <label className="form-label">Gender *</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="male"
                {...register('gender')}
              />
              Male
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="female"
                {...register('gender')}
              />
              Female
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="other"
                {...register('gender')}
              />
              Other
            </label>
          </div>
          {errors.gender && (
            <p className="error-message">{errors.gender.message}</p>
          )}
        </div> */}

        {/* Phone */}
        {/* <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input
            type="tel"
            {...register('phone')}
            className="form-input"
            placeholder="Enter 10-digit mobile number"
            maxLength={10}
          />
          {errors.phone && (
            <p className="error-message">{errors.phone.message}</p>
          )}
        </div> */}

        {/* Multi Banner Upload */}
        <div className="form-group">
          <label className="form-label">Banners (Max 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleBannerChange}
            className="file-input"
          />
          {errors.banners && (
            <p className="error-message">{errors.banners.message}</p>
          )}
          {bannerPreviews.length > 0 && (
            <div className="file-preview">
              {bannerPreviews.map((banner) => (
                <div key={banner.id} className="file-preview-item">
                  <img src={banner.url} alt={banner.name} />
                  <button
                    type="button"
                    className="file-remove"
                    onClick={() => removeBanner(banner.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Address */}
        {/* <div className="form-group">
          <label className="form-label">Address *</label>
          <textarea
            {...register('address')}
            className="form-textarea"
            placeholder="Enter your complete address"
          />
          {errors.address && (
            <p className="error-message">{errors.address.message}</p>
          )}
        </div> */}

        {/* Discount Percentage */}
        {/* <div className="form-group">
          <label className="form-label">Discount Percentage (%)</label>
          <input
            type="number"
            {...register('discountPercentage', { valueAsNumber: true })}
            className="form-input"
            placeholder="Enter discount percentage"
            min={0}
            max={100}
            step={0.1}
          />
          {errors.discountPercentage && (
            <p className="error-message">{errors.discountPercentage.message}</p>
          )}
        </div> */}

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Form'}
        </button>
      </form>
    </div>
  );
};

export default App;
