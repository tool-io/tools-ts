import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly gap: number; readonly inputUnit: string };
export type Output = {
  readonly micrometers: number;
  readonly millimeters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gap: { type: "number", minimum: 0 },
    inputUnit: { type: "string", maxLength: 8192, enum: ["um", "mm"] },
  },
  required: ["gap", "inputUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    micrometers: { type: "number" },
    millimeters: { type: "number" },
  },
  required: ["micrometers", "millimeters"],
} as const;
/** Convert an explicitly measured crown-margin gap between micrometers and millimeters without assessing fit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gap, inputUnit } = request;
  const compute = (): Output => {
    H.domain(gap >= 0, "gap");
    H.domain(["um", "mm"].includes(inputUnit), "inputUnit");
    return {
      micrometers: inputUnit === "mm" ? gap * 1000 : gap,
      millimeters: inputUnit === "um" ? gap / 1000 : gap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gap: 80, inputUnit: "um" },
  output: { micrometers: 80, millimeters: 0.08 },
} satisfies ToolExample<Input, Output>;
export const crownMarginGapUnitTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["prosthodontics", "health and medicine"],
      keywords: ["prosthodontics", "health and medicine"],
    },
    id: "prosthodontics/crown-margin-gap-unit",
    title: "Crown Margin Gap Unit",
    description:
      "Convert an explicitly measured crown-margin gap between micrometers and millimeters without assessing fit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gap: { type: "number", minimum: 0 },
        inputUnit: { type: "string", maxLength: 8192, enum: ["um", "mm"] },
      },
      required: ["gap", "inputUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        micrometers: { type: "number" },
        millimeters: { type: "number" },
      },
      required: ["micrometers", "millimeters"],
    },
    ports: {
      inputs: [
        {
          id: "gap",
          label: "Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputUnit",
          label: "Input Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "micrometers",
          label: "Micrometers",
          valueType: { type: "number" },
        },
        {
          id: "millimeters",
          label: "Millimeters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = crownMarginGapUnitTool.execute;
export default crownMarginGapUnitTool;
