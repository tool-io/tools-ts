import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, hex, fraction } from "../batch-shared.js";
export type Input = Readonly<{ readonly cmykFractions: readonly number[] }>;
export type Output = Readonly<{
  readonly naiveDeviceRgb: readonly number[];
  readonly approximateHex: string;
}>;
const inputFields = [
  { id: "cmykFractions", label: "Cmyk fractions", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.cmykFractions.length !== 4)
    simpleError("cmyk", "Exactly four normalized C/M/Y/K fractions required.");
  input.cmykFractions.forEach((v) => fraction(v, "ink"));
  const [c, m, y, k] = input.cmykFractions,
    values = [c, m, y].map((v) => (1 - v) * (1 - k));
  return { naiveDeviceRgb: values, approximateHex: hex(values) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { cmykFractions: [0, 1, 1, 0] } satisfies Input;
export const exampleOutput = {
  naiveDeviceRgb: [1, 0, 0],
  approximateHex: "#FF0000",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/cmyk-to-hex-print-conversion",
  title: "CMYK to HEX Print Conversion",
  description:
    "Convert normalized CMYK to naive multiplicative device RGB/HEX; explicitly unprofiled, not accurate press color, ink coverage, substrate behavior or ICC color management.",
  inputs: inputFields,
  outputs: [
    { id: "naiveDeviceRgb", label: "Naive device rgb", kind: "numberList" },
    { id: "approximateHex", label: "Approximate hex", kind: "string" },
  ],
  calculate: (value) =>
    calculate({ cmykFractions: value.cmykFractions as readonly number[] }),
});
export const run = tool.execute;
export default tool;
