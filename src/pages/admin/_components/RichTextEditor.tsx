import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

export const RichTextEditor: React.FC<Props> = ({ value, onChange }) => {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      theme="snow"
      style={{ height: 200, marginBottom: 40 }}
    />
  );
};
