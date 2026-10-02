import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly style: string; readonly chomping: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    style: { type: "string", maxLength: 8192 },
    chomping: { type: "string", maxLength: 8192 },
  },
  required: ["style", "chomping"],
} as const;
/** Calculate yaml block scalar chomping token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const r = /^([|>])([+-]?)(?![\s\S])/.exec(token);
    H.domain(r !== null);
    return {
      style: r[1] === "|" ? "literal" : "folded",
      chomping: r[2] === "+" ? "keep" : r[2] === "-" ? "strip" : "clip",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "|-" },
  output: { style: "literal", chomping: "strip" },
} satisfies ToolExample<Input, Output>;
export const yamlBlockScalarChompingTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/yaml-block-scalar-chomping-token",
    title: "Yaml Block Scalar Chomping Token Tool",
    description:
      "Calculate yaml block scalar chomping token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        style: { type: "string", maxLength: 8192 },
        chomping: { type: "string", maxLength: 8192 },
      },
      required: ["style", "chomping"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "style", label: "Style", valueType: { type: "string" } },
        { id: "chomping", label: "Chomping", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = yamlBlockScalarChompingTokenTool.execute;
export default yamlBlockScalarChompingTokenTool;
