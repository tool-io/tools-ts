import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedPitRimLevelsM: readonly number[];
  readonly observedPitFloorLevelsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedRimToFloorDepthsM: readonly number[];
  readonly maximumObservedPitDepthM: number;
}>;
const inputFields = [
  {
    id: "observedPitRimLevelsM",
    label: "Observed pit rim levels m",
    kind: "numberList",
  },
  {
    id: "observedPitFloorLevelsM",
    label: "Observed pit floor levels m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedPitRimLevelsM,
    input.observedPitFloorLevelsM,
    "observedPitRimLevelsM",
  );
  const d = input.observedPitRimLevelsM.map(
    (v, i) => v - input.observedPitFloorLevelsM[i],
  );
  d.forEach((v) => nonnegative(v, "pit depth"));
  return {
    observedRimToFloorDepthsM: d,
    maximumObservedPitDepthM: Math.max(...d),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPitRimLevelsM: [100, 102],
  observedPitFloorLevelsM: [80, 81],
} satisfies Input;
export const exampleOutput = {
  observedRimToFloorDepthsM: [20, 21],
  maximumObservedPitDepthM: 21,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/pit-depth",
  title: "Pit Depth Calculator",
  description:
    "Audit actual matched rim/floor elevations across pit survey pairs, not assumed slope×radius or geodesy. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRimToFloorDepthsM",
      label: "Observed rim to floor depths m",
      kind: "numberList",
    },
    {
      id: "maximumObservedPitDepthM",
      label: "Maximum observed pit depth m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPitRimLevelsM: value.observedPitRimLevelsM as readonly number[],
      observedPitFloorLevelsM:
        value.observedPitFloorLevelsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
