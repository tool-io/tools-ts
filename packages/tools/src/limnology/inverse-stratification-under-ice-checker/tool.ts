import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  strictlyIncreasing,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly depthsBelowIceM: readonly number[];
  readonly observedTemperaturesC: readonly number[];
  readonly callerTemperatureToleranceC: number;
}>;
export type Output = Readonly<{
  readonly resolvedWarmingWithDepth: boolean;
  readonly withinInverseUnderIceTemperatureDomain: boolean;
  readonly inverseUnderIceProfileCandidate: boolean;
}>;
const inputFields = [
  { id: "depthsBelowIceM", label: "Depths below ice m", kind: "numberList" },
  {
    id: "observedTemperaturesC",
    label: "Observed temperatures c",
    kind: "numberList",
  },
  {
    id: "callerTemperatureToleranceC",
    label: "Caller temperature tolerance c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.depthsBelowIceM.forEach((v) => nonnegative(v, "depthsBelowIceM"));
  nonnegative(input.callerTemperatureToleranceC, "callerTemperatureToleranceC");
  aligned(
    input.depthsBelowIceM,
    input.observedTemperaturesC,
    "depthsBelowIceM",
  );
  strictlyIncreasing(input.depthsBelowIceM, "depth");
  const domain = input.observedTemperaturesC.every((t) => t >= 0 && t <= 4),
    warming = input.observedTemperaturesC.every(
      (t, i) =>
        i === 0 ||
        t - input.observedTemperaturesC[i - 1] >
          input.callerTemperatureToleranceC,
    );
  return {
    resolvedWarmingWithDepth: warming,
    withinInverseUnderIceTemperatureDomain: domain,
    inverseUnderIceProfileCandidate: domain && warming,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthsBelowIceM: [0, 1, 2],
  observedTemperaturesC: [0, 2, 4],
  callerTemperatureToleranceC: 0.1,
} satisfies Input;
export const exampleOutput = {
  resolvedWarmingWithDepth: true,
  withinInverseUnderIceTemperatureDomain: true,
  inverseUnderIceProfileCandidate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/inverse-stratification-under-ice-checker",
  title: "Inverse Stratification Under Ice Checker",
  description:
    "Screen actual under-ice 0–4°C warming-with-depth profile using caller measurement tolerance; candidate temperature evidence only, not salinity-aware stability or confirmation of whole-lake stratification.",
  inputs: inputFields,
  outputs: [
    {
      id: "resolvedWarmingWithDepth",
      label: "Resolved warming with depth",
      kind: "boolean",
    },
    {
      id: "withinInverseUnderIceTemperatureDomain",
      label: "Within inverse under ice temperature domain",
      kind: "boolean",
    },
    {
      id: "inverseUnderIceProfileCandidate",
      label: "Inverse under ice profile candidate",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      depthsBelowIceM: value.depthsBelowIceM as readonly number[],
      observedTemperaturesC: value.observedTemperaturesC as readonly number[],
      callerTemperatureToleranceC: value.callerTemperatureToleranceC as number,
    }),
});
export const run = tool.execute;
export default tool;
