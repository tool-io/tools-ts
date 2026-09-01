import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedFrontLitScrimLux: number;
  readonly observedRearSceneLux: number;
  readonly callerRevealRatioMinimum: number;
}>;
export type Output = Readonly<{
  readonly rearToFrontMeasuredIlluminanceRatio: number;
  readonly meetsCallerRevealLightingPlan: boolean;
}>;
const inputFields = [
  {
    id: "observedFrontLitScrimLux",
    label: "Observed front lit scrim lux",
    kind: "number",
  },
  {
    id: "observedRearSceneLux",
    label: "Observed rear scene lux",
    kind: "number",
  },
  {
    id: "callerRevealRatioMinimum",
    label: "Caller reveal ratio minimum",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedFrontLitScrimLux, "observedFrontLitScrimLux");
  nonnegative(input.observedRearSceneLux, "observedRearSceneLux");
  nonnegative(input.callerRevealRatioMinimum, "callerRevealRatioMinimum");
  const ratio = input.observedRearSceneLux / input.observedFrontLitScrimLux;
  return {
    rearToFrontMeasuredIlluminanceRatio: ratio,
    meetsCallerRevealLightingPlan: ratio >= input.callerRevealRatioMinimum,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFrontLitScrimLux: 20,
  observedRearSceneLux: 100,
  callerRevealRatioMinimum: 4,
} satisfies Input;
export const exampleOutput = {
  rearToFrontMeasuredIlluminanceRatio: 5,
  meetsCallerRevealLightingPlan: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/scrim-front-versus-rear-reveal-ratio-lookup",
  title: "Scrim Front versus Rear Reveal Ratio Lookup",
  description:
    "Audit independently measured front/rear scrim lighting ratio under caller reveal target; not a guarantee of perceived transparency, weave-independent concealment or inferred fixture intensity.",
  inputs: inputFields,
  outputs: [
    {
      id: "rearToFrontMeasuredIlluminanceRatio",
      label: "Rear to front measured illuminance ratio",
      kind: "number",
    },
    {
      id: "meetsCallerRevealLightingPlan",
      label: "Meets caller reveal lighting plan",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFrontLitScrimLux: value.observedFrontLitScrimLux as number,
      observedRearSceneLux: value.observedRearSceneLux as number,
      callerRevealRatioMinimum: value.callerRevealRatioMinimum as number,
    }),
});
export const run = tool.execute;
export default tool;
