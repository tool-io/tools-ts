import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowM3PerSecond: number;
  readonly density: number;
  readonly gravity: number;
  readonly height: number;
  readonly efficiency: number;
};
export type Output = {
  readonly hydraulicWatts: number;
  readonly modeledInputWatts: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowM3PerSecond: { type: "number", minimum: 0 },
    density: { type: "number", exclusiveMinimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
    height: { type: "number", minimum: 0 },
    efficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["flowM3PerSecond", "density", "gravity", "height", "efficiency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hydraulicWatts: { type: "number" },
    modeledInputWatts: { type: "number" },
  },
  required: ["hydraulicWatts", "modeledInputWatts"],
} as const;
/** Calculate aquaponic pump head height factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flowM3PerSecond, density, gravity, height, efficiency } = request;
  const compute = (): Output => {
    H.domain(
      flowM3PerSecond >= 0 && height >= 0 && efficiency > 0 && efficiency <= 1,
    );
    H.positive(density);
    H.positive(gravity);
    return {
      hydraulicWatts: flowM3PerSecond * density * gravity * height,
      modeledInputWatts:
        (flowM3PerSecond * density * gravity * height) / efficiency,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    flowM3PerSecond: 0.001,
    density: 1000,
    gravity: 10,
    height: 2,
    efficiency: 0.5,
  },
  output: { hydraulicWatts: 20, modeledInputWatts: 40 },
} satisfies ToolExample<Input, Output>;
export const aquaponicPumpHeadHeightFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/aquaponic-pump-head-height-factor",
    title: "Aquaponic Pump Head Height Factor Tool",
    description:
      "Calculate aquaponic pump head height factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flowM3PerSecond: { type: "number", minimum: 0 },
        density: { type: "number", exclusiveMinimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
        height: { type: "number", minimum: 0 },
        efficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: [
        "flowM3PerSecond",
        "density",
        "gravity",
        "height",
        "efficiency",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hydraulicWatts: { type: "number" },
        modeledInputWatts: { type: "number" },
      },
      required: ["hydraulicWatts", "modeledInputWatts"],
    },
    ports: {
      inputs: [
        {
          id: "flowM3PerSecond",
          label: "Flow M3Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "density",
          label: "Density",
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
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "efficiency",
          label: "Efficiency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "hydraulicWatts",
          label: "Hydraulic Watts",
          valueType: { type: "number" },
        },
        {
          id: "modeledInputWatts",
          label: "Modeled Input Watts",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaponicPumpHeadHeightFactorTool.execute;
export default aquaponicPumpHeadHeightFactorTool;
