import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resourceChange: number;
  readonly shadowPrice: number;
};
export type Output = { readonly objectiveChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resourceChange: { type: "number" },
    shadowPrice: { type: "number" },
  },
  required: ["resourceChange", "shadowPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { objectiveChange: { type: "number" } },
  required: ["objectiveChange"],
} as const;
/** Return the local objective change at a supplied shadow price, holding the active optimization basis fixed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resourceChange, shadowPrice } = request;
  const compute = (): Output => {
    return { objectiveChange: resourceChange * shadowPrice };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resourceChange: 4, shadowPrice: 12 },
  output: { objectiveChange: 48 },
} satisfies ToolExample<Input, Output>;
export const opportunityCostShadowPriceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/opportunity-cost-shadow-price-term",
    title: "Opportunity Cost Shadow Price Term Tool",
    description:
      "Return the local objective change at a supplied shadow price, holding the active optimization basis fixed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resourceChange: { type: "number" },
        shadowPrice: { type: "number" },
      },
      required: ["resourceChange", "shadowPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { objectiveChange: { type: "number" } },
      required: ["objectiveChange"],
    },
    ports: {
      inputs: [
        {
          id: "resourceChange",
          label: "Resource Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shadowPrice",
          label: "Shadow Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "objectiveChange",
          label: "Objective Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = opportunityCostShadowPriceTermTool.execute;
export default opportunityCostShadowPriceTermTool;
