import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLength: number;
  readonly secondLength: number;
  readonly overlapLength: number;
  readonly width: number;
};
export type Output = {
  readonly uniqueLength: number;
  readonly nominalArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLength: { type: "number", minimum: 0 },
    secondLength: { type: "number", minimum: 0 },
    overlapLength: { type: "number", minimum: 0 },
    width: { type: "number", minimum: 0 },
  },
  required: ["firstLength", "secondLength", "overlapLength", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueLength: { type: "number" },
    nominalArea: { type: "number" },
  },
  required: ["uniqueLength", "nominalArea"],
} as const;
/** Nominal supplied constant-width line coverage accounting without manufacturing instructions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLength, secondLength, overlapLength, width } = request;
  const compute = (): Output => {
    H.domain(
      firstLength >= 0 &&
        secondLength >= 0 &&
        overlapLength >= 0 &&
        overlapLength <= Math.min(firstLength, secondLength) &&
        width >= 0,
    );
    return {
      uniqueLength: firstLength + secondLength - overlapLength,
      nominalArea: (firstLength + secondLength - overlapLength) * width,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstLength: 10, secondLength: 8, overlapLength: 2, width: 0.5 },
  output: { uniqueLength: 16, nominalArea: 8 },
} satisfies ToolExample<Input, Output>;
export const extrusionLineOverlapTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/extrusion-line-overlap-term",
    title: "Extrusion Line Overlap Term Tool",
    description:
      "Nominal supplied constant-width line coverage accounting without manufacturing instructions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLength: { type: "number", minimum: 0 },
        secondLength: { type: "number", minimum: 0 },
        overlapLength: { type: "number", minimum: 0 },
        width: { type: "number", minimum: 0 },
      },
      required: ["firstLength", "secondLength", "overlapLength", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueLength: { type: "number" },
        nominalArea: { type: "number" },
      },
      required: ["uniqueLength", "nominalArea"],
    },
    ports: {
      inputs: [
        {
          id: "firstLength",
          label: "First Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondLength",
          label: "Second Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapLength",
          label: "Overlap Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uniqueLength",
          label: "Unique Length",
          valueType: { type: "number" },
        },
        {
          id: "nominalArea",
          label: "Nominal Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = extrusionLineOverlapTermTool.execute;
export default extrusionLineOverlapTermTool;
