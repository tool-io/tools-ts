import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { permissions: "rwxr-xr-x", specialBits: 0 },
  output: { octal: "0755" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "format/file-mode",
  title: "POSIX File Mode Serializer",
  description:
    "Serialize a POSIX 9-character rwx permissions string and optional special-bit digit to a four-digit octal mode.",
  inputs: [
    { id: "permissions", kind: "string", label: "permissions" },
    {
      id: "specialBits",
      kind: "integer",
      label: "special Bits",
      minimum: 0,
      maximum: 7,
    },
  ],
  outputs: [{ id: "octal", kind: "string", label: "octal" }],
  calculate: (input) => {
    const permissions = input.permissions as string;
    if (!/^[r-][w-][x-][r-][w-][x-][r-][w-][x-]$/.test(permissions))
      simpleError(
        "permissions",
        "Use nine rwx or dash characters in rwxrwxrwx order.",
      );
    const bits = [
      0o400, 0o200, 0o100, 0o040, 0o020, 0o010, 0o004, 0o002, 0o001,
    ];
    const mode = [...permissions].reduce(
      (sum, ch, i) => sum + (ch === "-" ? 0 : bits[i]!),
      0,
    );
    return {
      octal:
        (input.specialBits as number).toString(8) +
        mode.toString(8).padStart(3, "0"),
    };
  },
});
export type FileModeInput = Readonly<typeof example.input>;
export type FileModeOutput = Readonly<typeof example.output>;
export const fileModeTool = tool;
export const runFileMode = tool.execute;
export default tool;
