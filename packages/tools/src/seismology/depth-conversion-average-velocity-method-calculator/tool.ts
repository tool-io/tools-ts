import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const depthConversionAverageVelocityMethodCalculatorExample = {
  input: { oneWayTimeS: 1.2, averageVelocityMS: 2800 },
  output: { depthM: 3360 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const depthConversionAverageVelocityMethodCalculatorTool =
  createSimpleTool({
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ oneWayTimeS, averageVelocityMS }) => {
        if (!(averageVelocityMS > 0))
          simpleError(
            "averageVelocityMS",
            "Average velocity must be positive.",
          );
        return { depthM: oneWayTimeS * averageVelocityMS };
      })(input as never) as Record<string, unknown>,
    description:
      "Convert an event's one-way time to depth with a constant average velocity.",
    id: "seismology/depth-conversion-average-velocity-method-calculator",
    inputs: [
      {
        minimum: 0,
        description: "One-way time to the reflector.",
        id: "oneWayTimeS",
        kind: "number",
        label: "t",
        unit: "s",
      },
      {
        minimum: 0,
        description: "Average velocity above the target.",
        id: "averageVelocityMS",
        kind: "number",
        label: "V_avg",
        unit: "m/s",
      },
    ],
    outputs: [
      {
        description: "Depth of the target.",
        id: "depthM",
        kind: "number",
        label: "z",
        unit: "m",
      },
    ],
    title: "Depth Conversion Average Velocity Method Calculator",
  });
export const runDepthConversionAverageVelocityMethodCalculator =
  depthConversionAverageVelocityMethodCalculatorTool.execute;
export { depthConversionAverageVelocityMethodCalculatorExample as example };
export default depthConversionAverageVelocityMethodCalculatorTool;
