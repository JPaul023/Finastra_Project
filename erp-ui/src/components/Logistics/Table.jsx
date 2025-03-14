import React from "react";

const Table = ({ data, columns, onEdit, onDelete }) => {
  return (
    <div className="card shadow-sm border-0 rounded-3">
      <div className="card-body p-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-primary text-white rounded-top">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-3 py-2">{col.label}</th>
                ))}
                <th className="text-center px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                [...data]
                  .sort((a, b) => new Date(b.order_date || b.created_at) - new Date(a.order_date || a.created_at)) // Sort latest first
                  .map((row) => (
                    <tr key={row.id} className="table-row">
                      {columns.map((col) => (
                        <td key={col.key} className={`px-3 py-2 ${col.className || ""}`}>
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </td>
                      ))}
                      <td className="text-center px-3 py-2">
                        <div className="d-flex justify-content-center gap-2">
                          <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => onEdit(row)}>
                            <i className="bi bi-pencil me-1"></i> Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => onDelete(row.id)}>
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-4 text-muted">
                    <i className="bi bi-inbox fs-3 d-block mb-2"></i>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
