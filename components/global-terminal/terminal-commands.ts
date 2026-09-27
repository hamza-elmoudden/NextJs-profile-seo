export type TerminalCommand = {
  name: string;
  description: string;
  aliases?: string[];
};

export const TERMINAL_COMMANDS: TerminalCommand[] = [
  { name: "help", description: "Show available commands" },
  { name: "about", description: "Show information about me" },
  { name: "services", description: "List my services" },
  { name: "service", description: "Show a service by slug or number" },
  { name: "skills", description: "List technical skills" },
  { name: "contact", description: "Show contact information" },
  { name: "clear", description: "Clear terminal" },
  { name: "close", description: "Close terminal", aliases: ["exit"] },
  { name: "back", description: "Return to previous output" },
  { name: "description", description: "Full description of selected service" },
  { name: "open", description: "Open selected service page" },
];

export type Suggestion = {
  value: string;
  description: string;
};

function byPrefix(source: TerminalCommand[], prefix: string): Suggestion[] {
  const lower = prefix.toLowerCase();
  return source
    .filter(
      (command) =>
        command.name.startsWith(lower) ||
        command.aliases?.some((alias) => alias.startsWith(lower)),
    )
    .map((command) => ({ value: command.name, description: command.description }));
}

/**
 * Computes autocomplete suggestions for the current raw input.
 * - `service <prefix>` suggests Sanity service slugs.
 * - Anything else suggests terminal commands.
 */
export function getSuggestions(input: string, serviceSlugs: string[] | null): Suggestion[] {
  const trimmedStart = input.replace(/^\s+/, "");
  const [first, ...rest] = trimmedStart.split(/\s+/);
  const restJoined = rest.join(" ");

  if (first.toLowerCase() === "service") {
    if (!serviceSlugs) return [];
    const prefix = restJoined.toLowerCase();
    return serviceSlugs
      .filter((slug) => !prefix || slug.startsWith(prefix))
      .map((slug) => ({ value: `service ${slug}`, description: "" }));
  }

  if (rest.length > 0) return [];
  return byPrefix(TERMINAL_COMMANDS, first ?? "");
}

export function formatHelpLines(): { name: string; description: string }[] {
  return TERMINAL_COMMANDS.filter((command) =>
    ["help", "about", "services", "skills", "contact", "clear", "close"].includes(command.name),
  ).map((command) => ({ name: command.name, description: command.description }));
}
