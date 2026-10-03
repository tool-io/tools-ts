import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly basePrice: number;
  readonly baseIndex: number;
  readonly currentIndex: number;
  readonly indexedFraction: number;
};
export type Output = {
  readonly indexRatio: number;
  readonly adjustment: number;
  readonly newPrice: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basePrice: { type: "number", minimum: 0 },
    baseIndex: { type: "number", exclusiveMinimum: 0 },
    currentIndex: { type: "number", minimum: 0 },
    indexedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["basePrice", "baseIndex", "currentIndex", "indexedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indexRatio: { type: "number" },
    adjustment: { type: "number" },
    newPrice: { type: "number" },
  },
  required: ["indexRatio", "adjustment", "newPrice"],
} as const;
/** Calculate contract escalation caller index term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { basePrice, baseIndex, currentIndex, indexedFraction } = request;
  const compute = (): Output => {
    H.domain(basePrice >= 0 && currentIndex >= 0);
    H.positive(baseIndex);
    H.probability(indexedFraction);
    return {
      indexRatio: currentIndex / baseIndex,
      adjustment: basePrice * indexedFraction * (currentIndex / baseIndex - 1),
      newPrice:
        basePrice * (1 + indexedFraction * (currentIndex / baseIndex - 1)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    basePrice: 1000,
    baseIndex: 100,
    currentIndex: 120,
    indexedFraction: 0.5,
  },
  output: { indexRatio: 1.2, adjustment: 99.99999999999997, newPrice: 1100 },
} satisfies ToolExample<Input, Output>;
export const contractEscalationCallerIndexTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/contract-escalation-caller-index-term",
    title: "Contract Escalation Caller Index Term Tool",
    description:
      "Calculate contract escalation caller index term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        basePrice: { type: "number", minimum: 0 },
        baseIndex: { type: "number", exclusiveMinimum: 0 },
        currentIndex: { type: "number", minimum: 0 },
        indexedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["basePrice", "baseIndex", "currentIndex", "indexedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        indexRatio: { type: "number" },
        adjustment: { type: "number" },
        newPrice: { type: "number" },
      },
      required: ["indexRatio", "adjustment", "newPrice"],
    },
    ports: {
      inputs: [
        {
          id: "basePrice",
          label: "Base Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseIndex",
          label: "Base Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentIndex",
          label: "Current Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "indexedFraction",
          label: "Indexed Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "indexRatio",
          label: "Index Ratio",
          valueType: { type: "number" },
        },
        {
          id: "adjustment",
          label: "Adjustment",
          valueType: { type: "number" },
        },
        { id: "newPrice", label: "New Price", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = contractEscalationCallerIndexTermTool.execute;
export default contractEscalationCallerIndexTermTool;
