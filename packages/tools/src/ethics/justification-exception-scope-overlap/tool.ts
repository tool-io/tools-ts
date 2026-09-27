import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requested: readonly string[];
  readonly justifications: readonly string[];
  readonly exceptions: readonly string[];
};
export type Output = {
  readonly justified: readonly string[];
  readonly excepted: readonly string[];
  readonly unresolved: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requested: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    justifications: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    exceptions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requested", "justifications", "exceptions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    justified: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    excepted: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unresolved: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["justified", "excepted", "unresolved"],
} as const;
/** Audit explicit scope-token membership, giving supplied exceptions precedence without interpreting an ethical rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requested, justifications, exceptions } = request;
  const compute = (): Output => {
    const unique = [...new Set(requested)];
    return {
      justified: unique.filter(
        (x) => justifications.includes(x) && !exceptions.includes(x),
      ),
      excepted: unique.filter((x) => exceptions.includes(x)),
      unresolved: unique.filter(
        (x) => !justifications.includes(x) && !exceptions.includes(x),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requested: ["a", "b", "c"],
    justifications: ["a", "b"],
    exceptions: ["b"],
  },
  output: { justified: ["a"], excepted: ["b"], unresolved: ["c"] },
} satisfies ToolExample<Input, Output>;
export const justificationExceptionScopeOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/justification-exception-scope-overlap",
    title: "Justification Exception Scope Overlap Tool",
    description:
      "Audit explicit scope-token membership, giving supplied exceptions precedence without interpreting an ethical rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requested: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        justifications: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        exceptions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requested", "justifications", "exceptions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        justified: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        excepted: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        unresolved: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["justified", "excepted", "unresolved"],
    },
    ports: {
      inputs: [
        {
          id: "requested",
          label: "Requested",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "justifications",
          label: "Justifications",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "exceptions",
          label: "Exceptions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "justified",
          label: "Justified",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "excepted",
          label: "Excepted",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "unresolved",
          label: "Unresolved",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = justificationExceptionScopeOverlapTool.execute;
export default justificationExceptionScopeOverlapTool;
