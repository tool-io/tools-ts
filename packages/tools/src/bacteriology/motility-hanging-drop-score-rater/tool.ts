import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch53-shared.js";

export type Input = Readonly<{
  netDisplacementMicrometres: number;
  elapsedSeconds: number;
  callerMotionThreshold: number;
  brownianOnly: boolean;
  observationKnown: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "netDisplacementMicrometres",
    label: "Net displacement micrometres",
    kind: "number",
  },
  { id: "elapsedSeconds", label: "Elapsed seconds", kind: "number" },
  {
    id: "callerMotionThreshold",
    label: "Caller motion threshold",
    kind: "number",
  },
  { id: "brownianOnly", label: "Brownian only", kind: "boolean" },
  { id: "observationKnown", label: "Observation known", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.netDisplacementMicrometres, "displacement");
  positive(i.elapsedSeconds, "time");
  nonnegative(i.callerMotionThreshold, "threshold");
  const speed = i.netDisplacementMicrometres / i.elapsedSeconds;
  return {
    observedSpeedMicrometresPerSecond: speed,
    motionEvidence: !i.observationKnown
      ? "unknown"
      : i.brownianOnly
        ? "brownian-only"
        : speed > i.callerMotionThreshold
          ? "directed-motion-supported"
          : "not-above-threshold",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    netDisplacementMicrometres: 4,
    elapsedSeconds: 2,
    callerMotionThreshold: 1,
    brownianOnly: false,
    observationKnown: true,
  },
  output: {
    result: {
      observedSpeedMicrometresPerSecond: 2,
      motionEvidence: "directed-motion-supported",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/motility-hanging-drop-score-rater",
  title: "Motility Hanging Drop Motion Score Rater",
  description:
    "Score independently tracked hanging-drop displacement against a caller motion threshold; Brownian-only or unknown observations are not positive motility.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
