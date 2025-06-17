import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';

const VerifyAccount = () => {
    const { userId, token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                const response = await axios.get(
                    `/api/users/verify-account/${userId}/${token}`
                );
                
                if (response.data.success) {
                    setStatus('success');
                    setMessage(response.data.message);
                    // Redirect after 3 seconds
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
                            <Alert.Heading>Verification Failed</Alert.Heading>
                            <p>{message}</p>
                            <div className="d-grid gap-2 mt-3">
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => window.location.reload()}
                                >
                                    Try Again
                                </button>
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/resend-verification')}
                                >
                                    Resend Verification
                                </button>
                            </div>
                        </Alert>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default VerifyAccount;