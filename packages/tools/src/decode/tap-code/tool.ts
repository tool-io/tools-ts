import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const tapCodeExample = {
  input: { taps: "11 34 15" },
  output: { text: "AOE", invalidGroups: [] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tapCodeTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ taps }) => {
      const rows = ["ABCDE", "FGHIJ", "LMNOP", "QRSTU", "VWXYZ"];
      const groups = String(taps)
        .trim()
        .split(/\s+/)
        .filter((g) => g.length > 0);
      if (groups.length === 0)
        simpleError("taps", "Provide at least one tap group.");
      const invalidGroups: number[] = [];
      let text = "";
      groups.forEach((g, gi) => {
        const m = /^([1-5])([1-5])$/.exec(g);
        if (!m) {
          invalidGroups.push(gi);
          text += "?";
          return;
        }
        text += rows[Number(m[1]) - 1][Number(m[2]) - 1];
      });
      return { text, invalidGroups };
    })(input as never) as Record<string, unknown>,
  description:
    "Decode digit-pair tap groups into text. Classic POW tap-code grid omits K (use C).",
  id: "decode/tap-code",
  inputs: [
    {
      description:
        'Groups of two digits 1-5, words separated by spaces (e.g. "11 34 15").',
      id: "taps",
      kind: "string",
      label: "taps",
    },
  ],
  outputs: [
    {
      description: "Decoded uppercase text.",
      id: "text",
      kind: "string",
      label: "text",
    },
    {
      description: "Indices of malformed or out-of-range groups.",
      id: "invalidGroups",
      kind: "numberList",
      label: "bad",
    },
  ],
  title: "Tap Code Decoder",
});
export const runTapCode = tapCodeTool.execute;
export { tapCodeExample as example };
export default tapCodeTool;
