import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedCompostVolume: number;
  readonly bayCapacity: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedCompostVolume: { type: "number", minimum: 0 },
    bayCapacity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recordedCompostVolume", "bayCapacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize an explicit compost volume to supplied bay capacity without assessing composting conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedCompostVolume, bayCapacity } = request;
  const compute = (): Output => {
    (H.domain(bayCapacity > 0, "bayCapacity"), bayCapacity);
    H.domain(
      recordedCompostVolume >= 0 && recordedCompostVolume <= bayCapacity,
      "recordedCompostVolume",
    );
    return {
      fraction: recordedCompostVolume / bayCapacity,
      remainder: bayCapacity - recordedCompostVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedCompostVolume: 30, bayCapacity: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const gardenCompostBayFillFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["urban-agriculture", "urban agriculture", "agriculture"],
      keywords: ["urban agriculture", "agriculture"],
    },
    id: "urban-agriculture/garden-compost-bay-fill-fraction",
    title: "Garden Compost Bay Fill Fraction",
    description:
      "Normalize an explicit compost volume to supplied bay capacity without assessing composting conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedCompostVolume: { type: "number", minimum: 0 },
        bayCapacity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recordedCompostVolume", "bayCapacity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "recordedCompostVolume",
          label: "Recorded Compost Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bayCapacity",
          label: "Bay Capacity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gardenCompostBayFillFractionTool.execute;
export default gardenCompostBayFillFractionTool;
