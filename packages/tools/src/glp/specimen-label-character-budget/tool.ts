import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { utf8Encode } from "../../core/encoding.js";
export type Input = {
  readonly label: string;
  readonly suppliedLimit: number;
  readonly useUtf8Bytes: boolean;
};
export type Output = {
  readonly used: number;
  readonly remaining: number;
  readonly exceeds: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    suppliedLimit: { type: "integer", minimum: 0 },
    useUtf8Bytes: { type: "boolean" },
  },
  required: ["label", "suppliedLimit", "useUtf8Bytes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    used: { type: "integer" },
    remaining: { type: "integer" },
    exceeds: { type: "boolean" },
  },
  required: ["used", "remaining", "exceeds"],
} as const;
/** Count supplied label code points or portable UTF-8 bytes against an explicit budget; UTF-8 replaces isolated surrogates with U+FFFD. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { label, suppliedLimit, useUtf8Bytes } = request;
  const compute = (): Output => {
    H.integer(suppliedLimit, 0);
    const used = useUtf8Bytes ? utf8Encode(label).length : [...label].length;
    return {
      used,
      remaining: suppliedLimit - used,
      exceeds: used > suppliedLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { label: "Aé", suppliedLimit: 3, useUtf8Bytes: true },
  output: { used: 3, remaining: 0, exceeds: false },
} satisfies ToolExample<Input, Output>;
export const specimenLabelCharacterBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/specimen-label-character-budget",
    title: "Specimen Label Character Budget Tool",
    description:
      "Count supplied label code points or portable UTF-8 bytes against an explicit budget; UTF-8 replaces isolated surrogates with U+FFFD.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        suppliedLimit: { type: "integer", minimum: 0 },
        useUtf8Bytes: { type: "boolean" },
      },
      required: ["label", "suppliedLimit", "useUtf8Bytes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        used: { type: "integer" },
        remaining: { type: "integer" },
        exceeds: { type: "boolean" },
      },
      required: ["used", "remaining", "exceeds"],
    },
    ports: {
      inputs: [
        {
          id: "label",
          label: "Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "useUtf8Bytes",
          label: "Use Utf8Bytes",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "used", label: "Used", valueType: { type: "integer" } },
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
        { id: "exceeds", label: "Exceeds", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = specimenLabelCharacterBudgetTool.execute;
export default specimenLabelCharacterBudgetTool;
