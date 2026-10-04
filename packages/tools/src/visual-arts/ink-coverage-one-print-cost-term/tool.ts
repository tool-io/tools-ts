import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly coverageFraction: number;
  readonly inkPerArea: number;
  readonly costPerInkUnit: number;
};
export type Output = { readonly inkUsed: number; readonly cost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    coverageFraction: { type: "number", minimum: 0, maximum: 1 },
    inkPerArea: { type: "number", minimum: 0 },
    costPerInkUnit: { type: "number", minimum: 0 },
  },
  required: ["area", "coverageFraction", "inkPerArea", "costPerInkUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inkUsed: { type: "number" }, cost: { type: "number" } },
  required: ["inkUsed", "cost"],
} as const;
/** Calculate ink coverage one print cost term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, coverageFraction, inkPerArea, costPerInkUnit } = request;
  const compute = (): Output => {
    H.domain(area >= 0 && inkPerArea >= 0 && costPerInkUnit >= 0);
    H.probability(coverageFraction);
    return {
      inkUsed: area * coverageFraction * inkPerArea,
      cost: area * coverageFraction * inkPerArea * costPerInkUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    area: 100,
    coverageFraction: 0.5,
    inkPerArea: 0.2,
    costPerInkUnit: 3,
  },
  output: { inkUsed: 10, cost: 30 },
} satisfies ToolExample<Input, Output>;
export const inkCoverageOnePrintCostTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/ink-coverage-one-print-cost-term",
    title: "Ink Coverage One Print Cost Term Tool",
    description:
      "Calculate ink coverage one print cost term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        coverageFraction: { type: "number", minimum: 0, maximum: 1 },
        inkPerArea: { type: "number", minimum: 0 },
        costPerInkUnit: { type: "number", minimum: 0 },
      },
      required: ["area", "coverageFraction", "inkPerArea", "costPerInkUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inkUsed: { type: "number" }, cost: { type: "number" } },
      required: ["inkUsed", "cost"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coverageFraction",
          label: "Coverage Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inkPerArea",
          label: "Ink Per Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "costPerInkUnit",
          label: "Cost Per Ink Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "inkUsed", label: "Ink Used", valueType: { type: "number" } },
        { id: "cost", label: "Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = inkCoverageOnePrintCostTermTool.execute;
export default inkCoverageOnePrintCostTermTool;
