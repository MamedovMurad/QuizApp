import React, { useState } from "react";
import { Form } from "antd";
import type { Question } from "../models/quiz";
import { BlankDropTarget } from "./drag-drop-sub";

interface AnswersMap {
  [blankId: number]: number | null;
}

interface Props {
  question: Question;
}

export default function DragDropBlankQuestion({ question }: Props) {
  const parts = question.text.split("___");

  const [answers, setAnswers] = useState<AnswersMap>(() => {
    const initial: AnswersMap = {};
    question.blanks?.forEach((b) => {
      initial[b.id] = null;
    });
    return initial;
  });

  const usedOptionIds = Object.values(answers).filter(
    (v): v is number => v !== null
  );

  const onChange = (newAnswers: AnswersMap) => {
    setAnswers(newAnswers);
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, optionId: number) => {
    e.dataTransfer.setData("text/plain", optionId.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div style={{ display: "flex", gap: 20 }}>
      {/* Sol seçimlər paneli */}
      <div style={{ flex: 1 }} className="border border-blue-400 rounded-md p-2 mb-5">
        <h4>Seçimlər</h4>
        {question.options?.map((opt) => {
          const disabled = usedOptionIds.includes(opt.id);
          return (
            <div
              key={opt.id}
              draggable={!disabled}
              onDragStart={(e) => onDragStart(e, opt.id)}
              style={{
                padding: 8,
                marginBottom: 8,
                backgroundColor: disabled ? "#ddd" : "#e6f7ff",
                borderRadius: 4,
                cursor: disabled ? "not-allowed" : "grab",
                opacity: disabled ? 0.5 : 1,
                userSelect: "none",
              }}
            >
              {opt.text}
            </div>
          );
        })}
      </div>

      {/* Sağ tərəfdə cümlə və blank-lar */}
      <div style={{ flex: 2, fontSize: 18, lineHeight: "32px" }}>
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < (question.blanks?.length ?? 0) && (
              <Form.Item
                name={["answer_" + question.id, question.blanks![i].id.toString()]}
                rules={[{ required: true, message: "Zəhmət olmasa seçim edin" }]}
                style={{ display: "inline-block", margin: "0 8px" }}
              >
                <BlankDropTarget
                  value={answers[question.blanks![i].id]}
                  onChange={(val) => {
                    setAnswers((prev) => {
                      const newAnswers = { ...prev };

                      // Eyni option digər blanklarda varsa sil
                      Object.entries(newAnswers).forEach(([bId, optId]) => {
                        if (optId === val) newAnswers[+bId] = null;
                      });

                      newAnswers[question.blanks![i].id] = val;
                      onChange(newAnswers);
                      return newAnswers;
                    });
                  }}
                  options={question.options}
               
                />
              </Form.Item>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
