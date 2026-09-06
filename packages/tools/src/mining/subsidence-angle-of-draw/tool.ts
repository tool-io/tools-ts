import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedPanelEdgeToSubsidenceLimitM: readonly number[];
  readonly observedMatchedPanelDepthM: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedDrawAnglesFromVerticalDeg: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPanelEdgeToSubsidenceLimitM",
    label: "Observed panel edge to subsidence limit m",
    kind: "numberList",
  },
  {
    id: "observedMatchedPanelDepthM",
    label: "Observed matched panel depth m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedPanelDepthM.forEach((v) =>
    positive(v, "observedMatchedPanelDepthM"),
  );
  input.observedPanelEdgeToSubsidenceLimitM.forEach((v) =>
    nonnegative(v, "observedPanelEdgeToSubsidenceLimitM"),
  );
  aligned(
    input.observedPanelEdgeToSubsidenceLimitM,
    input.observedMatchedPanelDepthM,
    "observedPanelEdgeToSubsidenceLimitM",
  );
  return {
    observedDrawAnglesFromVerticalDeg:
      input.observedPanelEdgeToSubsidenceLimitM.map(
        (v, i) =>
          (Math.atan(v / input.observedMatchedPanelDepthM[i]) * 180) / Math.PI,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPanelEdgeToSubsidenceLimitM: [10, 20],
  observedMatchedPanelDepthM: [10, 10],
} satisfies Input;
export const exampleOutput = {
  observedDrawAnglesFromVerticalDeg: [45, 63.43494882292201],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/subsidence-angle-of-draw",
  title: "Angle of Draw Subsidence Calculator",
  description:
    "Invert actual independently detected subsidence-limit offsets and depth to angle FROM VERTICAL, not forward panel-width influence envelope or safe exclusion zone. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDrawAnglesFromVerticalDeg",
      label: "Observed draw angles from vertical deg",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPanelEdgeToSubsidenceLimitM:
        value.observedPanelEdgeToSubsidenceLimitM as readonly number[],
      observedMatchedPanelDepthM:
        value.observedMatchedPanelDepthM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
