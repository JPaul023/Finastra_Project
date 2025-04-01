import React from "react";

const TableDelivery = ({ data, columns, onView }) => {
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
                data.map((row) => (
                  <tr key={row.id} className="table-row">
                    {columns.map((col) => (
                      <td key={col.key} className={`px-3 py-2 ${col.className || ""}`}>
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                    <td className="text-center px-3 py-2">
                      <button 
                        className="btn btn-sm btn-outline-info rounded-pill px-3" 
                        onClick={() => onView(row)}
                      >
                        <i className="bi bi-eye me-1"></i> View
                      </button>
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

export default TableDelivery;
