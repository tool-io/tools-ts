import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly dropletDensity: number;
  readonly airDensity: number;
  readonly gravity: number;
  readonly dynamicViscosity: number;
};
export type Output = {
  readonly stokesSpeed: number;
  readonly reynolds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", minimum: 0 },
    dropletDensity: { type: "number" },
    airDensity: { type: "number", minimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
    dynamicViscosity: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "radius",
    "dropletDensity",
    "airDensity",
    "gravity",
    "dynamicViscosity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { stokesSpeed: { type: "number" }, reynolds: { type: "number" } },
  required: ["stokesSpeed", "reynolds"],
} as const;
/** Stokes creeping-flow terminal-speed estimate and its diameter-based Reynolds number; caller must establish regime validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, dropletDensity, airDensity, gravity, dynamicViscosity } =
    request;
  const compute = (): Output => {
    H.domain(radius >= 0 && dropletDensity >= airDensity && airDensity >= 0);
    H.positive(gravity);
    H.positive(dynamicViscosity);
    return {
      stokesSpeed:
        (2 * (dropletDensity - airDensity) * gravity * radius ** 2) /
        (9 * dynamicViscosity),
      reynolds:
        (4 *
          airDensity *
          Math.abs(dropletDensity - airDensity) *
          gravity *
          radius ** 3) /
        (9 * dynamicViscosity ** 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    radius: 0.01,
    dropletDensity: 1000,
    airDensity: 1,
    gravity: 10,
    dynamicViscosity: 1,
  },
  output: { stokesSpeed: 0.222, reynolds: 0.004440000000000001 },
} satisfies ToolExample<Input, Output>;
export const cloudDropletTerminalDragRegimeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/cloud-droplet-terminal-drag-regime-term",
    title: "Cloud Droplet Terminal Drag Regime Term Tool",
    description:
      "Stokes creeping-flow terminal-speed estimate and its diameter-based Reynolds number; caller must establish regime validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", minimum: 0 },
        dropletDensity: { type: "number" },
        airDensity: { type: "number", minimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
        dynamicViscosity: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "radius",
        "dropletDensity",
        "airDensity",
        "gravity",
        "dynamicViscosity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stokesSpeed: { type: "number" },
        reynolds: { type: "number" },
      },
      required: ["stokesSpeed", "reynolds"],
    },
    ports: {
      inputs: [
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dropletDensity",
          label: "Droplet Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "airDensity",
          label: "Air Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gravity",
          label: "Gravity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dynamicViscosity",
          label: "Dynamic Viscosity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "stokesSpeed",
          label: "Stokes Speed",
          valueType: { type: "number" },
        },
        { id: "reynolds", label: "Reynolds", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cloudDropletTerminalDragRegimeTermTool.execute;
export default cloudDropletTerminalDragRegimeTermTool;
