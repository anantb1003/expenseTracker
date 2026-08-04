import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { UploadCloud, FileText, Download } from 'lucide-react';

const CSVImportModal = ({ isOpen, onClose, onImport, isLoading }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onImport(file);
    }
  };

  const downloadSampleTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Date,Amount,Category,PaymentMethod,Notes\n2026-08-01,45.50,Food & Dining,CARD,Team lunch\n2026-08-02,30.00,Transport,UPI,Fuel refill\n2026-08-03,112.80,Groceries,CARD,Supermarket shopping";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_expenses_import.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Expenses from CSV" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sample Template Link */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-700 dark:text-indigo-300">
          <span>Need a CSV template format?</span>
          <button
            type="button"
            onClick={downloadSampleTemplate}
            className="font-bold flex items-center hover:underline"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Download Sample
          </button>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="hidden"
            id="csv-file-input"
          />
          <label htmlFor="csv-file-input" className="cursor-pointer flex flex-col items-center">
            <UploadCloud className="w-10 h-10 text-indigo-500 mb-2" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Click to upload or drag & drop CSV file
            </span>
            <span className="text-[11px] text-slate-500 mt-1">Headers: Date, Amount, Category, PaymentMethod, Notes</span>
          </label>
        </div>

        {/* File Preview */}
        {file && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span className="truncate max-w-[200px]">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-rose-500 hover:underline"
            >
              Remove
            </button>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" disabled={!file} isLoading={isLoading}>
            Upload & Process CSV
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CSVImportModal;
