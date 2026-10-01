import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly horizontal: number;
  readonly vertical: number;
  readonly horizontalPositiveTemporal: boolean;
  readonly verticalPositiveSuperior: boolean;
};
export type Output = { readonly temporal: number; readonly superior: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontal: { type: "number" },
    vertical: { type: "number" },
    horizontalPositiveTemporal: { type: "boolean" },
    verticalPositiveSuperior: { type: "boolean" },
  },
  required: [
    "horizontal",
    "vertical",
    "horizontalPositiveTemporal",
    "verticalPositiveSuperior",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { temporal: { type: "number" }, superior: { type: "number" } },
  required: ["temporal", "superior"],
} as const;
/** Relabel supplied axis components under explicit orientation signs without inferring eye laterality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    horizontal,
    vertical,
    horizontalPositiveTemporal,
    verticalPositiveSuperior,
  } = request;
  const compute = (): Output => {
    return {
      temporal: horizontal * (horizontalPositiveTemporal ? 1 : -1),
      superior: vertical * (verticalPositiveSuperior ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    horizontal: 2,
    vertical: -3,
    horizontalPositiveTemporal: false,
    verticalPositiveSuperior: true,
  },
  output: { temporal: -2, superior: -3 },
} satisfies ToolExample<Input, Output>;
export const ocularAxisOrientationSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ophthalmology/ocular-axis-orientation-sign",
    title: "Ocular Axis Orientation Sign Tool",
    description:
      "Relabel supplied axis components under explicit orientation signs without inferring eye laterality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontal: { type: "number" },
        vertical: { type: "number" },
        horizontalPositiveTemporal: { type: "boolean" },
        verticalPositiveSuperior: { type: "boolean" },
      },
      required: [
        "horizontal",
        "vertical",
        "horizontalPositiveTemporal",
        "verticalPositiveSuperior",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        temporal: { type: "number" },
        superior: { type: "number" },
      },
      required: ["temporal", "superior"],
    },
    ports: {
      inputs: [
        {
          id: "horizontal",
          label: "Horizontal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "vertical",
          label: "Vertical",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "horizontalPositiveTemporal",
          label: "Horizontal Positive Temporal",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "verticalPositiveSuperior",
          label: "Vertical Positive Superior",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "temporal", label: "Temporal", valueType: { type: "number" } },
        { id: "superior", label: "Superior", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ocularAxisOrientationSignTool.execute;
export default ocularAxisOrientationSignTool;
