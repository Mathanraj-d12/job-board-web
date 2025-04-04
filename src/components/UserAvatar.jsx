import React from 'react';
import { Avatar } from '@mui/material';

/**
 * UserAvatar component that displays either the user's profile picture or their first name initial
 * 
 * @param {Object} props - Component props
 * @param {Object} props.user - User object containing displayName and photoURL
 * @param {number} props.width - Width of the avatar in pixels
 * @param {number} props.height - Height of the avatar in pixels
 * @param {Object} props.sx - Additional MUI styling
 * @returns {JSX.Element} Avatar component
 */
const UserAvatar = ({ user, width = 32, height = 32, sx = {} }) => {
  // Get the first letter of the user's name for the fallback
  const getInitial = () => {
    if (!user) return '?';
    
    // If user has a displayName, use the first letter
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    
    // If user has an email but no displayName, use the first letter of the email
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    // Default fallback
    return '?';
  };

  // Generate a background color based on the user's name or email
  const getBackgroundColor = () => {
    if (!user) return '#9CA3AF'; // Default gray
    
    const colorOptions = [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#06B6D4', // Cyan
      '#F97316', // Orange
    ];
    
    const nameOrEmail = user.displayName || user.email || '';
    const charCode = nameOrEmail.charCodeAt(0) || 0;
    const index = charCode % colorOptions.length;
    
    return colorOptions[index];
  };

  return (
    <Avatar
      alt={user?.displayName || 'User Profile'}
      src={user?.photoURL || ''}
      sx={{
        width,
        height,
        bgcolor: !user?.photoURL ? getBackgroundColor() : undefined,
        fontWeight: 'bold',
        border: '2px solid white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        ...sx
      }}
    >
      {!user?.photoURL && getInitial()}
    </Avatar>
  );
};

export default UserAvatar;