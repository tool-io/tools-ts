import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    time: 10,
    earlyAmplitude: 0.01,
    earlyTimeConstant: 2,
    constantRate: 0.001,
    weibullScale: 100,
    weibullShape: 2,
  },
  output: { hazardRate: 0.0030673794699908547 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/bathtub-failure-rate",
  title: "Bathtub Failure Rate Model",
  description:
    "Evaluate a simple bathtub-shaped hazard model: early exponential decay plus constant random-failure rate plus a Weibull wear-out term. All time parameters use the same unit; this is an illustrative model that requires fitted coefficients.",
  inputs: [
    { id: "time", kind: "number", label: "Elapsed time", minimum: 0 },
    {
      id: "earlyAmplitude",
      kind: "number",
      label: "Early-failure amplitude",
      minimum: 0,
    },
    {
      id: "earlyTimeConstant",
      kind: "number",
      label: "Early decay time",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "constantRate",
      kind: "number",
      label: "Constant hazard rate",
      minimum: 0,
    },
    {
      id: "weibullScale",
      kind: "number",
      label: "Wear-out scale",
      minimum: Number.MIN_VALUE,
    },
    { id: "weibullShape", kind: "number", label: "Wear-out shape", minimum: 1 },
  ],
  outputs: [{ id: "hazardRate", kind: "number", label: "Hazard Rate" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      hazardRate:
        i.earlyAmplitude * Math.exp(-i.time / i.earlyTimeConstant) +
        i.constantRate +
        (i.weibullShape / i.weibullScale) *
          Math.pow(i.time / i.weibullScale, i.weibullShape - 1),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type BathtubFailureRateInput = Readonly<typeof example.input>;
export type BathtubFailureRateOutput = Readonly<typeof example.output>;
export const bathtubFailureRateTool = tool;
export const runBathtubFailureRate = tool.execute;
export default tool;
