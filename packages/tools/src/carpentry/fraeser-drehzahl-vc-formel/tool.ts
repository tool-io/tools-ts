import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RouterRpmInput = {
  readonly cuttingSpeedMPm: number;
  readonly diameterMm: number;
};

export type RouterRpmOutput = {
  readonly rpm: number;
};

export const routerRpmExample = {
  input: { cuttingSpeedMPm: 600, diameterMm: 8 },
  output: { rpm: 23873.241463784303 },
} satisfies ToolExample<RouterRpmInput, RouterRpmOutput>;

export const routerRpmTool = createSimpleTool({
  id: "carpentry/fraeser-drehzahl-vc-formel",
  title: "Router RPM VC Formula",
  description:
    "Calculate the router spindle speed in revolutions per minute from cutting speed and tool diameter.",
  inputs: [
    {
      id: "cuttingSpeedMPm",
      kind: "number",
      label: "Cutting speed",
      unit: "m/min",
    },
    {
      id: "diameterMm",
      kind: "number",
      label: "Tool diameter",
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "rpm",
      kind: "number",
      label: "Spindle speed",
      unit: "1/min",
    },
  ],
  calculate: (input) => {
    const cuttingSpeedMPm = input.cuttingSpeedMPm as number;
    const diameterMm = input.diameterMm as number;
    if (!(cuttingSpeedMPm > 0))
      simpleError(
        "cuttingSpeedMPm",
        "Cutting speed must be greater than zero.",
        "invalid_cutting_speed",
      );
    if (!(diameterMm > 0))
      simpleError(
        "diameterMm",
        "Tool diameter must be greater than zero.",
        "invalid_diameter",
      );
    return { rpm: (cuttingSpeedMPm * 1000) / (Math.PI * diameterMm) };
  },
});
export const runRouterRpm = routerRpmTool.execute;
export default routerRpmTool;
