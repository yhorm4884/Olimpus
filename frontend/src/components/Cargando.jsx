import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const LoadingScreen = () => {
const { userId } = useParams();
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 20));
    }, 500);

    setTimeout(() => {
      clearInterval(timer);
      navigate(`/dashboard/user/${userId}`);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <CircularProgress variant="determinate" value={progress} />
      <Typography variant="body2" color="textSecondary" style={{ marginTop: '20px' }}>
        Cargando...
      </Typography>
    </div>
  );
};

export default LoadingScreen;