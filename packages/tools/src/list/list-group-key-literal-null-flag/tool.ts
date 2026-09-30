import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly keyJson: string };
export type Output = {
  readonly literalNull: boolean;
  readonly stringNull: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { keyJson: { type: "string", maxLength: 8192 } },
  required: ["keyJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    literalNull: { type: "boolean" },
    stringNull: { type: "boolean" },
  },
  required: ["literalNull", "stringNull"],
} as const;
/** Calculate list group key literal null flag from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { keyJson } = input;
  const compute = (): Output => {
    const key = H.parseJson(keyJson);
    return { literalNull: key === null, stringNull: key === "null" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { keyJson: "null" },
  output: { literalNull: true, stringNull: false },
} satisfies ToolExample<Input, Output>;
export const listGroupKeyLiteralNullFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-group-key-literal-null-flag",
    title: "List Group Key Literal Null Flag Tool",
    description:
      "Calculate list group key literal null flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { keyJson: { type: "string", maxLength: 8192 } },
      required: ["keyJson"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        literalNull: { type: "boolean" },
        stringNull: { type: "boolean" },
      },
      required: ["literalNull", "stringNull"],
    },
    ports: {
      inputs: [
        {
          id: "keyJson",
          label: "Key Json",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "literalNull",
          label: "Literal Null",
          valueType: { type: "boolean" },
        },
        {
          id: "stringNull",
          label: "String Null",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = listGroupKeyLiteralNullFlagTool.execute;
export default listGroupKeyLiteralNullFlagTool;
