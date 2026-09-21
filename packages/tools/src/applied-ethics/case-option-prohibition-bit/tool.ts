import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly option: string;
  readonly prohibitedOptions: readonly string[];
  readonly ruleApplies: boolean;
};
export type Output = { readonly prohibited: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    option: { type: "string", maxLength: 8192 },
    prohibitedOptions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    ruleApplies: { type: "boolean" },
  },
  required: ["option", "prohibitedOptions", "ruleApplies"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { prohibited: { type: "boolean" } },
  required: ["prohibited"],
} as const;
/** Apply a supplied prohibition list and applicability flag without deciding ethical permissibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { option, prohibitedOptions, ruleApplies } = request;
  const compute = (): Output => {
    return { prohibited: ruleApplies && prohibitedOptions.includes(option) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { option: "A", prohibitedOptions: ["A"], ruleApplies: true },
  output: { prohibited: true },
} satisfies ToolExample<Input, Output>;
export const caseOptionProhibitionBitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "applied-ethics/case-option-prohibition-bit",
    title: "Case Option Prohibition Bit Tool",
    description:
      "Apply a supplied prohibition list and applicability flag without deciding ethical permissibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        option: { type: "string", maxLength: 8192 },
        prohibitedOptions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        ruleApplies: { type: "boolean" },
      },
      required: ["option", "prohibitedOptions", "ruleApplies"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { prohibited: { type: "boolean" } },
      required: ["prohibited"],
    },
    ports: {
      inputs: [
        {
          id: "option",
          label: "Option",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "prohibitedOptions",
          label: "Prohibited Options",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "ruleApplies",
          label: "Rule Applies",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "prohibited",
          label: "Prohibited",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = caseOptionProhibitionBitTool.execute;
export default caseOptionProhibitionBitTool;
