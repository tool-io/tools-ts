import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualBandCenterHz: number;
  readonly actualOctaveFractionDenominator: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualBandCenterHz", label: "Actual band center hz", kind: "number" },
  {
    id: "actualOctaveFractionDenominator",
    label: "Actual octave fraction denominator",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(input.actualBandCenterHz, "center");
  bounded(input.actualOctaveFractionDenominator, "denominator", 1, 24);
  const r = 2 ** (1 / (2 * input.actualOctaveFractionDenominator));
  return {
    lowerEdgeHz: input.actualBandCenterHz / r,
    upperEdgeHz: input.actualBandCenterHz * r,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualBandCenterHz: 1000, actualOctaveFractionDenominator: 3 },
  output: {
    result: { lowerEdgeHz: 890.8987181403393, upperEdgeHz: 1122.4620483093731 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "acoustics/band-edge-frequencies",
  title: "Band Edge Frequencies Calculator",
  description:
    "Exactbase2fractionaloctavebandedges,not base10IECpreferredfrequency rounding. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
          lowerEdgeHz: { type: "number" },
          upperEdgeHz: { type: "number" },
        },
        required: ["lowerEdgeHz", "upperEdgeHz"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
