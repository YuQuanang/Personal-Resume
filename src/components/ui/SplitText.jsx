import React from 'react';

export function SplitText({ children }) {
  // If children is a string, split by newlines or <br/>
  // Wait, easiest is to allow manually passing the inner elements,
  // but if it's a string, we split by newline.
  if (typeof children === 'string') {
    const lines = children.split('\n');
    return (
      <>
        {lines.map((line, index) => (
          <React.Fragment key={index}>
            <span className="split-line">
              <span className="split-line-inner">{line}</span>
            </span>
            {index < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </>
    );
  }
  
  // If passing elements directly (e.g., <em>), wrap the whole block
  return (
    <span className="split-line">
      <span className="split-line-inner">{children}</span>
    </span>
  );
}
