import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const normalIncidenceTwoWayTimeThicknessCalculatorExample = {
  input: { twoWayTimeS: 1.5, intervalVelocityMS: 3000 },
  output: { thicknessM: 2250 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const normalIncidenceTwoWayTimeThicknessCalculatorTool =
  createSimpleTool({
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ twoWayTimeS, intervalVelocityMS }) => {
        if (intervalVelocityMS <= 0)
          simpleError(
            "intervalVelocityMS",
            "Interval velocity must be positive.",
          );
        return { thicknessM: (twoWayTimeS * intervalVelocityMS) / 2 };
      })(input as never) as Record<string, unknown>,
    description:
      "Layer thickness from normal-incidence two-way time and interval velocity.",
    id: "seismology/normal-incidence-two-way-time-thickness-calculator",
    inputs: [
      {
        minimum: 0,
        description: "Two-way time thickness.",
        id: "twoWayTimeS",
        kind: "number",
        label: "TWT",
        unit: "s",
      },
      {
        minimum: 0,
        description: "Interval velocity.",
        id: "intervalVelocityMS",
        kind: "number",
        label: "V_int",
        unit: "m/s",
      },
    ],
    outputs: [
      {
        description: "Layer thickness.",
        id: "thicknessM",
        kind: "number",
        label: "h",
        unit: "m",
      },
    ],
    title: "Normal Incidence Two Way Time Thickness Calculator",
  });
export const runNormalIncidenceTwoWayTimeThicknessCalculator =
  normalIncidenceTwoWayTimeThicknessCalculatorTool.execute;
export { normalIncidenceTwoWayTimeThicknessCalculatorExample as example };
export default normalIncidenceTwoWayTimeThicknessCalculatorTool;
