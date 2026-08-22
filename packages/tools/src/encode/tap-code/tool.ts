import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const tapCodeExample = {
  input: { text: "attack at dawn" },
  output: { taps: "11 44 44 11 13 13 11 44 14 11 52 33", letterCount: 12 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tapCodeTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ text }) => {
      const grid: Record<string, string> = {};
      const rows = ["ABCDE", "FGHIJ", "LMNOP", "QRSTU", "VWXYZ"];
      rows.forEach((r, ri) =>
        [...r].forEach((ch, ci) => {
          grid[ch] = `${ri + 1}${ci + 1}`;
        }),
      );
      const letters = String(text)
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .replace(/K/g, "C")
        .split("");
      if (letters.length === 0)
        simpleError("text", "Provide at least one letter.");
      return {
        taps: letters.map((ch) => grid[ch]).join(" "),
        letterCount: letters.length,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Encode text into digit-pair tap groups. Classic POW tap-code grid omits K (use C).",
  id: "encode/tap-code",
  inputs: [
    {
      description: "Plain text; K is encoded as C.",
      id: "text",
      kind: "string",
      label: "text",
    },
  ],
  outputs: [
    {
      description: "Space-separated digit pairs per word.",
      id: "taps",
      kind: "string",
      label: "taps",
    },
    {
      description: "Encoded letter count.",
      id: "letterCount",
      kind: "integer",
      label: "letters",
    },
  ],
  title: "Tap Code Encoder",
});
export const runTapCode = tapCodeTool.execute;
export { tapCodeExample as example };
export default tapCodeTool;
