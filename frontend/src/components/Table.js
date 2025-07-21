import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const Table = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            {columns.map(col => <th key={col.key}>{col.label}</th>)}
            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item._id || item.id}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td>
                  {onEdit && (
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(item)}>
                      <Edit size={16} />
                    </button>
                  )}
                  {onDelete && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(item)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;