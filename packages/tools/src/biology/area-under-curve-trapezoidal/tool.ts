import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const areaUnderCurveTrapezoidalExample = {
  input: { concEnd: 6, concStart: 2, timeEnd: 4, timeStart: 0 },
  output: { areaUnderCurve: 16 },
} satisfies ToolExample<
  {
    readonly concEnd: number;
    readonly concStart: number;
    readonly timeEnd: number;
    readonly timeStart: number;
  },
  { readonly areaUnderCurve: number }
>;

export const areaUnderCurveTrapezoidalTool = createSimpleTool({
  id: "biology/area-under-curve-trapezoidal",
  title: "Trapezoidal AUC",
  description:
    "Compute the trapezoidal area under a concentration-time segment as the average of the two concentrations multiplied by the elapsed time interval.",
  inputs: [
    {
      description:
        "Concentration at the start of the interval; must not be negative.",
      id: "concStart",
      label: "Starting concentration",
      kind: "number",
      minimum: 0,
    },
    {
      description:
        "Concentration at the end of the interval; must not be negative.",
      id: "concEnd",
      label: "Ending concentration",
      kind: "number",
      minimum: 0,
    },
    {
      description: "Time at the start of the interval.",
      id: "timeStart",
      label: "Start time",
      kind: "number",
      unit: "h",
    },
    {
      description:
        "Time at the end of the interval; must be later than the start time.",
      id: "timeEnd",
      label: "End time",
      kind: "number",
      unit: "h",
    },
  ],
  outputs: [
    {
      description: "Trapezoidal area under the concentration-time segment.",
      id: "areaUnderCurve",
      label: "Area under curve",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const concStart = input.concStart as number;
    const concEnd = input.concEnd as number;
    const timeStart = input.timeStart as number;
    const timeEnd = input.timeEnd as number;
    if (!(timeEnd > timeStart))
      simpleError(
        "timeEnd",
        "The end time must be later than the start time.",
        "degenerate_interval",
      );
    return {
      areaUnderCurve: ((concStart + concEnd) / 2) * (timeEnd - timeStart),
    };
  },
});
export const runAreaUnderCurveTrapezoidal =
  areaUnderCurveTrapezoidalTool.execute;
export default areaUnderCurveTrapezoidalTool;
