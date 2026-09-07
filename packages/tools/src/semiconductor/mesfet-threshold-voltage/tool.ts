import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedMesfetSchottkyBuiltInV: number;
  readonly callerUniformDonorPerM3: number;
  readonly observedChannelThicknessM: number;
  readonly callerPermittivityFM: number;
  readonly callerElementaryChargeC: number;
}>;
export type Output = Readonly<{ readonly modeledMesfetThresholdV: number }>;
const inputFields = [
  {
    id: "observedMesfetSchottkyBuiltInV",
    label: "Observed mesfet schottky built in v",
    kind: "number",
  },
  {
    id: "callerUniformDonorPerM3",
    label: "Caller uniform donor per m3",
    kind: "number",
  },
  {
    id: "observedChannelThicknessM",
    label: "Observed channel thickness m",
    kind: "number",
  },
  {
    id: "callerPermittivityFM",
    label: "Caller permittivity f m",
    kind: "number",
  },
  {
    id: "callerElementaryChargeC",
    label: "Caller elementary charge c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerUniformDonorPerM3, "callerUniformDonorPerM3");
  positive(input.observedChannelThicknessM, "observedChannelThicknessM");
  positive(input.callerPermittivityFM, "callerPermittivityFM");
  positive(input.callerElementaryChargeC, "callerElementaryChargeC");
  return {
    modeledMesfetThresholdV:
      input.observedMesfetSchottkyBuiltInV -
      (input.callerElementaryChargeC *
        input.callerUniformDonorPerM3 *
        input.observedChannelThicknessM ** 2) /
        (2 * input.callerPermittivityFM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMesfetSchottkyBuiltInV: 1,
  callerUniformDonorPerM3: 1e22,
  observedChannelThicknessM: 1e-6,
  callerPermittivityFM: 1e-10,
  callerElementaryChargeC: 1.6e-19,
} satisfies Input;
export const exampleOutput = { modeledMesfetThresholdV: -7 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/mesfet-threshold-voltage",
  title: "Semiconductor MESFET Threshold Voltage Calculator",
  description:
    "One-sided MESFET Schottky depletion threshold under caller uniform doping/thickness, signed Vbi−qNa²/(2ε); not symmetric JFET geometry, universal material constant or operating instruction.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledMesfetThresholdV",
      label: "Modeled mesfet threshold v",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMesfetSchottkyBuiltInV:
        value.observedMesfetSchottkyBuiltInV as number,
      callerUniformDonorPerM3: value.callerUniformDonorPerM3 as number,
      observedChannelThicknessM: value.observedChannelThicknessM as number,
      callerPermittivityFM: value.callerPermittivityFM as number,
      callerElementaryChargeC: value.callerElementaryChargeC as number,
    }),
});
export const run = tool.execute;
export default tool;
