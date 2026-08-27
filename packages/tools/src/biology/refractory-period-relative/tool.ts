import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RefractoryPeriodRelativeInput = {
  readonly absoluteRefractoryMs?: number;
  readonly elapsedMs: number;
  readonly relativeWindowMs?: number;
};

export type RefractoryPeriodRelativeOutput = {
  readonly recoveryFraction: number;
};

export const refractoryPeriodRelativeExample = {
  input: { elapsedMs: 2.5 },
  output: { recoveryFraction: 0.5 },
} satisfies ToolExample<
  RefractoryPeriodRelativeInput,
  RefractoryPeriodRelativeOutput
>;

export const refractoryPeriodRelativeTool = createSimpleTool({
  id: "biology/refractory-period-relative",
  title: "Relative Refractory Period",
  description:
    "Compute the fraction of relative refractory recovery clamped to 0..1 from elapsed time, the absolute refractory duration, and the relative recovery window.",
  inputs: [
    {
      default: 1,
      description: "Absolute refractory duration; defaults to 1 ms.",
      id: "absoluteRefractoryMs",
      kind: "number",
      label: "Absolute refractory period",
      maximum: 10,
      minimum: 0.1,
      unit: "ms",
    },
    {
      id: "elapsedMs",
      kind: "number",
      label: "Elapsed time",
      minimum: 0,
      unit: "ms",
    },
    {
      default: 3,
      description:
        "Relative recovery window length; strictly between 0 and 50 ms, defaults to 3 ms.",
      id: "relativeWindowMs",
      kind: "number",
      label: "Relative window",
      unit: "ms",
    },
  ],
  outputs: [
    {
      id: "recoveryFraction",
      kind: "number",
      label: "Recovery fraction",
    },
  ],
  calculate: (input) => {
    const relativeWindowMs = input.relativeWindowMs as number;
    if (!(relativeWindowMs > 0 && relativeWindowMs < 50))
      simpleError(
        "relativeWindowMs",
        "The relative window must lie strictly between 0 and 50 ms.",
        "invalid_window",
      );
    return {
      recoveryFraction: Math.min(
        1,
        Math.max(
          0,
          ((input.elapsedMs as number) -
            (input.absoluteRefractoryMs as number)) /
            relativeWindowMs,
        ),
      ),
    };
  },
});
export const runRefractoryPeriodRelative = refractoryPeriodRelativeTool.execute;
export default refractoryPeriodRelativeTool;
