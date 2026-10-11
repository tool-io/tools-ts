import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allocatedContingency: number;
  readonly usedContingency: number;
};
export type Output = {
  readonly unusedBalance: number;
  readonly overrun: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedContingency: { type: "number", minimum: 0 },
    usedContingency: { type: "number", minimum: 0 },
  },
  required: ["allocatedContingency", "usedContingency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unusedBalance: { type: "number" },
    overrun: { type: "boolean" },
  },
  required: ["unusedBalance", "overrun"],
} as const;
/** Compare explicit property-estimate contingency and recorded use without estimating risk or project costs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allocatedContingency, usedContingency } = request;
  const compute = (): Output => {
    H.domain(
      allocatedContingency >= 0 && usedContingency >= 0,
      "allocatedContingency",
    );
    return {
      unusedBalance: allocatedContingency - usedContingency,
      overrun: usedContingency > allocatedContingency,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allocatedContingency: 1000, usedContingency: 650 },
  output: { unusedBalance: 350, overrun: false },
} satisfies ToolExample<Input, Output>;
export const estimatePropertyContingencyUnusedBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["real-estate", "real estate", "business and finance"],
        keywords: ["real estate", "business and finance"],
      },
      id: "real-estate/estimate-property-contingency-unused-balance",
      title: "Estimate Property Contingency Unused Balance",
      description:
        "Compare explicit property-estimate contingency and recorded use without estimating risk or project costs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          allocatedContingency: { type: "number", minimum: 0 },
          usedContingency: { type: "number", minimum: 0 },
        },
        required: ["allocatedContingency", "usedContingency"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unusedBalance: { type: "number" },
          overrun: { type: "boolean" },
        },
        required: ["unusedBalance", "overrun"],
      },
      ports: {
        inputs: [
          {
            id: "allocatedContingency",
            label: "Allocated Contingency",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "usedContingency",
            label: "Used Contingency",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "unusedBalance",
            label: "Unused Balance",
            valueType: { type: "number" },
          },
          { id: "overrun", label: "Overrun", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = estimatePropertyContingencyUnusedBalanceTool.execute;
export default estimatePropertyContingencyUnusedBalanceTool;
