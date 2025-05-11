import React from "react";

interface CardInfoProps {
  name: string;
  progress: number;
  route: string;
  style?: React.CSSProperties;
  description?: string;
  onLearnMore?: (result: any) => void;
}

const CardInfo: React.FC<CardInfoProps> = ({ name, progress, route, style, description, onLearnMore }) => {
  const handleClick = () => {
    if (onLearnMore) {
      onLearnMore({ name, progress, route, description });
    }
  };

  return (
    <div
      style={{
        minWidth: "17rem",
        minHeight: "4rem",
        borderRadius: 16,
        background: "#E9E9DD",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #e5e5e5",
        padding: 10,
        position: "absolute",
        ...style,
      }}
    >
      <div
        style={{
          background: "#A8D7EB",
          borderRadius: 8,
          width: "6rem",
          height: 18,
          fontSize: 12,
          color: "#484848",
          paddingLeft: ".7rem",
          marginBottom: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        {progress}% Avance
      </div>
      <div style={{ fontWeight: "bold", fontSize: 16, color: "#222", whiteSpace: "nowrap", overflow: "auto" }}>{name}</div>
      <div
        style={{ color: "#64748b", fontSize: 12, textDecoration: "underline", cursor: "pointer" }}
        onClick={handleClick}
      >
        Saber más &gt;
      </div>
    </div>
  );
};

export default CardInfo;