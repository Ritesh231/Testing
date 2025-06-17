import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';

const VerifyAccount = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token'));
    setName(params.get('name'));
    setEmail(params.get('email'));
    setContact(params.get('contact'));

    setStatus('idle');
  }, []);

  const verifyAndRegister = async ({ token, name, email, contact }) => {
  try {
    setStatus('verifying');
    const response = await axios.post('/api/user/register/verify', {
      token,
      name,
      email,
      contact,
    });

    if (response.data.success) {
      setStatus('success');
      setMessage(response.data.message || 'Verification successful!');
    } else {
      throw new Error('Verification failed');
    }
  } catch (error) {
    setStatus('error');
    setMessage(
      error.response?.data?.message || 'Manual verification failed. Please try again.'
    );
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

          {status === 'error' && (
            <Alert variant="danger">
              <Alert.Heading>Failed!</Alert.Heading>
              <p>{message}</p>
            </Alert>
          )}
<button
  className="btn btn-primary mt-3"
  onClick={verifyAndRegister}
  disabled={!token || !email || !name || !contact || status === 'verifying'}
>
  {status === 'verifying' ? 'Verifying...' : 'Verify'}
</button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VerifyAccount;
