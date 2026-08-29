import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const tsunamiSeafloorVerticalOffsetExample = {
  input: { slipM: 5, dipDeg: 14 },
  output: {
    verticalOffsetM: 1.2096094779983386,
    verticalSlipFraction: 0.24192189559966773,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tsunamiSeafloorVerticalOffsetTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ slipM, dipDeg }) => {
      const rad = (dipDeg * Math.PI) / 180;
      return {
        verticalOffsetM: slipM * Math.sin(rad),
        verticalSlipFraction: Math.sin(rad),
      };
    })(input as never) as Record<string, unknown>,
  description:
    "First-order seafloor vertical offset from dip-slip on a fault: u ≈ slip·sin(dip).",
  id: "seismology/tsunami-seafloor-vertical-offset",
  inputs: [
    {
      minimum: 0,
      description: "Average coseismic slip.",
      id: "slipM",
      kind: "number",
      label: "u_s",
      unit: "m",
    },
    {
      minimum: 0,
      maximum: 90,
      description: "Fault dip.",
      id: "dipDeg",
      kind: "number",
      label: "δ",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Vertical seafloor offset.",
      id: "verticalOffsetM",
      kind: "number",
      label: "u_z",
      unit: "m",
    },
    {
      description: "Geometric vertical-to-total slip ratio, sin(dip).",
      id: "verticalSlipFraction",
      kind: "number",
      label: "η",
    },
  ],
  title: "Tsunami Seafloor Vertical Offset Calculator",
});
export const runTsunamiSeafloorVerticalOffset =
  tsunamiSeafloorVerticalOffsetTool.execute;
export { tsunamiSeafloorVerticalOffsetExample as example };
export default tsunamiSeafloorVerticalOffsetTool;
