import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: string };
export type Output = { readonly wildcard: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "string", maxLength: 8192 } },
  required: ["value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wildcard: { type: "boolean" } },
  required: ["wildcard"],
} as const;
/** Calculate http if none match wildcard token from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { value } = input;
  const compute = (): Output => {
    return { wildcard: value.trim() === "*" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: " * " },
  output: { wildcard: true },
} satisfies ToolExample<Input, Output>;
export const httpIfNoneMatchWildcardTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/http-if-none-match-wildcard-token",
    title: "HTTP If None Match Wildcard Token Tool",
    description:
      "Calculate http if none match wildcard token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "string", maxLength: 8192 } },
      required: ["value"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { wildcard: { type: "boolean" } },
      required: ["wildcard"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "wildcard", label: "Wildcard", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = httpIfNoneMatchWildcardTokenTool.execute;
export default httpIfNoneMatchWildcardTokenTool;
