import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly variable: string;
  readonly bindingScopeId: string;
  readonly occurrenceScopeIds: readonly string[];
};
export type Output = { readonly boundInRecordedScope: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variable: { type: "string", maxLength: 8192 },
    bindingScopeId: { type: "string", maxLength: 8192 },
    occurrenceScopeIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["variable", "bindingScopeId", "occurrenceScopeIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { boundInRecordedScope: { type: "boolean" } },
  required: ["boundInRecordedScope"],
} as const;
/** Check whether an occurrence's supplied enclosing scope path contains the recorded binder scope; no logical expression parsing or shadowing resolution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { variable, bindingScopeId, occurrenceScopeIds } = request;
  const compute = (): Output => {
    H.domain(variable.length > 0 && bindingScopeId.length > 0, "variable");
    return {
      boundInRecordedScope: occurrenceScopeIds.includes(bindingScopeId),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    variable: "x",
    bindingScopeId: "S1",
    occurrenceScopeIds: ["S0", "S1"],
  },
  output: { boundInRecordedScope: true },
} satisfies ToolExample<Input, Output>;
export const boundVariableOccurrenceScopeTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/bound-variable-occurrence-scope-tag",
    title: "Bound Variable Occurrence Scope Tag Tool",
    description:
      "Check whether an occurrence's supplied enclosing scope path contains the recorded binder scope; no logical expression parsing or shadowing resolution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        variable: { type: "string", maxLength: 8192 },
        bindingScopeId: { type: "string", maxLength: 8192 },
        occurrenceScopeIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["variable", "bindingScopeId", "occurrenceScopeIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { boundInRecordedScope: { type: "boolean" } },
      required: ["boundInRecordedScope"],
    },
    ports: {
      inputs: [
        {
          id: "variable",
          label: "Variable",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "bindingScopeId",
          label: "Binding Scope Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "occurrenceScopeIds",
          label: "Occurrence Scope Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "boundInRecordedScope",
          label: "Bound In Recorded Scope",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = boundVariableOccurrenceScopeTagTool.execute;
export default boundVariableOccurrenceScopeTagTool;
