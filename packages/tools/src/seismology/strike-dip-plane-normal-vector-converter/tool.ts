import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const strikeDipPlaneNormalVectorConverterExample = {
  input: { strikeDeg: 90, dipDeg: 45 },
  output: {
    normalEast: Math.cos((90 * Math.PI) / 180) * Math.sin((45 * Math.PI) / 180),
    normalNorth:
      -Math.sin((90 * Math.PI) / 180) * Math.sin((45 * Math.PI) / 180),
    normalUp: Math.cos((45 * Math.PI) / 180),
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const strikeDipPlaneNormalVectorConverterTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ strikeDeg, dipDeg }) => {
      const f = (strikeDeg * Math.PI) / 180;
      const d = (dipDeg * Math.PI) / 180;
      return {
        normalEast: Math.cos(f) * Math.sin(d),
        normalNorth: -Math.sin(f) * Math.sin(d),
        normalUp: Math.cos(d),
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Unit normal of a plane from strike/dip in ENU axes: n = (cosφ·sinδ, −sinφ·sinδ, cosδ).",
  id: "seismology/strike-dip-plane-normal-vector-converter",
  inputs: [
    {
      minimum: 0,
      maximum: 360,
      description: "Strike azimuth clockwise from north.",
      id: "strikeDeg",
      kind: "number",
      label: "φ",
      unit: "°",
    },
    {
      minimum: 0,
      maximum: 90,
      description: "Dip from horizontal.",
      id: "dipDeg",
      kind: "number",
      label: "δ",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "East component.",
      id: "normalEast",
      kind: "number",
      label: "n_E",
    },
    {
      description: "North component.",
      id: "normalNorth",
      kind: "number",
      label: "n_N",
    },
    {
      description: "Up component.",
      id: "normalUp",
      kind: "number",
      label: "n_U",
    },
  ],
  title: "Strike Dip Plane Normal Vector Converter",
});
export const runStrikeDipPlaneNormalVectorConverter =
  strikeDipPlaneNormalVectorConverterTool.execute;
export { strikeDipPlaneNormalVectorConverterExample as example };
export default strikeDipPlaneNormalVectorConverterTool;
