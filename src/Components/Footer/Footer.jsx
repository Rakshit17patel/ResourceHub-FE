import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f5f5f5',
        padding: '20px 0',
        textAlign: 'center',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Typography variant="body2" sx={{ color: '#333' }}>
        © {new Date().getFullYear()} ResourceHub. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
