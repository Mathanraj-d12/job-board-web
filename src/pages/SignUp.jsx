import { useState } from "react";
import { Box, Typography, TextField, Button, Container, Alert, Divider, CircularProgress, InputAdornment, IconButton } from "@mui/material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, signInWithGoogle, createUserProfile } from "../firebase";
import { useNavigate } from "react-router-dom";
import googleLogo from "../assets/google-logo.svg";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setLoading(true);

    if (!validateForm()) {
      setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
      setLoading(false);
      return;
    }

    try {
      // Trim the email to remove any accidental whitespace
      const trimmedEmail = formData.email.trim();
      console.log("Attempting to create account with email:", trimmedEmail);

      // Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, formData.password);
      console.log("Account created successfully:", userCredential.user.email);

      try {
        // Update the user's display name in Firebase Auth
        await updateProfile(userCredential.user, {
          displayName: formData.fullName
        });
        console.log("User profile updated with display name:", formData.fullName);

        // Create a user profile in Firestore with additional data
        await createUserProfile(userCredential.user, {
          fullName: formData.fullName,
          userType: 'jobseeker', // Default user type
          createdVia: 'email',
          isProfileComplete: false
        });
        console.log("User profile created in Firestore successfully");
      } catch (profileError) {
        console.error("Error updating user profile:", profileError);
        // Continue with sign-up even if profile update fails
        // This ensures the user can still log in later
      }

      console.log("User profile created in Firestore");
      navigate("/");
    } catch (error) {
      console.error("Error during sign up:", error);
      let errorMessage = "An error occurred during sign up. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email is already in use";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email format";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak. Please use a stronger password";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your internet connection";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many requests. Please try again later";
          break;
      }

      setSubmitError(errorMessage);
      setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setSubmitError("");
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Error during Google sign in:", error);
      setSubmitError("An error occurred during Google sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Container className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <Box>
        <Typography component="h1" variant="h4" className="font-bold text-blue-600 mb-4 text-center">
          Sign Up
        </Typography>
        {submitError && <Alert severity="error" className="mb-3">{submitError}</Alert>}
        <Box component="form" onSubmit={handleSubmit} className="space-y-4">
          <TextField
            required
            fullWidth
            label="Full Name"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
            className="border rounded-md p-2"
          />
          <TextField
            required
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            className="border rounded-md p-2"
          />
          <TextField
            required
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            className="border rounded-md p-2"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            required
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            className="border rounded-md p-2"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleToggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition duration-300"
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
          <Typography variant="body2" className="text-center mt-2">
            Already have an account? <Button
              variant="text"
              color="primary"
              onClick={() => navigate("/signin")}
              className="p-0 min-w-0"
            >
              Sign In
            </Button>
          </Typography>
        </Box>
        <Divider className="my-4">
          <Typography variant="body2" className="text-gray-500">OR</Typography>
        </Divider>
        <Button 
          fullWidth 
          variant="outlined" 
          color="primary" 
          size="large" 
          onClick={handleGoogleSignIn} 
          disabled={loading}
          className="border-blue-600 text-blue-600 rounded-md py-2 hover:bg-blue-600 hover:text-white transition duration-300"
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img src={googleLogo} alt="Google" style={{ width: 24, height: 24 }} />
          {loading ? <CircularProgress size={24} /> : "Continue with Google"}
        </Button>
      </Box>
    </Container>
  );
}

export default SignUp;
