import React, { CSSProperties } from "react";
import { User } from "../";

interface Props {
  user: User | null
}

const headerStyle: CSSProperties = {
  padding: 8,
  backgroundColor: "gray",
  color: "white",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export default function Header(props: Props) {
  return (
    <header style={headerStyle}>
      <div style={{ fontWeight: "bold" }}>Mementor</div>

      <div>
        {props.user === null ? (
          null
        ) : (
          <div>
            @{props.user.username}
          </div>
        )}
      </div>
    </header>
  );
}
