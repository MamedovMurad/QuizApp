import { useState } from "react";
import type { Option } from "../../models/quiz";


interface OrderingFieldProps {
  value?: Option[];
  onChange?: (val: Option[]) => void;
  available: Option[];
  setAvailable: (val: Option[]) => void;
}

export default function OrderingField({
  value = [],
  onChange,
  available,
  setAvailable,
}: OrderingFieldProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropTarget: "available" | "ordered"
  ) => {
    e.preventDefault();
    if (!draggingId) return;

    const fromAvailable = available.find((item) => item.id.toString() === draggingId);
    const fromOrdered = value.find((item) => item.id.toString() === draggingId);

    if (!fromAvailable && !fromOrdered) return;

    if (dropTarget === "available" && fromOrdered) {
      onChange?.(value.filter((item) => item.id.toString() !== draggingId));
      setAvailable([...available, fromOrdered]);
    } else if (dropTarget === "ordered" && fromAvailable) {
      setAvailable(available.filter((item) => item.id.toString() !== draggingId));
      onChange?.([...value, fromAvailable]);
    }

    setDraggingId(null);
  };

  return (
    <div style={{ display: "flex", gap: 40 }}>
      <div
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, "available")}
        style={{
          width: 200,
          minHeight: 250,
          border: "1px solid #ccc",
          padding: 8,
        }}
      >
        <h4>Seçimlər</h4>
        {available.length === 0 && <p style={{ color: "#888" }}>Seçim yoxdur</p>}
        {available.map(({ id, text }) => (
          <div
            key={id}
            draggable
            onDragStart={(e) => onDragStart(e, id.toString())}
            style={{
              padding: 8,
              marginBottom: 8,
              borderRadius: 4,
              backgroundColor: "#f0f0f0",
              cursor: "grab",
            }}
          >
            {text}
          </div>
        ))}
      </div>

      <div
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, "ordered")}
        style={{
          width: 200,
          minHeight: 250,
          border: "2px dashed #4a90e2",
          padding: 8,
        }}
      >
        <h4>Sıralanmış</h4>
        {value.length === 0 && <p style={{ color: "#888" }}>Boşdur</p>}
        {value.map(({ id, text }) => (
          <div
            key={id}
            draggable
            onDragStart={(e) => onDragStart(e, id.toString())}
            style={{
              padding: 8,
              marginBottom: 8,
              borderRadius: 4,
              backgroundColor: "#e0f7ff",
              cursor: "grab",
            }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
