import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  mean,
} from "../batch53-shared.js";

export type Input = Readonly<{ diametersMm: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "diametersMm", label: "Diameters mm", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  if (!i.diametersMm.length)
    simpleError("diameters", "Actual measurements required.");
  i.diametersMm.forEach((v) => positive(v, "diameter"));
  return {
    count: i.diametersMm.length,
    meanDiameterMm: mean(i.diametersMm),
    minimumMm: Math.min(...i.diametersMm),
    maximumMm: Math.max(...i.diametersMm),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { diametersMm: [1, 3] },
  output: {
    result: { count: 2, meanDiameterMm: 2, minimumMm: 1, maximumMm: 3 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/plaque-diameter-measurement-recorder",
  title: "Plaque Diameter mm Clearance Zone Measurement Recorder",
  description:
    "Record measured plaque diameters with mean and range; no clearance-zone image detection or titer inference.",
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
          count: { type: "number" },
          meanDiameterMm: { type: "number" },
          minimumMm: { type: "number" },
          maximumMm: { type: "number" },
        },
        required: ["count", "meanDiameterMm", "minimumMm", "maximumMm"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
