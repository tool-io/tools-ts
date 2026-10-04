import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly selected: readonly boolean[];
  readonly requiredExactly: number;
};
export type Output = {
  readonly selectedCount: number;
  readonly valid: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selected: { type: "array", maxItems: 256, items: { type: "boolean" } },
    requiredExactly: { type: "integer", minimum: 0 },
  },
  required: ["selected", "requiredExactly"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectedCount: { type: "integer" },
    valid: { type: "boolean" },
  },
  required: ["selectedCount", "valid"],
} as const;
/** Calculate exclusive choice cardinality from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { selected, requiredExactly } = request;
  const compute = (): Output => {
    H.integer(requiredExactly, 0);
    return {
      selectedCount: selected.filter(Boolean).length,
      valid: selected.filter(Boolean).length === requiredExactly,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { selected: [true, false, true], requiredExactly: 1 },
  output: { selectedCount: 2, valid: false },
} satisfies ToolExample<Input, Output>;
export const exclusiveChoiceCardinalityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/exclusive-choice-cardinality",
    title: "Exclusive Choice Cardinality Tool",
    description:
      "Calculate exclusive choice cardinality from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selected: { type: "array", maxItems: 256, items: { type: "boolean" } },
        requiredExactly: { type: "integer", minimum: 0 },
      },
      required: ["selected", "requiredExactly"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selectedCount: { type: "integer" },
        valid: { type: "boolean" },
      },
      required: ["selectedCount", "valid"],
    },
    ports: {
      inputs: [
        {
          id: "selected",
          label: "Selected",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "requiredExactly",
          label: "Required Exactly",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "selectedCount",
          label: "Selected Count",
          valueType: { type: "integer" },
        },
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = exclusiveChoiceCardinalityTool.execute;
export default exclusiveChoiceCardinalityTool;
