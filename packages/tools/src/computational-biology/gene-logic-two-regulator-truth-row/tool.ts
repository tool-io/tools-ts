import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRegulator: boolean;
  readonly secondRegulator: boolean;
  readonly operation: string;
};
export type Output = { readonly active: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRegulator: { type: "boolean" },
    secondRegulator: { type: "boolean" },
    operation: { type: "string", maxLength: 8192, enum: ["AND", "OR", "XOR"] },
  },
  required: ["firstRegulator", "secondRegulator", "operation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { active: { type: "boolean" } },
  required: ["active"],
} as const;
/** Evaluate one explicit Boolean AND, OR or XOR gene-regulator truth-table row without inferring biological regulation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstRegulator, secondRegulator, operation } = request;
  const compute = (): Output => {
    H.domain(["AND", "OR", "XOR"].includes(operation), "operation");
    return {
      active:
        operation === "AND"
          ? firstRegulator && secondRegulator
          : operation === "OR"
            ? firstRegulator || secondRegulator
            : firstRegulator !== secondRegulator,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstRegulator: true, secondRegulator: false, operation: "AND" },
  output: { active: false },
} satisfies ToolExample<Input, Output>;
export const geneLogicTwoRegulatorTruthRowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-biology", "computational biology", "biology"],
      keywords: ["computational biology", "biology"],
    },
    id: "computational-biology/gene-logic-two-regulator-truth-row",
    title: "Gene Logic Two Regulator Truth Row",
    description:
      "Evaluate one explicit Boolean AND, OR or XOR gene-regulator truth-table row without inferring biological regulation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRegulator: { type: "boolean" },
        secondRegulator: { type: "boolean" },
        operation: {
          type: "string",
          maxLength: 8192,
          enum: ["AND", "OR", "XOR"],
        },
      },
      required: ["firstRegulator", "secondRegulator", "operation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { active: { type: "boolean" } },
      required: ["active"],
    },
    ports: {
      inputs: [
        {
          id: "firstRegulator",
          label: "First Regulator",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "secondRegulator",
          label: "Second Regulator",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "operation",
          label: "Operation",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "active", label: "Active", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = geneLogicTwoRegulatorTruthRowTool.execute;
export default geneLogicTwoRegulatorTruthRowTool;
