import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { failureRatePerHour: 0.000001 },
  output: { fit: 1000 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/fit-rate",
  title: "FIT Failure Rate",
  description:
    "Convert a constant failure rate in failures per hour to FIT (failures per billion device-hours). FIT=λ×10⁹; it is an expected population rate, not a prediction of an individual device's failure date.",
  inputs: [
    {
      id: "failureRatePerHour",
      kind: "number",
      label: "Failure rate (1/h)",
      minimum: 0,
    },
  ],
  outputs: [{ id: "fit", kind: "number", label: "fit" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = { fit: i.failureRatePerHour * 1e9 };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type FitRateInput = Readonly<typeof example.input>;
export type FitRateOutput = Readonly<typeof example.output>;
export const fitRateTool = tool;
export const runFitRate = tool.execute;
export default tool;
