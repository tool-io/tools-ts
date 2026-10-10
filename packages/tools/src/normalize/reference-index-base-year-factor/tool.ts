import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentValue: number;
  readonly suppliedBaseValue: number;
  readonly indexBase: number;
};
export type Output = { readonly indexValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentValue: { type: "number" },
    suppliedBaseValue: { type: "number" },
    indexBase: { type: "number" },
  },
  required: ["currentValue", "suppliedBaseValue", "indexBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { indexValue: { type: "number" } },
  required: ["indexValue"],
} as const;
/** Rebase an explicit signed current quantity to a supplied nonzero base-period quantity and index base without looking up historical values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentValue, suppliedBaseValue, indexBase } = request;
  const compute = (): Output => {
    H.domain(suppliedBaseValue !== 0, "suppliedBaseValue");
    return { indexValue: (currentValue / suppliedBaseValue) * indexBase };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentValue: 120, suppliedBaseValue: 80, indexBase: 100 },
  output: { indexValue: 150 },
} satisfies ToolExample<Input, Output>;
export const referenceIndexBaseYearFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["normalize", "data normalization", "computer science"],
      keywords: ["data normalization", "computer science"],
    },
    id: "normalize/reference-index-base-year-factor",
    title: "Reference Index Base Year Factor",
    description:
      "Rebase an explicit signed current quantity to a supplied nonzero base-period quantity and index base without looking up historical values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentValue: { type: "number" },
        suppliedBaseValue: { type: "number" },
        indexBase: { type: "number" },
      },
      required: ["currentValue", "suppliedBaseValue", "indexBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { indexValue: { type: "number" } },
      required: ["indexValue"],
    },
    ports: {
      inputs: [
        {
          id: "currentValue",
          label: "Current Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBaseValue",
          label: "Supplied Base Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "indexBase",
          label: "Index Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "indexValue",
          label: "Index Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = referenceIndexBaseYearFactorTool.execute;
export default referenceIndexBaseYearFactorTool;
