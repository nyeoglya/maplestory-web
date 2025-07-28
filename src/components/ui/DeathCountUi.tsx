"use client";

import React from 'react';

const DeathCountUi: React.FC = () => {
  return (
     <div style={{
      position: 'absolute',
      display: 'flex',
      flexDirection: 'row',
      width: 120,
      top: 40,
      left: 'calc(50% - 230px)',
      backgroundColor: '#0a070799',
      padding: 15,
      gap: 10,
      borderRadius: 5,
    }}>
      <div style={{
        fontSize: 12,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <p>Death</p>
        <p>Count</p>
      </div>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 2,
      }}>
        <p style={{color: '#dd628dff', fontSize: 25,}}>05</p>
      </div>
    </div>
  );
};

export default DeathCountUi;
