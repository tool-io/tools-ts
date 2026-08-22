import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const railFenceEncodeExample = {
  input: { rails: 3, text: "Hello world" },
  output: { cipher: "Horel ollwd" },
} satisfies ToolExample<RailFenceEncodeInput, RailFenceEncodeOutput>;

export type RailFenceEncodeInput = {
  readonly rails: number;
  readonly text: string;
};
export type RailFenceEncodeOutput = { readonly cipher: string };

export const calculateRailFenceEncode = (
  input: RailFenceEncodeInput,
): RailFenceEncodeOutput => {
  const rails = input.rails;
  const text = input.text;
  if (rails < 2)
    simpleError("rails", "Need at least two rails.", "invalid_rails");
  const rows: string[][] = Array.from({ length: rails }, () => []);
  let row = 0;
  let step = 1;
  for (const ch of text) {
    rows[row].push(ch);
    if (row === 0) step = 1;
    else if (row === rails - 1) step = -1;
    row += step;
  }
  return { cipher: rows.flat().join("") };
};

export const railFenceEncodeTool = createSimpleTool({
  calculate: (input) =>
    calculateRailFenceEncode(input as unknown as RailFenceEncodeInput),
  description: "Encode text using the Rail Fence (zigzag) cipher.",
  id: "encode/rail-fence",
  inputs: [
    { id: "rails", kind: "integer", label: "Rails", minimum: 2 },
    { id: "text", kind: "string", label: "Text" },
  ],
  outputs: [{ id: "cipher", kind: "string", label: "Encoded" }],
  title: "Rail Fence Encoder",
});
export const runRailFenceEncode = railFenceEncodeTool.execute;
export default railFenceEncodeTool;
