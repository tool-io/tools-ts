import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { octal: "0755" },
  output: { decimal: 493, permissions: "rwxr-xr-x" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "parse/file-mode",
  title: "POSIX File Mode Parser",
  description:
    "Parse a three- or four-digit octal POSIX file mode into permission bits and an rwx string. The leading digit holds setuid, setgid and sticky bits.",
  inputs: [{ id: "octal", kind: "string", label: "octal" }],
  outputs: [
    { id: "decimal", kind: "integer", label: "decimal" },
    { id: "permissions", kind: "string", label: "permissions" },
  ],
  calculate: (input) => {
    const octal = input.octal as string;
    if (!/^[0-7]{3,4}$/.test(octal))
      simpleError("octal", "Enter three or four octal digits.");
    const decimal = Number.parseInt(octal, 8);
    const flags = ["r", "w", "x", "r", "w", "x", "r", "w", "x"];
    const bits = [
      0o400, 0o200, 0o100, 0o040, 0o020, 0o010, 0o004, 0o002, 0o001,
    ];
    const permissions = flags
      .map((ch, i) => (decimal & bits[i]! ? ch : "-"))
      .join("");
    return { decimal, permissions };
  },
});
export type FileModeInput = Readonly<typeof example.input>;
export type FileModeOutput = Readonly<typeof example.output>;
export const fileModeTool = tool;
export const runFileMode = tool.execute;
export default tool;
