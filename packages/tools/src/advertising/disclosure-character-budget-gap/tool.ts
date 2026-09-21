import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly disclosure: string; readonly budget: number };
export type Output = { readonly used: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    disclosure: { type: "string", maxLength: 8192 },
    budget: { type: "integer", minimum: 0 },
  },
  required: ["disclosure", "budget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { used: { type: "integer" }, gap: { type: "integer" } },
  required: ["used", "gap"],
} as const;
/** Count Unicode code points against an explicit disclosure text budget; no legal adequacy determination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { disclosure, budget } = request;
  const compute = (): Output => {
    H.integer(budget, 0);
    return {
      used: [...disclosure].length,
      gap: budget - [...disclosure].length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { disclosure: "Ad: paid", budget: 12 },
  output: { used: 8, gap: 4 },
} satisfies ToolExample<Input, Output>;
export const disclosureCharacterBudgetGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/disclosure-character-budget-gap",
    title: "Disclosure Character Budget Gap Tool",
    description:
      "Count Unicode code points against an explicit disclosure text budget; no legal adequacy determination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        disclosure: { type: "string", maxLength: 8192 },
        budget: { type: "integer", minimum: 0 },
      },
      required: ["disclosure", "budget"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { used: { type: "integer" }, gap: { type: "integer" } },
      required: ["used", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "disclosure",
          label: "Disclosure",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "budget",
          label: "Budget",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "used", label: "Used", valueType: { type: "integer" } },
        { id: "gap", label: "Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = disclosureCharacterBudgetGapTool.execute;
export default disclosureCharacterBudgetGapTool;
