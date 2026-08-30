import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly probitIntercept: number;
  readonly probitSlope: number;
  readonly targetNormalQuantile: number;
}>;
export type Output = Readonly<{
  readonly log10DetectionConcentration: number;
  readonly detectionConcentration: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.probitSlope, "probitSlope");
  const log10DetectionConcentration =
    (input.targetNormalQuantile - input.probitIntercept) / input.probitSlope;
  return {
    log10DetectionConcentration,
    detectionConcentration: 10 ** log10DetectionConcentration,
  };
};
export const exampleInput = {
  probitIntercept: 0,
  probitSlope: 1,
  targetNormalQuantile: 1.6448536269514722,
} satisfies Input;
export const exampleOutput = {
  log10DetectionConcentration: 1.6448536269514722,
  detectionConcentration: 44.14216471165427,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/probit-detection-limit",
  title: "Probit Detection Limit",
  description:
    "Invert a fitted standard-normal probit versus log10 concentration model at a caller quantile (1.64485 for 95% hits); coefficients use probit zero, not probit five.",
  inputs: [
    { id: "probitIntercept", label: "Probit intercept", kind: "number" },
    { id: "probitSlope", label: "Probit slope", kind: "number" },
    {
      id: "targetNormalQuantile",
      label: "Target normal quantile",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "log10DetectionConcentration",
      label: "Log 10 detection concentration",
      kind: "number",
    },
    {
      id: "detectionConcentration",
      label: "Detection concentration",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      probitIntercept: value.probitIntercept as number,
      probitSlope: value.probitSlope as number,
      targetNormalQuantile: value.targetNormalQuantile as number,
    }),
});
export const run = tool.execute;
export default tool;
