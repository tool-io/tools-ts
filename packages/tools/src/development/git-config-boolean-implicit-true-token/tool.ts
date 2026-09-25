import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: string; readonly hasEquals: boolean };
export type Output = { readonly value: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "string", maxLength: 8192 },
    hasEquals: { type: "boolean" },
  },
  required: ["value", "hasEquals"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "boolean" } },
  required: ["value"],
} as const;
/** Calculate git config boolean implicit true token from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { value, hasEquals } = input;
  const compute = (): Output => {
    if (!hasEquals) {
      H.domain(value === "");
      return { value: true };
    }
    const v = value.toLowerCase();
    H.domain(
      ["", "true", "yes", "on", "1", "false", "no", "off", "0"].includes(v),
    );
    return { value: ["true", "yes", "on", "1"].includes(v) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: "", hasEquals: false },
  output: { value: true },
} satisfies ToolExample<Input, Output>;
export const gitConfigBooleanImplicitTrueTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/git-config-boolean-implicit-true-token",
    title: "Git Config Boolean Implicit True Token Tool",
    description:
      "Calculate git config boolean implicit true token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "string", maxLength: 8192 },
        hasEquals: { type: "boolean" },
      },
      required: ["value", "hasEquals"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "boolean" } },
      required: ["value"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "hasEquals",
          label: "Has Equals",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "value", label: "Value", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = gitConfigBooleanImplicitTrueTokenTool.execute;
export default gitConfigBooleanImplicitTrueTokenTool;
