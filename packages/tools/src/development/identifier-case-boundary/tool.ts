import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly identifier: string };
export type Output = { readonly boundaries: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { identifier: { type: "string", maxLength: 8192 } },
  required: ["identifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boundaries: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["boundaries"],
} as const;
/** Find ASCII camel-case and acronym-to-word boundaries as UTF-16 offsets without changing the identifier. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifier } = request;
  const compute = (): Output => {
    const boundaries: number[] = [];
    for (let i = 1; i < identifier.length; i++)
      if (
        (/[a-z0-9]/.test(identifier[i - 1]) && /[A-Z]/.test(identifier[i])) ||
        (/[A-Z]/.test(identifier[i - 1]) &&
          /[A-Z]/.test(identifier[i]) &&
          i + 1 < identifier.length &&
          /[a-z]/.test(identifier[i + 1]))
      )
        boundaries.push(i);
    return { boundaries };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { identifier: "parseHTTPValue" },
  output: { boundaries: [5, 9] },
} satisfies ToolExample<Input, Output>;
export const identifierCaseBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/identifier-case-boundary",
    title: "Identifier Case Boundary Tool",
    description:
      "Find ASCII camel-case and acronym-to-word boundaries as UTF-16 offsets without changing the identifier.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { identifier: { type: "string", maxLength: 8192 } },
      required: ["identifier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        boundaries: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["boundaries"],
    },
    ports: {
      inputs: [
        {
          id: "identifier",
          label: "Identifier",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "boundaries",
          label: "Boundaries",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = identifierCaseBoundaryTool.execute;
export default identifierCaseBoundaryTool;
