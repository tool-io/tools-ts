import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerHighLayerIndex: number;
  readonly callerLowLayerIndex: number;
  readonly callerQuarterWavePairCount: number;
  readonly callerIncidentIndex: number;
  readonly callerSubstrateIndex: number;
}>;
export type Output = Readonly<{
  readonly idealQuarterWaveDbrIntensityReflectivity: number;
}>;
const inputFields = [
  {
    id: "callerHighLayerIndex",
    label: "Caller high layer index",
    kind: "number",
  },
  {
    id: "callerLowLayerIndex",
    label: "Caller low layer index",
    kind: "number",
  },
  {
    id: "callerQuarterWavePairCount",
    label: "Caller quarter wave pair count",
    kind: "number",
  },
  { id: "callerIncidentIndex", label: "Caller incident index", kind: "number" },
  {
    id: "callerSubstrateIndex",
    label: "Caller substrate index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerHighLayerIndex, "callerHighLayerIndex");
  positive(input.callerLowLayerIndex, "callerLowLayerIndex");
  positive(input.callerIncidentIndex, "callerIncidentIndex");
  positive(input.callerSubstrateIndex, "callerSubstrateIndex");
  bounded(input.callerQuarterWavePairCount, "pairs", 0, 1000);
  const logAdmittance =
    Math.log(input.callerSubstrateIndex / input.callerIncidentIndex) +
    2 *
      input.callerQuarterWavePairCount *
      Math.log(input.callerHighLayerIndex / input.callerLowLayerIndex);
  return {
    idealQuarterWaveDbrIntensityReflectivity: Math.tanh(logAdmittance / 2) ** 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerHighLayerIndex: 2,
  callerLowLayerIndex: 1,
  callerQuarterWavePairCount: 2,
  callerIncidentIndex: 1,
  callerSubstrateIndex: 1,
} satisfies Input;
export const exampleOutput = {
  idealQuarterWaveDbrIntensityReflectivity: 0.7785467128027682,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/distributed-bragg-reflector-reflectivity",
  title: "Semiconductor Distributed Bragg Reflector Reflectivity Calculator",
  description:
    "Ideal normal-incidence quarter-wave high/low stack intensity reflectivity via stable log admittance, explicit substrate/incident termination; no off-center transfer matrix or actual DBR certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealQuarterWaveDbrIntensityReflectivity",
      label: "Ideal quarter wave dbr intensity reflectivity",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerHighLayerIndex: value.callerHighLayerIndex as number,
      callerLowLayerIndex: value.callerLowLayerIndex as number,
      callerQuarterWavePairCount: value.callerQuarterWavePairCount as number,
      callerIncidentIndex: value.callerIncidentIndex as number,
      callerSubstrateIndex: value.callerSubstrateIndex as number,
    }),
});
export const run = tool.execute;
export default tool;
