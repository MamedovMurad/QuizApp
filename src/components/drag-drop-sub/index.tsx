import React, { useState } from "react";
import type { Question } from "../../models/quiz";

interface BlankDropTargetProps {
  value?: number | null;
  onChange?: (value: number | null) => void;
  options: Question["options"];
}

export function BlankDropTarget({ value, onChange, options = [] }: BlankDropTargetProps) {
  const [isOver, setIsOver] = useState(false);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const optionId = Number(e.dataTransfer.getData("text/plain"));
    if (!optionId) return;

    if (onChange) {
      onChange(optionId);
    }

    setIsOver(false);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDragEnter = () => {
    setIsOver(true);
  };

  const onDragLeave = () => {
    setIsOver(false);
  };

  const onRemove = () => {
    if (onChange) {
      onChange(null);
    }
  };

  const text = value ? options?.find((o) => o.id === value)?.text : null;

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      style={{
        height: 36,
        lineHeight: "36px",
        border: "2px dashed #aaa",
        borderRadius: 4,
        textAlign: "center",
        userSelect: "none",
        cursor: "pointer",
        padding: "0 8px",
        backgroundColor: value
          ? "#fafafa"
          : isOver
          ? "#e6f7ff"
          : "transparent",
        transition: "background-color 0.2s",
      }}
    >
      {text || <span style={{ color: "#999" }}>Drop here</span>}
      {value !== null && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            marginLeft: 8,
            color: "red",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          &times;
        </span>
      )}
    </div>
  );
}
