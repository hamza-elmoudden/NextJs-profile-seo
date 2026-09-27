"use client";

import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { Suggestion } from "@/components/global-terminal/terminal-commands";
import { getSuggestions } from "@/components/global-terminal/terminal-commands";

interface TerminalInputProps {
  onSubmit: (value: string) => void;
  onEscape: () => void;
  onRecord: (command: string) => void;
  history: string[];
  /** Lazily provides Sanity service slugs; called at most once, cached. */
  loadServiceSlugs: () => Promise<string[]>;
}

const MAX_SUGGESTIONS = 6;

const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  function TerminalInput({ onSubmit, onEscape, onRecord, history, loadServiceSlugs }, ref) {
    const [value, setValue] = useState("");
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [selected, setSelected] = useState(0);
    const [servicesLoaded, setServicesLoaded] = useState(false);
    const serviceSlugsRef = useRef<string[] | null>(null);
    const servicesRequestedRef = useRef(false);
    const listId = useId();

    // Load service slugs once, the first time the input looks like a
    // `service ...` command. Filtering afterwards is purely local.
    useEffect(() => {
      if (servicesRequestedRef.current) return;
      if (!/^\s*service(\s|$)/i.test(value)) return;
      servicesRequestedRef.current = true;
      let cancelled = false;
      void loadServiceSlugs().then((slugs) => {
        if (cancelled) return;
        serviceSlugsRef.current = slugs;
        setServicesLoaded(true);
      });
      return () => {
        cancelled = true;
      };
    }, [value, loadServiceSlugs]);

    useEffect(() => {
      const next = getSuggestions(value, serviceSlugsRef.current);
      setSuggestions(next.slice(0, MAX_SUGGESTIONS));
      setSelected(0);
    }, [value, servicesLoaded]);

    const open = suggestions.length > 0 && value.trim().length > 0;

    const accept = (suggestion: Suggestion) => {
      setValue(suggestion.value + " ");
      setSuggestions([]);
    };

    const navigateHistory = (direction: 1 | -1) => {
      if (history.length === 0) return;
      const next = historyIndex === -1 ? history.length - 1 + direction : historyIndex + direction;
      const clamped = Math.max(-1, Math.min(history.length - 1, next));
      setHistoryIndex(clamped);
      setValue(clamped === -1 ? "" : history[clamped]);
    };

    const navigateSuggestions = (direction: 1 | -1) => {
      setSelected((prev) => (prev + direction + suggestions.length) % suggestions.length);
    };

    return (
      <div className="relative border-t border-edge bg-base font-mono text-[13px]">
        {open ? (
          <>
            <ul
              id={listId}
              role="listbox"
              aria-label="Command suggestions"
              className="absolute bottom-full left-0 z-10 max-h-56 w-full overflow-y-auto border-t border-edge bg-card px-[22px] py-1.5 shadow-[0_-8px_24px_rgba(0,0,0,0.35)]"
            >
              {suggestions.map((suggestion, index) => (
                <li key={suggestion.value}>
                  <button
                    type="button"
                    role="option"
                    id={`${listId}-option-${index}`}
                    aria-selected={index === selected}
                    onMouseEnter={() => setSelected(index)}
                    onClick={() => {
                      accept(suggestion);
                      if (typeof ref !== "function") ref?.current?.focus();
                    }}
                    className={`flex w-full items-baseline gap-3 px-1 py-1 text-left ${
                      index === selected ? "bg-amber-tint text-cream" : "text-muted"
                    }`}
                  >
                    <span className="shrink-0 text-terminal" aria-hidden="true">
                      {index === selected ? ">" : " "}
                    </span>
                    <span className="truncate text-cream">{suggestion.value}</span>
                    {suggestion.description ? (
                      <span className="ml-auto truncate pl-3 text-[11px] text-term-dim">
                        {suggestion.description}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
            <span className="sr-only" role="status">
              {suggestions.length} suggestion{suggestions.length === 1 ? "" : "s"} available
            </span>
          </>
        ) : null}

        <div className="flex items-center gap-2 px-[22px] py-3">
          <span className="select-none text-amber" aria-hidden="true">
            $
          </span>
          <input
            ref={ref}
            type="text"
            value={value}
            aria-label="Terminal command input"
            role="combobox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-activedescendant={open ? `${listId}-option-${selected}` : undefined}
            aria-autocomplete="list"
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
                setSuggestions([]);
              } else if (event.key === "Tab") {
                if (open) {
                  event.preventDefault();
                  accept(suggestions[selected]);
                }
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                if (open) {
                  navigateSuggestions(-1);
                } else {
                  navigateHistory(-1);
                }
              } else if (event.key === "ArrowDown") {
                event.preventDefault();
                if (open) {
                  navigateSuggestions(1);
                } else {
                  navigateHistory(1);
                }
              } else if (event.key === "Escape") {
                event.preventDefault();
                if (open) {
                  setSuggestions([]);
                } else {
                  onEscape();
                }
              }
            }}
          />
          <span className="cursor-blink" aria-hidden="true" />
        </div>
      </div>
    );
  },
);

export default TerminalInput;
