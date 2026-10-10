import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly modelWheelbase: number;
  readonly fullSizePerModelScale: number;
};
export type Output = { readonly fullSizeWheelbase: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modelWheelbase: { type: "number", minimum: 0 },
    fullSizePerModelScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["modelWheelbase", "fullSizePerModelScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fullSizeWheelbase: { type: "number" } },
  required: ["fullSizeWheelbase"],
} as const;
/** Scale an explicit museum-model wheelbase by a supplied full-size-per-model factor without identifying a vehicle. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { modelWheelbase, fullSizePerModelScale } = request;
  const compute = (): Output => {
    H.domain(modelWheelbase >= 0, "modelWheelbase");
    (H.domain(
      Number.isFinite(fullSizePerModelScale) && fullSizePerModelScale > 0,
      "fullSizePerModelScale",
    ),
      fullSizePerModelScale);
    return { fullSizeWheelbase: modelWheelbase * fullSizePerModelScale };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { modelWheelbase: 12, fullSizePerModelScale: 35 },
  output: { fullSizeWheelbase: 420 },
} satisfies ToolExample<Input, Output>;
export const museumVehicleWheelbaseScaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["military-science", "military science", "social sciences"],
      keywords: ["military science", "social sciences"],
    },
    id: "military-science/museum-vehicle-wheelbase-scale",
    title: "Museum Vehicle Wheelbase Scale",
    description:
      "Scale an explicit museum-model wheelbase by a supplied full-size-per-model factor without identifying a vehicle.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modelWheelbase: { type: "number", minimum: 0 },
        fullSizePerModelScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["modelWheelbase", "fullSizePerModelScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fullSizeWheelbase: { type: "number" } },
      required: ["fullSizeWheelbase"],
    },
    ports: {
      inputs: [
        {
          id: "modelWheelbase",
          label: "Model Wheelbase",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fullSizePerModelScale",
          label: "Full Size Per Model Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fullSizeWheelbase",
          label: "Full Size Wheelbase",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = museumVehicleWheelbaseScaleTool.execute;
export default museumVehicleWheelbaseScaleTool;
