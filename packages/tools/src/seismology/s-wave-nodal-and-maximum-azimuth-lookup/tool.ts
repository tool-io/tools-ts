import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const sWaveNodalAndMaximumAzimuthLookupExample = {
  input: { strikeDeg: 40 },
  output: { nodalAzimuthsDeg: [40, 130], maxAmplitudeAzimuthsDeg: [85, 355] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const sWaveNodalAndMaximumAzimuthLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ strikeDeg }) => ({
      nodalAzimuthsDeg: [strikeDeg % 360, (strikeDeg + 90) % 360],
      maxAmplitudeAzimuthsDeg: [
        (((strikeDeg + 45) % 360) + 360) % 360,
        (((strikeDeg - 45) % 360) + 360) % 360,
      ],
    }))(input as never) as Record<string, unknown>,
  description:
    "Nodal and maximum-radiation azimuths of the strike-slip S-wave pattern R ∝ sin 2(az − φ).",
  id: "seismology/s-wave-nodal-and-maximum-azimuth-lookup",
  inputs: [
    {
      minimum: 0,
      description: "Fault strike.",
      id: "strikeDeg",
      kind: "number",
      label: "φ",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Azimuths of zero radiation.",
      id: "nodalAzimuthsDeg",
      kind: "numberList",
      label: "Nodes",
      unit: "°",
    },
    {
      description: "Azimuths of peak radiation.",
      id: "maxAmplitudeAzimuthsDeg",
      kind: "numberList",
      label: "Maxima",
      unit: "°",
    },
  ],
  title: "S-Wave Nodal And Maximum Azimuth Lookup",
});
export const runSWaveNodalAndMaximumAzimuthLookup =
  sWaveNodalAndMaximumAzimuthLookupTool.execute;
export { sWaveNodalAndMaximumAzimuthLookupExample as example };
export default sWaveNodalAndMaximumAzimuthLookupTool;
