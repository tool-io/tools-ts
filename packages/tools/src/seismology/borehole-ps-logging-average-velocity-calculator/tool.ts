import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const boreholePsLoggingAverageVelocityCalculatorExample = {
  input: {
    shallowDepthM: 10,
    deepDepthM: 30,
    shallowArrivalS: 0.02,
    deepArrivalS: 0.05,
  },
  output: {
    intervalVelocityMS: 20 / (0.05 - 0.02),
    averageVelocityMS: 30 / 0.05,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const boreholePsLoggingAverageVelocityCalculatorTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ shallowDepthM, deepDepthM, shallowArrivalS, deepArrivalS }) => {
      const dz = deepDepthM - shallowDepthM;
      const dt = deepArrivalS - shallowArrivalS;
      if (dz <= 0 || dt <= 0)
        simpleError("deepDepthM", "Require increasing depth and arrival time.");
      return {
        intervalVelocityMS: dz / dt,
        averageVelocityMS: deepDepthM / deepArrivalS,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Interval and average shear velocities from downhole first-arrival times at two depths.",
  id: "seismology/borehole-ps-logging-average-velocity-calculator",
  inputs: [
    {
      minimum: 0,
      description: "Upper receiver depth.",
      id: "shallowDepthM",
      kind: "number",
      label: "z₁",
      unit: "m",
    },
    {
      minimum: 0,
      description: "Lower receiver depth.",
      id: "deepDepthM",
      kind: "number",
      label: "z₂",
      unit: "m",
    },
    {
      minimum: 0,
      description: "First arrival at z₁.",
      id: "shallowArrivalS",
      kind: "number",
      label: "t₁",
      unit: "s",
    },
    {
      minimum: 0,
      description: "First arrival at z₂.",
      id: "deepArrivalS",
      kind: "number",
      label: "t₂",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Velocity between the receivers.",
      id: "intervalVelocityMS",
      kind: "number",
      label: "V_int",
      unit: "m/s",
    },
    {
      description: "Average velocity from surface to z₂.",
      id: "averageVelocityMS",
      kind: "number",
      label: "V_avg",
      unit: "m/s",
    },
  ],
  title: "Borehole PS Logging Average Velocity Calculator",
});
export const runBoreholePsLoggingAverageVelocityCalculator =
  boreholePsLoggingAverageVelocityCalculatorTool.execute;
export { boreholePsLoggingAverageVelocityCalculatorExample as example };
export default boreholePsLoggingAverageVelocityCalculatorTool;
