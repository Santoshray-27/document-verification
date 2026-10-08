import React, { useState } from 'react';

const IssuerForm = ({ template, onSubmit, disabled }) => {
  const [formData, setFormData] = useState({});

  if (!template) return <p className="text-sm text-gray-500">Select a template to view the form.</p>;

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTableChange = (tableName, rowIndex, colName, value) => {
    setFormData(prev => {
      const tableData = [...(prev[tableName] || [])];
      if (!tableData[rowIndex]) tableData[rowIndex] = {};
      tableData[rowIndex][colName] = value;
      return { ...prev, [tableName]: tableData };
    });
  };

  const addRow = (tableName) => {
    setFormData(prev => ({
      ...prev,
      [tableName]: [...(prev[tableName] || []), {}]
    }));
  };

  const removeRow = (tableName, rowIndex) => {
    setFormData(prev => {
      const tableData = [...(prev[tableName] || [])];
      tableData.splice(rowIndex, 1);
      return { ...prev, [tableName]: tableData };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border rounded shadow-sm">
      <h3 className="text-lg font-bold border-b pb-2">Issue {template.name}</h3>
      {template.fields.map(field => {
        if (field.type === 'table') {
          const rows = formData[field.name] || [];
          return (
            <div key={field.name} className="border p-4 rounded bg-gray-50">
              <label className="block font-medium mb-2">{field.name}</label>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr>
                      {field.columns.map(col => <th key={col} className="pb-2 pr-2">{col}</th>)}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i}>
                        {field.columns.map(col => (
                          <td key={col} className="pr-2 pb-2">
                            <input
                              required
                              className="w-full border rounded px-2 py-1"
                              value={row[col] || ''}
                              onChange={(e) => handleTableChange(field.name, i, col, e.target.value)}
                            />
                          </td>
                        ))}
                        <td className="pb-2">
                          <button type="button" onClick={() => removeRow(field.name, i)} className="text-red-600 hover:text-red-800 text-xs font-bold">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" onClick={() => addRow(field.name)} className="mt-2 text-sm text-blue-600 hover:underline">+ Add Row</button>
            </div>
          );
        }

        return (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1">{field.name} {field.required && '*'}</label>
            <input 
              type="text" 
              className="w-full border rounded px-3 py-2" 
              required={field.required}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          </div>
        );
      })}
      
      <button 
        type="submit" 
        disabled={disabled}
        className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Issue Document
      </button>
    </form>
  );
};

export default IssuerForm;
