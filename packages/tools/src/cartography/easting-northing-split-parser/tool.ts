import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch52-shared.js";
export type Input = Readonly<{ readonly numericReference: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "numericReference", label: "Numeric reference", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  if (!/^(?:\d{2}){1,5}$(?![\s\S])/.test(i.numericReference))
    simpleError("reference", "Even 2–10 digits.");
  const n = i.numericReference.length / 2;
  return {
    eastingDigits: i.numericReference.slice(0, n),
    northingDigits: i.numericReference.slice(n),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { numericReference: "012034" },
  output: { result: { eastingDigits: "012", northingDigits: "034" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/easting-northing-split-parser",
  title: "Easting Northing Digit Split Parser",
  description:
    "Split an explicit even-length local numeric grid reference; retain leading zeroes, no square/geodetic validation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eastingDigits: { type: "string" },
          northingDigits: { type: "string" },
        },
        required: ["eastingDigits", "northingDigits"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
