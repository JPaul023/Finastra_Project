import React from "react";

const Table = ({ data, columns, onEdit, onDelete }) => {
  return (
    <div className="card shadow-sm">
      <div className="card-body p-0">
        <table className="table table-hover mb-0">
          <thead className="table-dark">
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.label}</th>
              ))}
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>{col.render ? col.render(item[col.key]) : item[col.key]}</td>
                  ))}
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(item)}>
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(item.id)}>
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-4 text-muted">
                  <i className="fas fa-inbox fs-4 d-block mb-2"></i>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
