import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly boundVariables: readonly string[] };
export type Output = {
  readonly shadowingBinders: number;
  readonly distinctVariables: number;
  readonly deepestRepeatIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boundVariables: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["boundVariables"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shadowingBinders: { type: "integer" },
    distinctVariables: { type: "integer" },
    deepestRepeatIndex: { type: "integer" },
  },
  required: ["shadowingBinders", "distinctVariables", "deepestRepeatIndex"],
} as const;
/** Count shadowing in an explicitly ordered nested binder path, without parsing formulas or proving equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { boundVariables } = request;
  const compute = (): Output => {
    const seen = new Set<string>();
    let shadowingBinders = 0,
      deepestRepeatIndex = -1;
    boundVariables.forEach((x, i) => {
      if (seen.has(x)) {
        shadowingBinders++;
        deepestRepeatIndex = i;
      }
      seen.add(x);
    });
    return {
      shadowingBinders,
      distinctVariables: seen.size,
      deepestRepeatIndex,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { boundVariables: ["x", "y", "x"] },
  output: { shadowingBinders: 1, distinctVariables: 2, deepestRepeatIndex: 2 },
} satisfies ToolExample<Input, Output>;
export const quantifierBoundVariableShadowCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/quantifier-bound-variable-shadow-count",
    title: "Quantifier Bound Variable Shadow Count Tool",
    description:
      "Count shadowing in an explicitly ordered nested binder path, without parsing formulas or proving equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        boundVariables: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["boundVariables"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shadowingBinders: { type: "integer" },
        distinctVariables: { type: "integer" },
        deepestRepeatIndex: { type: "integer" },
      },
      required: ["shadowingBinders", "distinctVariables", "deepestRepeatIndex"],
    },
    ports: {
      inputs: [
        {
          id: "boundVariables",
          label: "Bound Variables",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "shadowingBinders",
          label: "Shadowing Binders",
          valueType: { type: "integer" },
        },
        {
          id: "distinctVariables",
          label: "Distinct Variables",
          valueType: { type: "integer" },
        },
        {
          id: "deepestRepeatIndex",
          label: "Deepest Repeat Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = quantifierBoundVariableShadowCountTool.execute;
export default quantifierBoundVariableShadowCountTool;
