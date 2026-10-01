import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly suppliedWeight: number;
  readonly included: boolean;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    suppliedWeight: { type: "number", minimum: 0 },
    included: { type: "boolean" },
  },
  required: ["value", "suppliedWeight", "included"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Return a supplied research-item contribution under explicit inclusion and weight flags without a validated score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, suppliedWeight, included } = request;
  const compute = (): Output => {
    H.domain(suppliedWeight >= 0);
    return { contribution: included ? value * suppliedWeight : 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 3, suppliedWeight: 0.5, included: true },
  output: { contribution: 1.5 },
} satisfies ToolExample<Input, Output>;
export const questionnaireItemDomainWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "osteopathy/questionnaire-item-domain-weight",
    title: "Questionnaire Item Domain Weight Tool",
    description:
      "Return a supplied research-item contribution under explicit inclusion and weight flags without a validated score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        suppliedWeight: { type: "number", minimum: 0 },
        included: { type: "boolean" },
      },
      required: ["value", "suppliedWeight", "included"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWeight",
          label: "Supplied Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "included",
          label: "Included",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = questionnaireItemDomainWeightTool.execute;
export default questionnaireItemDomainWeightTool;
