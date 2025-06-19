import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';

const VerifyAccount = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token') || '');
    setName(params.get('name') || '');
    setEmail(params.get('email') || '');
    setContact(params.get('contact') || '');
  }, []);

  const verifyAndRegister = async () => {
    if (!token || !name || !email || !contact) {
      setStatus('error');
      setMessage('Not verified');
      return;
    }

    try {
      setStatus('verifying');

      const response = await axios.post(
        'https://printing-backend-htev.onrender.com/api/user/register/verify',
        { token, name, email, contact },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        setStatus('success');
        setMessage('Verified successfully');
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Not verified');
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
              <p>{message}</p>
            </Alert>
          )}

          {status === 'error' && (
            <Alert variant="danger">
              <p>{message}</p>
            </Alert>
          )}

          {status === 'idle' && (
            <Button variant="primary" onClick={verifyAndRegister}>
              Verify
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VerifyAccount;
