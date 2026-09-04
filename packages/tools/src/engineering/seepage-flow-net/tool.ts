import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerFlowNetFlowChannels: number;
  readonly callerFlowNetPotentialDrops: number;
  readonly observedHydraulicConductivityMSecond: number;
  readonly totalHeadDropM: number;
  readonly sectionWidthM: number;
}>;
export type Output = Readonly<{ readonly flowNetSeepageM3Second: number }>;
const inputFields = [
  {
    id: "callerFlowNetFlowChannels",
    label: "Caller flow net flow channels",
    kind: "number",
  },
  {
    id: "callerFlowNetPotentialDrops",
    label: "Caller flow net potential drops",
    kind: "number",
  },
  {
    id: "observedHydraulicConductivityMSecond",
    label: "Observed hydraulic conductivity m second",
    kind: "number",
  },
  { id: "totalHeadDropM", label: "Total head drop m", kind: "number" },
  { id: "sectionWidthM", label: "Section width m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerFlowNetFlowChannels, "callerFlowNetFlowChannels");
  positive(input.callerFlowNetPotentialDrops, "callerFlowNetPotentialDrops");
  positive(
    input.observedHydraulicConductivityMSecond,
    "observedHydraulicConductivityMSecond",
  );
  positive(input.sectionWidthM, "sectionWidthM");
  nonnegative(input.totalHeadDropM, "totalHeadDropM");
  return {
    flowNetSeepageM3Second:
      (input.observedHydraulicConductivityMSecond *
        input.totalHeadDropM *
        input.sectionWidthM *
        input.callerFlowNetFlowChannels) /
      input.callerFlowNetPotentialDrops,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFlowNetFlowChannels: 3,
  callerFlowNetPotentialDrops: 6,
  observedHydraulicConductivityMSecond: 2,
  totalHeadDropM: 4,
  sectionWidthM: 5,
} satisfies Input;
export const exampleOutput = { flowNetSeepageM3Second: 20 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/seepage-flow-net",
  title: "Seepage Flow Net Calculator",
  description:
    "Caller independently traced homogeneous isotropic flow net Q=kH(Nf/Nd)×width, not generic pressure/flow Darcy geometry. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "flowNetSeepageM3Second",
      label: "Flow net seepage m3 second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerFlowNetFlowChannels: value.callerFlowNetFlowChannels as number,
      callerFlowNetPotentialDrops: value.callerFlowNetPotentialDrops as number,
      observedHydraulicConductivityMSecond:
        value.observedHydraulicConductivityMSecond as number,
      totalHeadDropM: value.totalHeadDropM as number,
      sectionWidthM: value.sectionWidthM as number,
    }),
});
export const run = tool.execute;
export default tool;
