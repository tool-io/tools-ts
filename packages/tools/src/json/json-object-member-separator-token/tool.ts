import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly memberCount: number; readonly pretty: boolean };
export type Output = { readonly commas: number; readonly separator: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    memberCount: { type: "integer", minimum: 0 },
    pretty: { type: "boolean" },
  },
  required: ["memberCount", "pretty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commas: { type: "integer" },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["commas", "separator"],
} as const;
/** Calculate json object member separator token from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { memberCount, pretty } = input;
  const compute = (): Output => {
    H.integer(memberCount, 0);
    return {
      commas: Math.max(0, memberCount - 1),
      separator: pretty ? ", " : ",",
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { memberCount: 3, pretty: true },
  output: { commas: 2, separator: ", " },
} satisfies ToolExample<Input, Output>;
export const jsonObjectMemberSeparatorTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-object-member-separator-token",
    title: "JSON Object Member Separator Token Tool",
    description:
      "Calculate json object member separator token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        memberCount: { type: "integer", minimum: 0 },
        pretty: { type: "boolean" },
      },
      required: ["memberCount", "pretty"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commas: { type: "integer" },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["commas", "separator"],
    },
    ports: {
      inputs: [
        {
          id: "memberCount",
          label: "Member Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pretty",
          label: "Pretty",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "commas", label: "Commas", valueType: { type: "integer" } },
        { id: "separator", label: "Separator", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = jsonObjectMemberSeparatorTokenTool.execute;
export default jsonObjectMemberSeparatorTokenTool;
