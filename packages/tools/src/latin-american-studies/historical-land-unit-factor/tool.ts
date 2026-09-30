import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amount: number;
  readonly areaPerSourceUnit: number;
  readonly areaPerTargetUnit: number;
};
export type Output = { readonly converted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number", minimum: 0 },
    areaPerSourceUnit: { type: "number", exclusiveMinimum: 0 },
    areaPerTargetUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["amount", "areaPerSourceUnit", "areaPerTargetUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { converted: { type: "number" } },
  required: ["converted"],
} as const;
/** Calculate historical land unit factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amount, areaPerSourceUnit, areaPerTargetUnit } = request;
  const compute = (): Output => {
    H.domain(amount >= 0);
    H.positive(areaPerSourceUnit);
    H.positive(areaPerTargetUnit);
    return { converted: (amount * areaPerSourceUnit) / areaPerTargetUnit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amount: 3, areaPerSourceUnit: 100, areaPerTargetUnit: 25 },
  output: { converted: 12 },
} satisfies ToolExample<Input, Output>;
export const historicalLandUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "latin-american-studies/historical-land-unit-factor",
    title: "Historical Land Unit Factor Tool",
    description:
      "Calculate historical land unit factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amount: { type: "number", minimum: 0 },
        areaPerSourceUnit: { type: "number", exclusiveMinimum: 0 },
        areaPerTargetUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["amount", "areaPerSourceUnit", "areaPerTargetUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { converted: { type: "number" } },
      required: ["converted"],
    },
    ports: {
      inputs: [
        {
          id: "amount",
          label: "Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaPerSourceUnit",
          label: "Area Per Source Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaPerTargetUnit",
          label: "Area Per Target Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "converted", label: "Converted", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = historicalLandUnitFactorTool.execute;
export default historicalLandUnitFactorTool;
