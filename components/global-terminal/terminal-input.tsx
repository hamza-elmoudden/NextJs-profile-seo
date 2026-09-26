"use client";

import { forwardRef, useState } from "react";

interface TerminalInputProps {
  onSubmit: (value: string) => void;
  onEscape: () => void;
  onRecord: (command: string) => void;
  history: string[];
}

const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  function TerminalInput({ onSubmit, onEscape, onRecord, history }, ref) {
    const [value, setValue] = useState("");
    const [historyIndex, setHistoryIndex] = useState(-1);

    const navigateHistory = (direction: 1 | -1) => {
      if (history.length === 0) return;
      const next = historyIndex === -1 ? history.length - 1 + direction : historyIndex + direction;
      const clamped = Math.max(-1, Math.min(history.length - 1, next));
      setHistoryIndex(clamped);
      setValue(clamped === -1 ? "" : history[clamped]);
    };

    return (
      <div className="flex items-center gap-2 border-t border-edge bg-base px-[22px] py-3 font-mono text-[13px]">
        <span className="select-none text-amber" aria-hidden="true">
          $
        </span>
        <input
          ref={ref}
          type="text"
          value={value}
          aria-label="Terminal command input"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-cream caret-terminal outline-none placeholder:text-term-dim"
          placeholder="type a command…"
          onChange={(event) => {
            setValue(event.target.value);
            setHistoryIndex(-1);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              const command = value.trim();
              if (command) {
                onSubmit(command);
                if (command !== "clear") onRecord(command);
              }
              setValue("");
              setHistoryIndex(-1);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              navigateHistory(-1);
            } else if (event.key === "ArrowDown") {
              event.preventDefault();
              navigateHistory(1);
            } else if (event.key === "Escape") {
              event.preventDefault();
              onEscape();
            }
          }}
        />
        <span className="cursor-blink" aria-hidden="true" />
      </div>
    );
  },
);

export default TerminalInput;
