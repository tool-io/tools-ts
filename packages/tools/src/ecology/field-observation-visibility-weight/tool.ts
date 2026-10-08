import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedValue: number;
  readonly suppliedVisibilityWeight: number;
};
export type Output = { readonly weightedContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedValue: { type: "number" },
    suppliedVisibilityWeight: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["observedValue", "suppliedVisibilityWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedContribution: { type: "number" } },
  required: ["weightedContribution"],
} as const;
/** Apply an explicitly supplied visibility weight without estimating detection probability or inverse-probability correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedValue, suppliedVisibilityWeight } = request;
  const compute = (): Output => {
    (H.domain(
      suppliedVisibilityWeight >= 0 && suppliedVisibilityWeight <= 1,
      "suppliedVisibilityWeight",
    ),
      suppliedVisibilityWeight);
    return { weightedContribution: observedValue * suppliedVisibilityWeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedValue: 20, suppliedVisibilityWeight: 0.75 },
  output: { weightedContribution: 15 },
} satisfies ToolExample<Input, Output>;
export const fieldObservationVisibilityWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["ecology", "biology"],
      keywords: ["ecology", "biology"],
    },
    id: "ecology/field-observation-visibility-weight",
    title: "Field Observation Visibility Weight",
    description:
      "Apply an explicitly supplied visibility weight without estimating detection probability or inverse-probability correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedValue: { type: "number" },
        suppliedVisibilityWeight: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["observedValue", "suppliedVisibilityWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weightedContribution: { type: "number" } },
      required: ["weightedContribution"],
    },
    ports: {
      inputs: [
        {
          id: "observedValue",
          label: "Observed Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedVisibilityWeight",
          label: "Supplied Visibility Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedContribution",
          label: "Weighted Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fieldObservationVisibilityWeightTool.execute;
export default fieldObservationVisibilityWeightTool;
