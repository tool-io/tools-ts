import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import {
  validateRandomInput,
  finish,
  sourceFor,
  bounded,
  mean,
  wrap,
} from "../batch42-shared.js";

export type Input = Readonly<{ readonly seed: string; readonly count: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const random = sourceFor(input.seed, context);
  bounded(input.count, "directions", 1, 64);
  const angles = Array.from({ length: input.count }, () => 360 * random()),
    sin = mean(angles.map((v) => Math.sin((v * Math.PI) / 180))),
    cos = mean(angles.map((v) => Math.cos((v * Math.PI) / 180))),
    r = Math.hypot(sin, cos),
    resolved = r > 1e-12;
  return {
    result: {
      anglesDegrees: angles,
      resultantLength: r,
      meanDirectionKnown: resolved,
      meanDirectionDegrees: resolved
        ? wrap((Math.atan2(sin, cos) * 180) / Math.PI, 360)
        : 0,
      meanDirectionConvention: "zero-unused-when-resultant-unresolved",
    },
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: { seed: "tool.io/batch42", count: 1 },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/circular-direction-experiment",
  title: "Random Circular Direction Experiment Generator",
  description:
    "Simulate independent uniform planar directions in [0,360) and circular mean/resultant. Zero placeholder with false availability for unresolved mean; not linear averaging,3D spherical directions or a compass calibration.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
