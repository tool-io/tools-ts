import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate url form plus space token from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    H.domain(token === "+" || token === "%2B" || token === "%2b");
    return { text: token === "+" ? " " : "+" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "+" },
  output: { text: " " },
} satisfies ToolExample<Input, Output>;
export const urlFormPlusSpaceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/url-form-plus-space-token",
    title: "URL Form Plus Space Token Tool",
    description:
      "Calculate url form plus space token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
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
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = urlFormPlusSpaceTokenTool.execute;
export default urlFormPlusSpaceTokenTool;
