import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, sum } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerCriticalFlowRatios: readonly number[];
  readonly totalLostTimeSeconds: number;
}>;
export type Output = Readonly<{
  readonly websterModeledCycleSeconds: number;
  readonly effectiveGreenSecondsByCriticalStage: readonly number[];
}>;
const inputFields = [
  {
    id: "callerCriticalFlowRatios",
    label: "Caller critical flow ratios",
    kind: "numberList",
  },
  {
    id: "totalLostTimeSeconds",
    label: "Total lost time seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerCriticalFlowRatios.forEach((v) =>
    nonnegative(v, "callerCriticalFlowRatios"),
  );
  nonnegative(input.totalLostTimeSeconds, "totalLostTimeSeconds");
  const y = sum(input.callerCriticalFlowRatios);
  if (y <= 0 || y >= 1)
    simpleError("flow", "0<sum of independent critical stage ratios<1.");
  const cycle = (1.5 * input.totalLostTimeSeconds + 5) / (1 - y);
  return {
    websterModeledCycleSeconds: cycle,
    effectiveGreenSecondsByCriticalStage: input.callerCriticalFlowRatios.map(
      (v) => ((cycle - input.totalLostTimeSeconds) * v) / y,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCriticalFlowRatios: [0.2, 0.3],
  totalLostTimeSeconds: 10,
} satisfies Input;
export const exampleOutput = {
  websterModeledCycleSeconds: 40,
  effectiveGreenSecondsByCriticalStage: [12, 18],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/signal-timing-webster",
  title: "Webster Signal Timing Calculator",
  description:
    "Webster isolated undersaturated cycle (1.5L+5)/(1−Σy), effective greens ratio-allocated; no intergreen/pedestrian timing or network recommendation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "websterModeledCycleSeconds",
      label: "Webster modeled cycle seconds",
      kind: "number",
    },
    {
      id: "effectiveGreenSecondsByCriticalStage",
      label: "Effective green seconds by critical stage",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCriticalFlowRatios:
        value.callerCriticalFlowRatios as readonly number[],
      totalLostTimeSeconds: value.totalLostTimeSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
