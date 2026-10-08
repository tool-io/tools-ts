import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseWeight: number;
  readonly suppliedSelectionFactor: number;
};
export type Output = { readonly adjustedWeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseWeight: { type: "number", minimum: 0 },
    suppliedSelectionFactor: { type: "number", minimum: 0 },
  },
  required: ["baseWeight", "suppliedSelectionFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { adjustedWeight: { type: "number" } },
  required: ["adjustedWeight"],
} as const;
/** Multiply one supplied person weight by an explicit nonnegative migration-selection factor without estimating selection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseWeight, suppliedSelectionFactor } = request;
  const compute = (): Output => {
    H.domain(baseWeight >= 0, "baseWeight");
    H.domain(suppliedSelectionFactor >= 0, "suppliedSelectionFactor");
    return { adjustedWeight: baseWeight * suppliedSelectionFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseWeight: 2, suppliedSelectionFactor: 1.5 },
  output: { adjustedWeight: 3 },
} satisfies ToolExample<Input, Output>;
export const migrationSelectionWeightSinglePersonTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "demographic-economics/migration-selection-weight-single-person",
      title: "Migration Selection Weight Single Person Tool",
      description:
        "Multiply one supplied person weight by an explicit nonnegative migration-selection factor without estimating selection.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baseWeight: { type: "number", minimum: 0 },
          suppliedSelectionFactor: { type: "number", minimum: 0 },
        },
        required: ["baseWeight", "suppliedSelectionFactor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { adjustedWeight: { type: "number" } },
        required: ["adjustedWeight"],
      },
      ports: {
        inputs: [
          {
            id: "baseWeight",
            label: "Base Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedSelectionFactor",
            label: "Supplied Selection Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "adjustedWeight",
            label: "Adjusted Weight",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = migrationSelectionWeightSinglePersonTool.execute;
export default migrationSelectionWeightSinglePersonTool;
