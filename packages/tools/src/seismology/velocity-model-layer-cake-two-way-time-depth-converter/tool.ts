import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const velocityModelLayerCakeTwoWayTimeDepthConverterExample = {
  input: { layerVelocitiesMS: [2000, 3000], layerThicknessesM: [1000, 1500] },
  output: { totalDepthM: 2500, twoWayTimeS: 2 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const velocityModelLayerCakeTwoWayTimeDepthConverterTool =
  createSimpleTool({
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ layerVelocitiesMS, layerThicknessesM }) => {
        const V = layerVelocitiesMS as unknown[];
        const H = layerThicknessesM as unknown[];
        if (
          !Array.isArray(V) ||
          !Array.isArray(H) ||
          V.length !== H.length ||
          V.length === 0
        )
          simpleError("layerVelocitiesMS", "Provide matching layer lists.");
        let z = 0,
          twt = 0;
        for (let i = 0; i < V.length; i++) {
          const v = (V as number[])[i];
          const h = (H as number[])[i];
          if (v <= 0)
            simpleError("layerVelocitiesMS", "Velocities must be positive.");
          if (h < 0)
            simpleError("layerThicknessesM", "Thicknesses cannot be negative.");
          z += h;
          twt += (2 * h) / v;
        }
        if (z <= 0)
          simpleError(
            "layerThicknessesM",
            "Total model depth must be positive.",
          );
        return { totalDepthM: z, twoWayTimeS: twt };
      })(input as never) as Record<string, unknown>,
    description: "Depth from two-way time through a layer-cake velocity model.",
    id: "seismology/velocity-model-layer-cake-two-way-time-depth-converter",
    inputs: [
      {
        description: "Interval velocities top-down.",
        id: "layerVelocitiesMS",
        kind: "numberList",
        label: "V_i",
      },
      {
        description: "Layer thicknesses.",
        id: "layerThicknessesM",
        kind: "numberList",
        label: "h_i",
      },
    ],
    outputs: [
      {
        description: "Total model depth.",
        id: "totalDepthM",
        kind: "number",
        label: "z",
        unit: "m",
      },
      {
        description: "Two-way time to the base.",
        id: "twoWayTimeS",
        kind: "number",
        label: "TWT",
        unit: "s",
      },
    ],
    title: "Velocity Model Layer Cake Two Way Time Depth Converter",
  });
export const runVelocityModelLayerCakeTwoWayTimeDepthConverter =
  velocityModelLayerCakeTwoWayTimeDepthConverterTool.execute;
export { velocityModelLayerCakeTwoWayTimeDepthConverterExample as example };
export default velocityModelLayerCakeTwoWayTimeDepthConverterTool;
