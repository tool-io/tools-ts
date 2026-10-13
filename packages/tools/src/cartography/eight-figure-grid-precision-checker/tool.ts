import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch52-shared.js";
export type Input = Readonly<{ readonly numericGridReference: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "numericGridReference",
    label: "Numeric grid reference",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  if (!/^\d{8}$(?![\s\S])/.test(i.numericGridReference))
    simpleError("grid", "Exactly 8 ASCII digits, square supplied externally.");
  return { nominalCellWidthMeters: 10, actualAccuracyEstablished: false };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { numericGridReference: "12345678" },
  output: {
    result: { nominalCellWidthMeters: 10, actualAccuracyEstablished: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/eight-figure-grid-precision-checker",
  title: "Eight-Figure Grid Reference Precision Meter Checker",
  description:
    "8-figure local grid precision: 10m square, not observed accuracy or validated coordinate.",
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
          nominalCellWidthMeters: { type: "number" },
          actualAccuracyEstablished: { type: "boolean" },
        },
        required: ["nominalCellWidthMeters", "actualAccuracyEstablished"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
