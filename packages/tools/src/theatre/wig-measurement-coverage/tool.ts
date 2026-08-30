import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit wig measurement coverage.",
  expected: { id: "requiredMeasurements", label: "Required wig measurements" },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "theatre/wig-measurement-coverage",
  observed: { id: "recordedMeasurements", label: "Recorded measurements" },
  title: "Wig Measurement Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
