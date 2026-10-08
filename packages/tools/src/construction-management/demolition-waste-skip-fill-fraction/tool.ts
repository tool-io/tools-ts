import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly filledVolume: number;
  readonly skipCapacity: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    filledVolume: { type: "number", minimum: 0 },
    skipCapacity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["filledVolume", "skipCapacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate supplied demolition skip fill fraction and remaining capacity using compatible volumes without safety or waste-classification claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { filledVolume, skipCapacity } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(skipCapacity) && skipCapacity > 0,
      "skipCapacity",
    ),
      skipCapacity);
    H.domain(filledVolume >= 0 && filledVolume <= skipCapacity, "filledVolume");
    return {
      fraction: filledVolume / skipCapacity,
      remainder: skipCapacity - filledVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { filledVolume: 30, skipCapacity: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const demolitionWasteSkipFillFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/demolition-waste-skip-fill-fraction",
    title: "Demolition Waste Skip Fill Fraction",
    description:
      "Calculate supplied demolition skip fill fraction and remaining capacity using compatible volumes without safety or waste-classification claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        filledVolume: { type: "number", minimum: 0 },
        skipCapacity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["filledVolume", "skipCapacity"],
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
          id: "filledVolume",
          label: "Filled Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "skipCapacity",
          label: "Skip Capacity",
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
export const run = demolitionWasteSkipFillFractionTool.execute;
export default demolitionWasteSkipFillFractionTool;
