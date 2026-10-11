import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetThickness: number;
  readonly dryThickness: number;
};
export type Output = {
  readonly retainedThicknessFraction: number;
  readonly thicknessReduction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetThickness: { type: "number", exclusiveMinimum: 0 },
    dryThickness: { type: "number", minimum: 0 },
  },
  required: ["wetThickness", "dryThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedThicknessFraction: { type: "number" },
    thicknessReduction: { type: "number" },
  },
  required: ["retainedThicknessFraction", "thicknessReduction"],
} as const;
/** Compare explicit wet and dry drawdown thicknesses without inferring binder properties or pigment composition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetThickness, dryThickness } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(wetThickness) && wetThickness > 0,
      "wetThickness",
    ),
      wetThickness);
    H.domain(dryThickness >= 0, "dryThickness");
    return {
      retainedThicknessFraction: dryThickness / wetThickness,
      thicknessReduction: wetThickness - dryThickness,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetThickness: 100, dryThickness: 60 },
  output: { retainedThicknessFraction: 0.6, thicknessReduction: 40 },
} satisfies ToolExample<Input, Output>;
export const pigmentTestDrawdownWetDryThicknessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["visual-arts", "visual arts", "arts and design"],
      keywords: ["visual arts", "arts and design"],
    },
    id: "visual-arts/pigment-test-drawdown-wet-dry-thickness",
    title: "Pigment Test Drawdown Wet Dry Thickness",
    description:
      "Compare explicit wet and dry drawdown thicknesses without inferring binder properties or pigment composition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetThickness: { type: "number", exclusiveMinimum: 0 },
        dryThickness: { type: "number", minimum: 0 },
      },
      required: ["wetThickness", "dryThickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedThicknessFraction: { type: "number" },
        thicknessReduction: { type: "number" },
      },
      required: ["retainedThicknessFraction", "thicknessReduction"],
    },
    ports: {
      inputs: [
        {
          id: "wetThickness",
          label: "Wet Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryThickness",
          label: "Dry Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "retainedThicknessFraction",
          label: "Retained Thickness Fraction",
          valueType: { type: "number" },
        },
        {
          id: "thicknessReduction",
          label: "Thickness Reduction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pigmentTestDrawdownWetDryThicknessTool.execute;
export default pigmentTestDrawdownWetDryThicknessTool;
