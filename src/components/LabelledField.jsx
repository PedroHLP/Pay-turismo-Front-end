import React from 'react';

const LabelledField = ({ label, value }) => {
  return (
    <div>
      <span className="fw-bold me-2">{label}</span>
      {value}
    </div>
  );
};

export default LabelledField;
