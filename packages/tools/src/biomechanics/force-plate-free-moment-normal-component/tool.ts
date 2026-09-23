import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly momentZ: number;
  readonly centerX: number;
  readonly centerY: number;
  readonly forceX: number;
  readonly forceY: number;
};
export type Output = {
  readonly orbitalMoment: number;
  readonly freeMoment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    momentZ: { type: "number" },
    centerX: { type: "number" },
    centerY: { type: "number" },
    forceX: { type: "number" },
    forceY: { type: "number" },
  },
  required: ["momentZ", "centerX", "centerY", "forceX", "forceY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orbitalMoment: { type: "number" },
    freeMoment: { type: "number" },
  },
  required: ["orbitalMoment", "freeMoment"],
} as const;
/** Right-handed contact-plane wrench decomposition Tz=Mz-(x*Fy-y*Fx), using COP coordinates in the same frame as moments. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { momentZ, centerX, centerY, forceX, forceY } = request;
  const compute = (): Output => {
    return {
      orbitalMoment: centerX * forceY - centerY * forceX,
      freeMoment: momentZ - centerX * forceY + centerY * forceX,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { momentZ: 10, centerX: 1, centerY: 2, forceX: 3, forceY: 4 },
  output: { orbitalMoment: -2, freeMoment: 12 },
} satisfies ToolExample<Input, Output>;
export const forcePlateFreeMomentNormalComponentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biomechanics/force-plate-free-moment-normal-component",
      title: "Force Plate Free Moment Normal Component Tool",
      description:
        "Right-handed contact-plane wrench decomposition Tz=Mz-(x*Fy-y*Fx), using COP coordinates in the same frame as moments.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          momentZ: { type: "number" },
          centerX: { type: "number" },
          centerY: { type: "number" },
          forceX: { type: "number" },
          forceY: { type: "number" },
        },
        required: ["momentZ", "centerX", "centerY", "forceX", "forceY"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          orbitalMoment: { type: "number" },
          freeMoment: { type: "number" },
        },
        required: ["orbitalMoment", "freeMoment"],
      },
      ports: {
        inputs: [
          {
            id: "momentZ",
            label: "Moment Z",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "centerX",
            label: "Center X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "centerY",
            label: "Center Y",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "forceX",
            label: "Force X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "forceY",
            label: "Force Y",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "orbitalMoment",
            label: "Orbital Moment",
            valueType: { type: "number" },
          },
          {
            id: "freeMoment",
            label: "Free Moment",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = forcePlateFreeMomentNormalComponentTool.execute;
export default forcePlateFreeMomentNormalComponentTool;
