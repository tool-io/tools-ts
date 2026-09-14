import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly eastingDigits: string;
  readonly northingDigits: string;
  readonly targetDigitsPerAxis: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "eastingDigits", label: "Easting digits", kind: "string" },
  { id: "northingDigits", label: "Northing digits", kind: "string" },
  {
    id: "targetDigitsPerAxis",
    label: "Target digits per axis",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.targetDigitsPerAxis, "digits", 1, 5);
  for (const s of [i.eastingDigits, i.northingDigits])
    if (!/^\d+$(?![\s\S])/.test(s) || s.length > i.targetDigitsPerAxis)
      simpleError(
        "digits",
        "Explicit coordinate digit strings not longer than target.",
      );
  return {
    normalizedEasting: i.eastingDigits.padStart(i.targetDigitsPerAxis, "0"),
    normalizedNorthing: i.northingDigits.padStart(i.targetDigitsPerAxis, "0"),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { eastingDigits: "12", northingDigits: "3", targetDigitsPerAxis: 3 },
  output: { result: { normalizedEasting: "012", normalizedNorthing: "003" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/grid-ref-digit-normalizer",
  title: "Grid Reference Digit Padding Normalizer",
  description:
    "Left-pad explicitly interpreted local coordinate integers; does not append precision digits or infer a full grid square.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
