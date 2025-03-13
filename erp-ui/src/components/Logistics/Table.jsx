import React from "react";

const Table = ({ data, columns, onEdit, onDelete }) => {
  return (
    <div className="card shadow-sm">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                [...data] // Clone array to avoid mutating state directly
                  .sort((a, b) => new Date(b.order_date || b.created_at) - new Date(a.order_date || a.created_at)) // Sort latest first
                  .map((row) => (
                    <tr key={row.id}>
                      {columns.map((col) => (
                        <td key={col.key} className={col.className || ""}>
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </td>
                      ))}
                      <td className="text-center">
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(row)}>
                            <i className="bi bi-pencil me-1"></i> Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(row.id)}>
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-4 text-muted">
                    <i className="bi bi-inbox fs-4 d-block mb-2"></i>
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
