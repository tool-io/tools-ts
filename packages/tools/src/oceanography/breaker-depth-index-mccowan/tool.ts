import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedBreakerWaveHeightM: number;
  readonly observedBreakerWaterDepthM: number;
  readonly callerMatchedMcCowanIndex: number;
}>;
export type Output = Readonly<{
  readonly observedBreakerIndex: number;
  readonly signedHeightMinusCallerIndexDepthM: number;
}>;
const inputFields = [
  {
    id: "observedBreakerWaveHeightM",
    label: "Observed breaker wave height m",
    kind: "number",
  },
  {
    id: "observedBreakerWaterDepthM",
    label: "Observed breaker water depth m",
    kind: "number",
  },
  {
    id: "callerMatchedMcCowanIndex",
    label: "Caller matched mc cowan index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedBreakerWaterDepthM, "observedBreakerWaterDepthM");
  positive(input.callerMatchedMcCowanIndex, "callerMatchedMcCowanIndex");
  nonnegative(input.observedBreakerWaveHeightM, "observedBreakerWaveHeightM");
  return {
    observedBreakerIndex:
      input.observedBreakerWaveHeightM / input.observedBreakerWaterDepthM,
    signedHeightMinusCallerIndexDepthM:
      input.observedBreakerWaveHeightM -
      input.callerMatchedMcCowanIndex * input.observedBreakerWaterDepthM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBreakerWaveHeightM: 2,
  observedBreakerWaterDepthM: 3,
  callerMatchedMcCowanIndex: 0.78,
} satisfies Input;
export const exampleOutput = {
  observedBreakerIndex: 0.6666666666666666,
  signedHeightMinusCallerIndexDepthM: -0.34,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/breaker-depth-index-mccowan",
  title: "Breaker Depth Index McCowan Calculator",
  description:
    "Audit independently observed breakingH/depth and caller matched index, no inferred hazardous breaker depth or universal.78. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedBreakerIndex",
      label: "Observed breaker index",
      kind: "number",
    },
    {
      id: "signedHeightMinusCallerIndexDepthM",
      label: "Signed height minus caller index depth m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBreakerWaveHeightM: value.observedBreakerWaveHeightM as number,
      observedBreakerWaterDepthM: value.observedBreakerWaterDepthM as number,
      callerMatchedMcCowanIndex: value.callerMatchedMcCowanIndex as number,
    }),
});
export const run = tool.execute;
export default tool;
