import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly space: boolean };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { space: { type: "boolean" } },
  required: ["space"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Calculate form urlencoded space plus token from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { space } = input;
  const compute = (): Output => {
    return { token: space ? "+" : "%2B" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { space: true },
  output: { token: "+" },
} satisfies ToolExample<Input, Output>;
export const formUrlencodedSpacePlusTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/form-urlencoded-space-plus-token",
    title: "Form Urlencoded Space Plus Token Tool",
    description:
      "Calculate form urlencoded space plus token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { space: { type: "boolean" } },
      required: ["space"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "space",
          label: "Space",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = formUrlencodedSpacePlusTokenTool.execute;
export default formUrlencodedSpacePlusTokenTool;
