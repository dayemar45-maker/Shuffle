import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import "./CategoriesPanel.css";

export default function CategoriesPanel({
  categories,
  onOpen,
}: {
  categories: { id: string; title: string; progress: number; subtitle?: string }[];
  onOpen?: (id: string) => void;
}) {
  return (
    <div className="cc-categories">
      <div className="cc-panel-header">
        <h3>Categories</h3>
        <div className="cc-lang-select">English ▾</div>
      </div>
      <div className="cc-category-list">
        {categories.map((c) => (
          <div key={c.id} className="cc-category" onClick={() => onOpen && onOpen(c.id)}>
            <div className="cc-cat-left">
              <div className="cc-cat-title">{c.title}</div>
              <div className="cc-cat-sub">{c.subtitle || `${Math.round(c.progress * 100)}% learned`}</div>
            </div>
            <div className="cc-cat-right">
              <LinearProgress variant="determinate" value={c.progress * 100} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
