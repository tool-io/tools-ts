import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly fullBeamAngle: number;
};
export type Output = { readonly radius: number; readonly diameter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    fullBeamAngle: { type: "number", minimum: 0 },
  },
  required: ["distance", "fullBeamAngle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radius: { type: "number" }, diameter: { type: "number" } },
  required: ["radius", "diameter"],
} as const;
/** Circular beam footprint normal to the optical axis, with full beam angle in radians. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, fullBeamAngle } = request;
  const compute = (): Output => {
    H.domain(distance >= 0 && fullBeamAngle >= 0 && fullBeamAngle < Math.PI);
    return {
      radius: distance * Math.tan(fullBeamAngle / 2),
      diameter: 2 * distance * Math.tan(fullBeamAngle / 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 10, fullBeamAngle: 1.5707963267948966 },
  output: { radius: 9.999999999999998, diameter: 19.999999999999996 },
} satisfies ToolExample<Input, Output>;
export const followspotBeamFootprintDistanceFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "performing-arts/followspot-beam-footprint-distance-factor",
      title: "Followspot Beam Footprint Distance Factor Tool",
      description:
        "Circular beam footprint normal to the optical axis, with full beam angle in radians.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distance: { type: "number", minimum: 0 },
          fullBeamAngle: { type: "number", minimum: 0 },
        },
        required: ["distance", "fullBeamAngle"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          radius: { type: "number" },
          diameter: { type: "number" },
        },
        required: ["radius", "diameter"],
      },
      ports: {
        inputs: [
          {
            id: "distance",
            label: "Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fullBeamAngle",
            label: "Full Beam Angle",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "radius", label: "Radius", valueType: { type: "number" } },
          { id: "diameter", label: "Diameter", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = followspotBeamFootprintDistanceFactorTool.execute;
export default followspotBeamFootprintDistanceFactorTool;
