import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lengthMeters: number;
  readonly widthMeters: number;
  readonly heightMeters: number;
};
export type Output = { readonly volumeCubicMeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengthMeters: { type: "number", minimum: 0 },
    widthMeters: { type: "number", minimum: 0 },
    heightMeters: { type: "number", minimum: 0 },
  },
  required: ["lengthMeters", "widthMeters", "heightMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volumeCubicMeters: { type: "number" } },
  required: ["volumeCubicMeters"],
} as const;
/** Compute a rectangular touring case's external shipping volume, including neither stacking voids nor weight. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lengthMeters, widthMeters, heightMeters } = request;
  const compute = (): Output => {
    H.domain(
      lengthMeters >= 0 && widthMeters >= 0 && heightMeters >= 0,
      "lengthMeters",
    );
    return { volumeCubicMeters: lengthMeters * widthMeters * heightMeters };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lengthMeters: 1.2, widthMeters: 0.5, heightMeters: 0.8 },
  output: { volumeCubicMeters: 0.48 },
} satisfies ToolExample<Input, Output>;
export const touringCaseExternalVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/touring-case-external-volume",
    title: "Touring Case External Volume Tool",
    description:
      "Compute a rectangular touring case's external shipping volume, including neither stacking voids nor weight.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lengthMeters: { type: "number", minimum: 0 },
        widthMeters: { type: "number", minimum: 0 },
        heightMeters: { type: "number", minimum: 0 },
      },
      required: ["lengthMeters", "widthMeters", "heightMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volumeCubicMeters: { type: "number" } },
      required: ["volumeCubicMeters"],
    },
    ports: {
      inputs: [
        {
          id: "lengthMeters",
          label: "Length Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "widthMeters",
          label: "Width Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "heightMeters",
          label: "Height Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "volumeCubicMeters",
          label: "Volume Cubic Meters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = touringCaseExternalVolumeTool.execute;
export default touringCaseExternalVolumeTool;
