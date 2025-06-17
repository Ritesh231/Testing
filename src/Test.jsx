import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';

const VerifyAccount = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  // Account verification via URL with userId and token
  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await axios.get(
          `/api/users/verify-account/${userId}/${token}`
        );

        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message);
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.message || 
          'Account verification failed. Please try again.'
        );
      }
    };

    verifyAccount();
  }, [userId, token, navigate]);

  // 👇 Moved OUTSIDE of useEffect
  const verifyAndRegister = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');
    const contact = params.get('contact');

    try {
      await axios.post('/api/users/verify', { token, name, email, contact });
      navigate('/login');
    } catch (error) {
      alert('Manual verification failed. Please try again.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="shadow p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <Card.Body className="text-center">
          <h2 className="mb-4">Account Verification</h2>

          {status === 'verifying' && (
            <>
              <Spinner animation="border" role="status" />
              <p className="mt-3">Verifying your account...</p>
            </>
          )}

          {status === 'success' && (
            <Alert variant="success">
              <Alert.Heading>Success!</Alert.Heading>
              <p>{message}</p>
              <p>Redirecting to login page...</p>
            </Alert>
          )}

          {/* Optional: button to manually trigger verify */}
          <button className="btn btn-primary mt-3" onClick={verifyAndRegister}>
            Verify
          </button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VerifyAccount;
