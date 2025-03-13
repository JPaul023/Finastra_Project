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
                  <input
                    type={field.type}
                    className="form-control"
                    name={field.name}
                    value={data[field.name] || ""}
                    onChange={onChange}
                  />
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={() => {
  console.log("Save button clicked!"); // ✅ Debugging check
  onSave();
}}>
  Save
</button>

            </div>
          </div>
        </div>
      </div>

      {/* Fix backdrop blocking input */}
      <div className="modal-backdrop fade show" style={{ pointerEvents: "none" }}></div>
    </>
  );
};

export default Modal;
