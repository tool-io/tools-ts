import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  strictlyIncreasing,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedTfetGateV: readonly number[];
  readonly observedTfetCurrentAmps: readonly number[];
}>;
export type Output = Readonly<{
  readonly segmentTfetSwingVoltsDecade: readonly number[];
  readonly minimumMeasuredTfetSwingVoltsDecade: number;
}>;
const inputFields = [
  {
    id: "observedTfetGateV",
    label: "Observed tfet gate v",
    kind: "numberList",
  },
  {
    id: "observedTfetCurrentAmps",
    label: "Observed tfet current amps",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTfetCurrentAmps.forEach((v) =>
    positive(v, "observedTfetCurrentAmps"),
  );
  aligned(
    input.observedTfetGateV,
    input.observedTfetCurrentAmps,
    "subthreshold",
  );
  strictlyIncreasing(input.observedTfetGateV, "gate");
  strictlyIncreasing(input.observedTfetCurrentAmps, "current");
  const swings = input.observedTfetGateV
    .slice(1)
    .map(
      (v, i) =>
        (v - input.observedTfetGateV[i]) /
        Math.log10(
          input.observedTfetCurrentAmps[i + 1] /
            input.observedTfetCurrentAmps[i],
        ),
    );
  return {
    segmentTfetSwingVoltsDecade: swings,
    minimumMeasuredTfetSwingVoltsDecade: Math.min(...swings),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTfetGateV: [0, 0.03, 0.08],
  observedTfetCurrentAmps: [1, 10, 100],
} satisfies Input;
export const exampleOutput = {
  segmentTfetSwingVoltsDecade: [0.03, 0.05],
  minimumMeasuredTfetSwingVoltsDecade: 0.03,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/tunnel-fet-subthreshold-swing",
  title: "Semiconductor Tunnel Fet Subthreshold Swing Calculator",
  description:
    "Audit local measured TFET swing per actual current decade, not global fitted ferroelectric slope or theoretical thermal MOS swing; caller independently verifies monotone tunneling branch.",
  inputs: inputFields,
  outputs: [
    {
      id: "segmentTfetSwingVoltsDecade",
      label: "Segment tfet swing volts decade",
      kind: "numberList",
    },
    {
      id: "minimumMeasuredTfetSwingVoltsDecade",
      label: "Minimum measured tfet swing volts decade",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTfetGateV: value.observedTfetGateV as readonly number[],
      observedTfetCurrentAmps:
        value.observedTfetCurrentAmps as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
