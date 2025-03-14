import React, { useEffect } from "react";

const Modal = ({ showModal, title, fields, data, onClose, onChange, onSave }) => {
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => document.body.classList.remove("modal-open");
  }, [showModal]);

  if (!showModal) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {fields.map((field, index) => (
                <div className="mb-3" key={index}>
                  <label className="form-label">{field.label}</label>
                  
                  {/* Check if the field is a select dropdown */}
                  {field.type === "select" ? (
                    <select
                      className="form-control"
                      name={field.name}
                      value={data[field.name] || ""}
                      onChange={onChange}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="form-control"
                      name={field.name}
                      value={data[field.name] || ""}
                      onChange={onChange}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={onSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fix to prevent the backdrop from blocking clicks */}
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default Modal;
