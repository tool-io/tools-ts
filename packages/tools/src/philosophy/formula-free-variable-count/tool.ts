import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly variableOccurrences: readonly string[];
  readonly boundOccurrences: readonly boolean[];
};
export type Output = {
  readonly freeOccurrenceCount: number;
  readonly distinctFreeVariables: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variableOccurrences: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    boundOccurrences: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["variableOccurrences", "boundOccurrences"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freeOccurrenceCount: { type: "integer" },
    distinctFreeVariables: { type: "integer" },
  },
  required: ["freeOccurrenceCount", "distinctFreeVariables"],
} as const;
/** Count explicitly annotated variable occurrences; binding scope is supplied rather than parsed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { variableOccurrences, boundOccurrences } = request;
  const compute = (): Output => {
    H.sameLength(variableOccurrences, boundOccurrences);
    return {
      freeOccurrenceCount: boundOccurrences.filter((x) => !x).length,
      distinctFreeVariables: new Set(
        variableOccurrences.filter((x, i) => !boundOccurrences[i]),
      ).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    variableOccurrences: ["x", "x", "y"],
    boundOccurrences: [false, true, false],
  },
  output: { freeOccurrenceCount: 2, distinctFreeVariables: 2 },
} satisfies ToolExample<Input, Output>;
export const formulaFreeVariableCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/formula-free-variable-count",
    title: "Formula Free Variable Count Tool",
    description:
      "Count explicitly annotated variable occurrences; binding scope is supplied rather than parsed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        variableOccurrences: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        boundOccurrences: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["variableOccurrences", "boundOccurrences"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        freeOccurrenceCount: { type: "integer" },
        distinctFreeVariables: { type: "integer" },
      },
      required: ["freeOccurrenceCount", "distinctFreeVariables"],
    },
    ports: {
      inputs: [
        {
          id: "variableOccurrences",
          label: "Variable Occurrences",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "boundOccurrences",
          label: "Bound Occurrences",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "freeOccurrenceCount",
          label: "Free Occurrence Count",
          valueType: { type: "integer" },
        },
        {
          id: "distinctFreeVariables",
          label: "Distinct Free Variables",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = formulaFreeVariableCountTool.execute;
export default formulaFreeVariableCountTool;
