
import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, userProfile, logout, updateUserProfile, uploadProfilePhoto } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || currentUser?.displayName || '',
    email: userProfile?.email || currentUser?.email || '',
    photoURL: userProfile?.photoURL || currentUser?.photoURL || ''
  });

  function handleChange(e) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const photoURL = await uploadProfilePhoto(file);
      setFormData(prev => ({ ...prev, photoURL }));
      setSuccess('Photo uploaded successfully!');
    } catch (error) {
      setError('Failed to upload photo: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      await updateUserProfile(formData);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to log out');
    }
  }

  function cancelEdit() {
    setFormData({
      displayName: userProfile?.displayName || currentUser?.displayName || '',
      email: userProfile?.email || currentUser?.email || '',
      photoURL: userProfile?.photoURL || currentUser?.photoURL || ''
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>My Profile</h2>
          <div className="header-actions">
            <button onClick={toggleTheme} className="theme-toggle">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="profile-photo-section">
          <div className="photo-container">
            {formData.photoURL ? (
              <img src={formData.photoURL} alt="Profile" className="profile-photo" />
            ) : (
              <div className="photo-placeholder">
                <span>No Photo</span>
              </div>
            )}
          </div>
          {isEditing && (
            <div className="photo-upload">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="upload-btn"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Change Photo'}
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              value={userProfile?.phoneNumber || 'Not provided'}
              disabled
              className="readonly-field"
            />
            <small className="field-note">Phone number cannot be changed</small>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="edit-btn"
              >
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  type="submit"
                  disabled={loading}
                  className="save-btn"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="cancel-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>

        <div className="profile-info">
          <h3>Account Information</h3>
          <div className="info-item">
            <span className="label">User ID:</span>
            <span className="value">{currentUser?.uid}</span>
          </div>
          <div className="info-item">
            <span className="label">Account Created:</span>
            <span className="value">
              {userProfile?.createdAt 
                ? new Date(userProfile.createdAt).toLocaleDateString() 
                : 'N/A'}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Last Updated:</span>
            <span className="value">
              {userProfile?.updatedAt 
                ? new Date(userProfile.updatedAt).toLocaleDateString() 
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
