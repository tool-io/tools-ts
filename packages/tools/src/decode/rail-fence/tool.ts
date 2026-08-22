import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const railFenceDecodeExample = {
  input: { cipher: "Horel ollwd", rails: 3 },
  output: { text: "Hello world" },
} satisfies ToolExample<RailFenceInput, RailFenceOutput>;

export type RailFenceInput = {
  readonly cipher: string;
  readonly rails: number;
};
export type RailFenceOutput = { readonly text: string };

const railPattern = (length: number, rails: number): number[] => {
  const pattern: number[] = [];
  let row = 0;
  let step = 1;
  for (let i = 0; i < length; i += 1) {
    pattern.push(row);
    if (row === 0) step = 1;
    else if (row === rails - 1) step = -1;
    row += step;
  }
  return pattern;
};

export const calculateRailFenceDecode = (
  input: RailFenceInput,
): RailFenceOutput => {
  const rails = input.rails;
  if (rails < 2)
    simpleError("rails", "Need at least two rails.", "invalid_rails");
  const chars = [...input.cipher];
  const pattern = railPattern(chars.length, rails);
  const counts = new Array<number>(rails).fill(0);
  for (const row of pattern) counts[row] += 1;
  const queues: string[][] = [];
  let offset = 0;
  for (let row = 0; row < rails; row += 1) {
    queues.push(chars.slice(offset, offset + counts[row]));
    offset += counts[row];
  }
  const cursors = new Array<number>(rails).fill(0);
  const text: string[] = [];
  for (const row of pattern) text.push(queues[row][cursors[row]++]!);
  return { text: text.join("") };
};

export const railFenceTool = createSimpleTool({
  calculate: (input) =>
    calculateRailFenceDecode(input as unknown as RailFenceInput),
  description: "Decode text encoded with the Rail Fence (zigzag) cipher.",
  id: "decode/rail-fence",
  inputs: [
    { id: "cipher", kind: "string", label: "Cipher" },
    { id: "rails", kind: "integer", label: "Rails", minimum: 2 },
  ],
  outputs: [{ id: "text", kind: "string", label: "Decoded" }],
  title: "Rail Fence Decoder",
});
export const runRailFenceDecode = railFenceTool.execute;
export { railFenceDecodeExample as example };
export default railFenceTool;
