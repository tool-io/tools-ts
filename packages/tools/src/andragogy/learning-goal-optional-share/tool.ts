import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly required: number;
  readonly optional: number;
  readonly selectedOptional: number;
};
export type Output = {
  readonly selectedTotal: number;
  readonly optionalShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    required: { type: "integer", minimum: 0 },
    optional: { type: "integer", minimum: 0 },
    selectedOptional: { type: "integer", minimum: 0 },
  },
  required: ["required", "optional", "selectedOptional"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectedTotal: { type: "integer" },
    optionalShare: { type: "number" },
  },
  required: ["selectedTotal", "optionalShare"],
} as const;
/** Calculate learning goal optional share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { required, optional, selectedOptional } = request;
  const compute = (): Output => {
    H.integer(required, 0);
    H.integer(optional, 0);
    H.integer(selectedOptional, 0, optional);
    H.domain(required + selectedOptional > 0);
    return {
      selectedTotal: required + selectedOptional,
      optionalShare: selectedOptional / (required + selectedOptional),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { required: 4, optional: 6, selectedOptional: 2 },
  output: { selectedTotal: 6, optionalShare: 0.3333333333333333 },
} satisfies ToolExample<Input, Output>;
export const learningGoalOptionalShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "andragogy/learning-goal-optional-share",
    title: "Learning Goal Optional Share Tool",
    description:
      "Calculate learning goal optional share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        required: { type: "integer", minimum: 0 },
        optional: { type: "integer", minimum: 0 },
        selectedOptional: { type: "integer", minimum: 0 },
      },
      required: ["required", "optional", "selectedOptional"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selectedTotal: { type: "integer" },
        optionalShare: { type: "number" },
      },
      required: ["selectedTotal", "optionalShare"],
    },
    ports: {
      inputs: [
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "optional",
          label: "Optional",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "selectedOptional",
          label: "Selected Optional",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "selectedTotal",
          label: "Selected Total",
          valueType: { type: "integer" },
        },
        {
          id: "optionalShare",
          label: "Optional Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = learningGoalOptionalShareTool.execute;
export default learningGoalOptionalShareTool;
