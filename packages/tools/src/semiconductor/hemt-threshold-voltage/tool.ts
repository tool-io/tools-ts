import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerHemtBarrierSheetChargeCM2: number;
  readonly callerBarrierCapacitanceFM2: number;
  readonly callerHemtBandAlignmentV: number;
}>;
export type Output = Readonly<{ readonly modeledHemtThresholdV: number }>;
const inputFields = [
  {
    id: "callerHemtBarrierSheetChargeCM2",
    label: "Caller hemt barrier sheet charge c m2",
    kind: "number",
  },
  {
    id: "callerBarrierCapacitanceFM2",
    label: "Caller barrier capacitance f m2",
    kind: "number",
  },
  {
    id: "callerHemtBandAlignmentV",
    label: "Caller hemt band alignment v",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerBarrierCapacitanceFM2, "callerBarrierCapacitanceFM2");
  return {
    modeledHemtThresholdV:
      input.callerHemtBandAlignmentV -
      input.callerHemtBarrierSheetChargeCM2 / input.callerBarrierCapacitanceFM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerHemtBarrierSheetChargeCM2: 0.01,
  callerBarrierCapacitanceFM2: 0.02,
  callerHemtBandAlignmentV: 1,
} satisfies Input;
export const exampleOutput = { modeledHemtThresholdV: 0.5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/hemt-threshold-voltage",
  title: "Semiconductor HEMT Threshold Voltage Calculator",
  description:
    "Evaluate explicit HEMT capacitor sheet-charge threshold budget with independently established signed band alignment/charge, not silicon MOS body effect or full quantum heterostructure solver.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledHemtThresholdV",
      label: "Modeled hemt threshold v",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerHemtBarrierSheetChargeCM2:
        value.callerHemtBarrierSheetChargeCM2 as number,
      callerBarrierCapacitanceFM2: value.callerBarrierCapacitanceFM2 as number,
      callerHemtBandAlignmentV: value.callerHemtBandAlignmentV as number,
    }),
});
export const run = tool.execute;
export default tool;
