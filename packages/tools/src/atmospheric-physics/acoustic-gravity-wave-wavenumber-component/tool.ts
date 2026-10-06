import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wavenumberMagnitude: number;
  readonly propagationAngleRadians: number;
};
export type Output = {
  readonly horizontalComponent: number;
  readonly verticalComponent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wavenumberMagnitude: { type: "number", minimum: 0 },
    propagationAngleRadians: { type: "number" },
  },
  required: ["wavenumberMagnitude", "propagationAngleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalComponent: { type: "number" },
    verticalComponent: { type: "number" },
  },
  required: ["horizontalComponent", "verticalComponent"],
} as const;
/** Resolve a supplied wave-number magnitude along horizontal and vertical axes at an explicit radian angle measured from horizontal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wavenumberMagnitude, propagationAngleRadians } = request;
  const compute = (): Output => {
    H.domain(wavenumberMagnitude >= 0, "wavenumberMagnitude");
    return {
      horizontalComponent:
        wavenumberMagnitude * Math.cos(propagationAngleRadians),
      verticalComponent:
        wavenumberMagnitude * Math.sin(propagationAngleRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wavenumberMagnitude: 2, propagationAngleRadians: 0 },
  output: { horizontalComponent: 2, verticalComponent: 0 },
} satisfies ToolExample<Input, Output>;
export const acousticGravityWaveWavenumberComponentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["atmospheric-physics", "atmospheric physics", "physics"],
        keywords: ["atmospheric physics", "physics"],
      },
      id: "atmospheric-physics/acoustic-gravity-wave-wavenumber-component",
      title: "Acoustic Gravity Wave Wavenumber Component",
      description:
        "Resolve a supplied wave-number magnitude along horizontal and vertical axes at an explicit radian angle measured from horizontal.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          wavenumberMagnitude: { type: "number", minimum: 0 },
          propagationAngleRadians: { type: "number" },
        },
        required: ["wavenumberMagnitude", "propagationAngleRadians"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          horizontalComponent: { type: "number" },
          verticalComponent: { type: "number" },
        },
        required: ["horizontalComponent", "verticalComponent"],
      },
      ports: {
        inputs: [
          {
            id: "wavenumberMagnitude",
            label: "Wavenumber Magnitude",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "propagationAngleRadians",
            label: "Propagation Angle Radians",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "horizontalComponent",
            label: "Horizontal Component",
            valueType: { type: "number" },
          },
          {
            id: "verticalComponent",
            label: "Vertical Component",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = acousticGravityWaveWavenumberComponentTool.execute;
export default acousticGravityWaveWavenumberComponentTool;
