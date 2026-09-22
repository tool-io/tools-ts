import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sureEquivalent: number;
  readonly budget: number;
  readonly baselineCost: number;
};
export type Output = { readonly netEquivalent: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sureEquivalent: { type: "number" },
    budget: { type: "number", exclusiveMinimum: 0 },
    baselineCost: { type: "number" },
  },
  required: ["sureEquivalent", "budget", "baselineCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netEquivalent: { type: "number" }, share: { type: "number" } },
  required: ["netEquivalent", "share"],
} as const;
/** Scale an explicitly elicited sure equivalent net of supplied baseline cost, retaining signed values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sureEquivalent, budget, baselineCost } = request;
  const compute = (): Output => {
    H.positive(budget);
    return {
      netEquivalent: sureEquivalent - baselineCost,
      share: (sureEquivalent - baselineCost) / budget,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sureEquivalent: 30, budget: 100, baselineCost: 10 },
  output: { netEquivalent: 20, share: 0.2 },
} satisfies ToolExample<Input, Output>;
export const sureEquivalentBudgetShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/sure-equivalent-budget-share",
    title: "Sure Equivalent Budget Share Tool",
    description:
      "Scale an explicitly elicited sure equivalent net of supplied baseline cost, retaining signed values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sureEquivalent: { type: "number" },
        budget: { type: "number", exclusiveMinimum: 0 },
        baselineCost: { type: "number" },
      },
      required: ["sureEquivalent", "budget", "baselineCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netEquivalent: { type: "number" },
        share: { type: "number" },
      },
      required: ["netEquivalent", "share"],
    },
    ports: {
      inputs: [
        {
          id: "sureEquivalent",
          label: "Sure Equivalent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "budget",
          label: "Budget",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baselineCost",
          label: "Baseline Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netEquivalent",
          label: "Net Equivalent",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sureEquivalentBudgetShareTool.execute;
export default sureEquivalentBudgetShareTool;
