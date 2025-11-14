import React from 'react';

export const Loading = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="spinner-border text-primary" role="status">
      </div>
      <p className="mt-3 text-muted">Cargando...</p>
    </div>
  );
};

