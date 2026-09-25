import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly levels: number;
  readonly dropReference: boolean;
  readonly includeUnknown: boolean;
};
export type Output = { readonly columns: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    levels: { type: "integer", minimum: 1 },
    dropReference: { type: "boolean" },
    includeUnknown: { type: "boolean" },
  },
  required: ["levels", "dropReference", "includeUnknown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { columns: { type: "integer" } },
  required: ["columns"],
} as const;
/** Calculate onehot reference level output budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { levels, dropReference, includeUnknown } = request;
  const compute = (): Output => {
    H.integer(levels, 1);
    return {
      columns: levels - (dropReference ? 1 : 0) + (includeUnknown ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { levels: 5, dropReference: true, includeUnknown: true },
  output: { columns: 5 },
} satisfies ToolExample<Input, Output>;
export const onehotReferenceLevelOutputBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/onehot-reference-level-output-budget",
    title: "Onehot Reference Level Output Budget Tool",
    description:
      "Calculate onehot reference level output budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        levels: { type: "integer", minimum: 1 },
        dropReference: { type: "boolean" },
        includeUnknown: { type: "boolean" },
      },
      required: ["levels", "dropReference", "includeUnknown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { columns: { type: "integer" } },
      required: ["columns"],
    },
    ports: {
      inputs: [
        {
          id: "levels",
          label: "Levels",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dropReference",
          label: "Drop Reference",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeUnknown",
          label: "Include Unknown",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "columns", label: "Columns", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = onehotReferenceLevelOutputBudgetTool.execute;
export default onehotReferenceLevelOutputBudgetTool;
