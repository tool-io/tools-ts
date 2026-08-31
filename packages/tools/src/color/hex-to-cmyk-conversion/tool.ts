import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, hex } from "../batch-shared.js";
export type Input = Readonly<{ readonly sourceHex: string }>;
export type Output = Readonly<{
  readonly naiveCmykFractions: readonly number[];
}>;
const inputFields = [
  { id: "sourceHex", label: "Source hex", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!/^#[0-9A-Fa-f]{6}$(?![\s\S])/.test(input.sourceHex))
    simpleError("hex", "Exact six-digit HEX required.");
  const c = [1, 3, 5].map(
      (i) => parseInt(input.sourceHex.slice(i, i + 2), 16) / 255,
    ),
    k = 1 - Math.max(...c);
  return {
    naiveCmykFractions:
      k === 1 ? [0, 0, 0, 1] : [...c.map((v) => (1 - v - k) / (1 - k)), k],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { sourceHex: "#FF0000" } satisfies Input;
export const exampleOutput = {
  naiveCmykFractions: [0, 1, 1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/hex-to-cmyk-conversion",
  title: "HEX to CMYK Conversion",
  description:
    "Convert six-digit encoded RGB HEX to naive maximum-black CMYK decomposition; no print profile, rendering intent, total-ink-limit enforcement or colorimetric equivalence assumed.",
  inputs: inputFields,
  outputs: [
    {
      id: "naiveCmykFractions",
      label: "Naive cmyk fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) => calculate({ sourceHex: value.sourceHex as string }),
});
export const run = tool.execute;
export default tool;
