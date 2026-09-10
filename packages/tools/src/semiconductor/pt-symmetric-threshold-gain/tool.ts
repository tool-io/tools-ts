import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyCalibratedCouplingFrequency: number;
  readonly independentlyCalibratedGainSlopePerPumpUnit: number;
  readonly callerIndependentTransparentPumpCoordinate: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyCalibratedCouplingFrequency",
    label: "Independently calibrated coupling frequency",
    kind: "number",
  },
  {
    id: "independentlyCalibratedGainSlopePerPumpUnit",
    label: "Independently calibrated gain slope per pump unit",
    kind: "number",
  },
  {
    id: "callerIndependentTransparentPumpCoordinate",
    label: "Caller independent transparent pump coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyCalibratedCouplingFrequency, "coupling");
  positive(input.independentlyCalibratedGainSlopePerPumpUnit, "gain-slope");
  return {
    conditionalIdealPtThresholdPumpCoordinate:
      input.callerIndependentTransparentPumpCoordinate +
      input.independentlyCalibratedCouplingFrequency /
        input.independentlyCalibratedGainSlopePerPumpUnit,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyCalibratedCouplingFrequency: 2,
    independentlyCalibratedGainSlopePerPumpUnit: 4,
    callerIndependentTransparentPumpCoordinate: 1,
  },
  output: { result: { conditionalIdealPtThresholdPumpCoordinate: 1.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/pt-symmetric-threshold-gain",
  title: "Semiconductor Pt Symmetric Threshold Gain Calculator",
  description:
    "Ideal balanced PTthreshold\u03b3=\u03bausing independent linear pump-to-gain calibration, not the general EPmatrix, physical lasing threshold or real unbalanced device stability.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
