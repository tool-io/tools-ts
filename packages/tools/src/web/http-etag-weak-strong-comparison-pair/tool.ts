import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: string; readonly second: string };
export type Output = {
  readonly weakEqual: boolean;
  readonly strongEqual: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "string", maxLength: 8192 },
    second: { type: "string", maxLength: 8192 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weakEqual: { type: "boolean" },
    strongEqual: { type: "boolean" },
  },
  required: ["weakEqual", "strongEqual"],
} as const;
/** Calculate http etag weak strong comparison pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    const valid = (s: string) =>
      /^(?:W\/)?\x22[\x21\x23-\x7e\x80-\xff]*\x22(?![\s\S])/.test(s);
    H.domain(valid(first) && valid(second));
    const weakEqual = first.replace(/^W\//, "") === second.replace(/^W\//, "");
    return {
      weakEqual,
      strongEqual:
        weakEqual && !first.startsWith("W/") && !second.startsWith("W/"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 'W/"abc"', second: '"abc"' },
  output: { weakEqual: true, strongEqual: false },
} satisfies ToolExample<Input, Output>;
export const httpEtagWeakStrongComparisonPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/http-etag-weak-strong-comparison-pair",
    title: "HTTP Etag Weak Strong Comparison Pair Tool",
    description:
      "Calculate http etag weak strong comparison pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "string", maxLength: 8192 },
        second: { type: "string", maxLength: 8192 },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weakEqual: { type: "boolean" },
        strongEqual: { type: "boolean" },
      },
      required: ["weakEqual", "strongEqual"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "weakEqual",
          label: "Weak Equal",
          valueType: { type: "boolean" },
        },
        {
          id: "strongEqual",
          label: "Strong Equal",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = httpEtagWeakStrongComparisonPairTool.execute;
export default httpEtagWeakStrongComparisonPairTool;
