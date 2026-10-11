import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly candidateVariable: string;
  readonly suppliedFreeVariables: readonly string[];
};
export type Output = { readonly isOnlyFreeVariable: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    candidateVariable: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedFreeVariables: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["candidateVariable", "suppliedFreeVariables"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { isOnlyFreeVariable: { type: "boolean" } },
  required: ["isOnlyFreeVariable"],
} as const;
/** Check an explicitly supplied free-variable list for one unique candidate variable without parsing a logical formula. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { candidateVariable, suppliedFreeVariables } = request;
  const compute = (): Output => {
    H.domain(candidateVariable.length > 0, "candidateVariable");
    return {
      isOnlyFreeVariable:
        suppliedFreeVariables.length > 0 &&
        suppliedFreeVariables.every(
          (variable) => variable === candidateVariable,
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { candidateVariable: "x", suppliedFreeVariables: ["x", "x"] },
  output: { isOnlyFreeVariable: true },
} satisfies ToolExample<Input, Output>;
export const logicalFormulaSingleFreeVariableFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["philosophy"],
        keywords: ["philosophy"],
      },
      id: "philosophy/logical-formula-single-free-variable-flag",
      title: "Logical Formula Single Free Variable Flag",
      description:
        "Check an explicitly supplied free-variable list for one unique candidate variable without parsing a logical formula.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          candidateVariable: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedFreeVariables: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["candidateVariable", "suppliedFreeVariables"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { isOnlyFreeVariable: { type: "boolean" } },
        required: ["isOnlyFreeVariable"],
      },
      ports: {
        inputs: [
          {
            id: "candidateVariable",
            label: "Candidate Variable",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedFreeVariables",
            label: "Supplied Free Variables",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "isOnlyFreeVariable",
            label: "Is Only Free Variable",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = logicalFormulaSingleFreeVariableFlagTool.execute;
export default logicalFormulaSingleFreeVariableFlagTool;
