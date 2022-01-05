import React from "react";
function FormGroup({ name, value, onChange, labelText }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{labelText}</label>
      <input
        type="number"
        step="1"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default FormGroup;
