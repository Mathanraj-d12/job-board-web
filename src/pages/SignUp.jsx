
import { useState } from "react";
import { Box, Typography, TextField, Button, Container, Alert, Divider, CircularProgress, InputAdornment, IconButton } from "@mui/material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, signInWithGoogle, createUserProfile, checkIfUserExists, sendVerificationEmail } from "../firebase";
import { useNavigate } from "react-router-dom";
import googleLogo from "../assets/google-logo.svg";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// List of common disposable email domains
const disposableEmailDomains = [
  "10minutemail.com", "temp-mail.org", "fakeinbox.com", "tempinbox.com", "mailinator.com",
  "guerrillamail.com", "guerrillamail.net", "guerrillamail.org", "sharklasers.com",
  "yopmail.com", "mailnesia.com", "mailcatch.com", "tempr.email", "dispostable.com",
  "tempmail.net", "spamgourmet.com", "trashmail.com", "trashmail.net", "mailnull.com",
  "mt2015.com", "mvrht.com", "mytemp.email", "tempemail.co", "tempmail.de", "throwawaymail.com",
  "wegwerfemail.de", "einrot.com", "fakemailgenerator.com", "armyspy.com", "cuvox.de",
  "dayrep.com", "einrot.de", "fleckens.hu", "gustr.com", "jourrapide.com", "rhyta.com",
  "superrito.com", "teleworm.us", "temp-mail.ru", "anonbox.net", "mintemail.com",
  "opayq.com", "spambog.com", "spambog.de", "spambog.ru", "tempmailaddress.com",
  "tempmailer.com", "temporarily.de", "temporarymail.net", "getnada.com", "emailfake.com",
  "emailondeck.com", "emailtemporario.com.br", "mohmal.com", "tempail.com", "tempmailgen.com",
  "tempmailo.com", "tempmails.org", "temp-mails.com", "throwawaymail.org", "trbvm.com",
  "cs.email", "maildrop.cc", "harakirimail.com", "33mail.com", "anonymousemail.me",
  "getairmail.com", "mailexpire.com", "mailnesia.com", "mailmetrash.com", "inboxalias.com",
  "discard.email", "discardmail.com", "discardmail.de", "spamex.com", "tempinbox.co.uk",
  "fake-box.com", "safetymail.info", "throwam.com", "throwawayemail.com", "tradermail.info",
  "trash2009.com", "trashymail.com", "freemail.ms", "mailquack.com", "incognitomail.com",
  "mailcatch.com", "chammy.info", "freemail.ms", "mailforspam.com", "spaml.com",
  "jetable.org", "mail-temporaire.fr", "nospam.ze.tc", "kurzepost.de", "objectmail.com",
  "proxymail.eu", "rcpt.at", "trash-mail.at", "trashmail.at", "trashmail.me",
  "wegwerfmail.de", "wegwerfmail.net", "wegwerfmail.org", "sofimail.com", "spamfree24.org",
  "spamfree24.de", "spamfree24.eu", "spamfree24.info", "spamherelots.com", "thisisnotmyrealemail.com",
  "veryrealemail.com", "mailinator.net", "mailinator2.com", "notmailinator.com", "mailinator.org"
];

/**
 * Check if an email is from a disposable email provider
 * @param {string} email - The email to check
 * @returns {boolean} - True if the email is from a disposable provider
 */
const isDisposableEmail = (email) => {
  if (!email) return false;

  // Extract the domain from the email
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;

  // Check if the domain is in our list of disposable email domains
  return disposableEmailDomains.includes(domain);
};

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
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (isDisposableEmail(formData.email)) {
      newErrors.email = "Please use your original email address. Disposable or temporary email addresses are not allowed.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
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

      // We'll skip the pre-check for existing users and let Firebase handle it
      // This avoids potential inconsistencies between our check and Firebase's check

      // Create the user in Firebase Authentication
      console.log("Attempting to create user with:", { email: trimmedEmail, passwordLength: formData.password.length });
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, formData.password);
      console.log("User created successfully:", userCredential.user.uid);

      try {
        // Update the user's display name in Firebase Auth
        await updateProfile(userCredential.user, {
          displayName: formData.fullName
        });

        // Create a user profile in Firestore with additional data
        await createUserProfile(userCredential.user, {
          fullName: formData.fullName,
          userType: 'jobseeker', // Default user type
          createdVia: 'email',
          isProfileComplete: false,
          emailVerified: false
        });

        // Send email verification
        await sendVerificationEmail(userCredential.user);

        // Show success message
        setSubmitError("");
        setLoading(false);

        // Show success message and redirect to home page
        alert("Account created successfully! Please check your email to verify your account before signing in.");
        navigate("/signin");
        return;
      } catch (profileError) {
        console.error("Error updating user profile:", profileError);
        // Continue with sign-up even if profile update fails
        // This ensures the user can still log in later
      }

      // If we get here, the account was created but there was an issue with profile update or email verification
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Error during sign up:", error.code, error.message);
      // Log the full error object for debugging
      console.log("Full error object:", JSON.stringify(error, null, 2));
      let errorMessage = "An error occurred during sign up. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists. Please sign in instead.";
          // Add a button to navigate to sign-in page
          setTimeout(() => {
            navigate("/signin");
          }, 2000); // Redirect after 2 seconds
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email format. Please enter a valid email address.";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak. Please use a stronger password (at least 6 characters).";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your internet connection and try again.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many requests. Please try again later.";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Email/password accounts are not enabled. Please contact support.";
          break;
        case "auth/internal-error":
          errorMessage = "An internal error occurred. Please try again later.";
          break;
        case "auth/invalid-credential":
          errorMessage = "The email provider may be blocking sign-up attempts. Please try a different email address.";
          break;
        default:
          errorMessage = `Sign-up error: ${error.message}`;
          console.log(`Unhandled sign-up error code: ${error.code}`);
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)'
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'white',
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              p: 4,
              pb: 3,
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
              color: 'white',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {/* Background Pattern */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
              }}
            />

            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                position: 'relative',
                zIndex: 1
              }}
            >
              Create an Account
            </Typography>

            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                position: 'relative',
                zIndex: 1
              }}
            >
              Join our platform to discover job opportunities
            </Typography>
          </Box>

          {/* Form Section */}
          <Box sx={{ p: 4 }}>
            {submitError && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)'
                }}
              >
                {submitError}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5
              }}
            >
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
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
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
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
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
                helperText={errors.password || "Password must be at least 6 characters"}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
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
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
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

              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  mt: -1
                }}
              >
                By signing up, you agree to our Terms of Service and Privacy Policy
              </Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(0, 118, 255, 0.39)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(0, 118, 255, 0.45)',
                    transform: 'translateY(-2px)'
                  },
                  mt: 1
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Create Account"}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Already have an account?{' '}
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => navigate("/signin")}
                    sx={{
                      fontWeight: 600,
                      p: 0,
                      minWidth: 'auto',
                      textTransform: 'none',
                      verticalAlign: 'baseline'
                    }}
                  >
                    Sign In
                  </Button>
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', px: 1 }}>
                OR
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              color="primary"
              size="large"
              onClick={handleGoogleSignIn}
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                borderWidth: 1,
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  borderWidth: 1,
                  bgcolor: 'rgba(37, 99, 235, 0.04)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <img src={googleLogo} alt="Google" style={{ width: 20, height: 20 }} />
              {loading ? <CircularProgress size={24} /> : "Continue with Google"}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default SignUp;
