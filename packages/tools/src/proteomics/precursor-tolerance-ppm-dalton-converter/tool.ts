import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch53-shared.js";

export type Input = Readonly<{ precursorMz: number; tolerancePpm: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "precursorMz", label: "Precursor mz", kind: "number" },
  { id: "tolerancePpm", label: "Tolerance ppm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  positive(i.precursorMz, "mz");
  nonnegative(i.tolerancePpm, "tolerance");
  const halfWidthDa = (i.precursorMz * i.tolerancePpm) / 1e6;
  return {
    halfWidthDa,
    lowerMz: i.precursorMz - halfWidthDa,
    upperMz: i.precursorMz + halfWidthDa,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { precursorMz: 500, tolerancePpm: 10 },
  output: {
    result: { halfWidthDa: 0.005, lowerMz: 499.995, upperMz: 500.005 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/precursor-tolerance-ppm-dalton-converter",
  title: "Precursor Mass Tolerance ppm to Dalton Window Converter",
  description:
    "Convert a symmetric precursor ppm tolerance to an m/z window; no mass-calibration or identification inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          halfWidthDa: { type: "number" },
          lowerMz: { type: "number" },
          upperMz: { type: "number" },
        },
        required: ["halfWidthDa", "lowerMz", "upperMz"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
