import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacityLiters: number;
  readonly fillFraction: number;
};
export type Output = {
  readonly filledLiters: number;
  readonly unfilledLiters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacityLiters: { type: "number", minimum: 0 },
    fillFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["capacityLiters", "fillFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    filledLiters: { type: "number" },
    unfilledLiters: { type: "number" },
  },
  required: ["filledLiters", "unfilledLiters"],
} as const;
/** Apply an explicit fill fraction to grow-bag capacity without selecting substrate or plant requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacityLiters, fillFraction } = request;
  const compute = (): Output => {
    H.domain(capacityLiters >= 0, "capacityLiters");
    (H.domain(fillFraction >= 0 && fillFraction <= 1, "fillFraction"),
      fillFraction);
    return {
      filledLiters: capacityLiters * fillFraction,
      unfilledLiters: capacityLiters * (1 - fillFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capacityLiters: 40, fillFraction: 0.75 },
  output: { filledLiters: 30, unfilledLiters: 10 },
} satisfies ToolExample<Input, Output>;
export const growBagFillVolumeTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["urban-agriculture", "urban agriculture", "agriculture"],
      keywords: ["urban agriculture", "agriculture"],
    },
    id: "urban-agriculture/grow-bag-fill-volume",
    title: "Grow Bag Fill Volume",
    description:
      "Apply an explicit fill fraction to grow-bag capacity without selecting substrate or plant requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacityLiters: { type: "number", minimum: 0 },
        fillFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["capacityLiters", "fillFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        filledLiters: { type: "number" },
        unfilledLiters: { type: "number" },
      },
      required: ["filledLiters", "unfilledLiters"],
    },
    ports: {
      inputs: [
        {
          id: "capacityLiters",
          label: "Capacity Liters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fillFraction",
          label: "Fill Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "filledLiters",
          label: "Filled Liters",
          valueType: { type: "number" },
        },
        {
          id: "unfilledLiters",
          label: "Unfilled Liters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = growBagFillVolumeTool.execute;
export default growBagFillVolumeTool;
