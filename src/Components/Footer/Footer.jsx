import React from 'react';
import { Box, Typography } from '@mui/material';
import { CONSTANTS } from '../../Theme/Constants';

const Footer = () => {
  const { COLORS } = CONSTANTS;

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: COLORS.PrimaryBackground,
        padding: '20px 0',
        textAlign: 'center',
        borderTop: `1px solid ${COLORS.LightGrey}`,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <Typography variant="body2" sx={{ color: COLORS.MenuIcon }}>
        © {new Date().getFullYear()} ResourceHub. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
