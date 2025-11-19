import React from "react";

export const Button = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
            }}
        >
            {children}
        </button>
    );
};
