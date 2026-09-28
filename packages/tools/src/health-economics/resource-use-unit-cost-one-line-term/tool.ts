import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly units: number;
  readonly unitCost: number;
  readonly attributableFraction: number;
};
export type Output = {
  readonly grossCost: number;
  readonly attributedCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    units: { type: "number", minimum: 0 },
    unitCost: { type: "number" },
    attributableFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["units", "unitCost", "attributableFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossCost: { type: "number" },
    attributedCost: { type: "number" },
  },
  required: ["grossCost", "attributedCost"],
} as const;
/** Calculate resource use unit cost one line term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { units, unitCost, attributableFraction } = request;
  const compute = (): Output => {
    H.domain(units >= 0);
    H.probability(attributableFraction);
    return {
      grossCost: units * unitCost,
      attributedCost: units * unitCost * attributableFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { units: 12, unitCost: 50, attributableFraction: 0.75 },
  output: { grossCost: 600, attributedCost: 450 },
} satisfies ToolExample<Input, Output>;
export const resourceUseUnitCostOneLineTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/resource-use-unit-cost-one-line-term",
    title: "Resource Use Unit Cost One Line Term Tool",
    description:
      "Calculate resource use unit cost one line term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        units: { type: "number", minimum: 0 },
        unitCost: { type: "number" },
        attributableFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["units", "unitCost", "attributableFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossCost: { type: "number" },
        attributedCost: { type: "number" },
      },
      required: ["grossCost", "attributedCost"],
    },
    ports: {
      inputs: [
        {
          id: "units",
          label: "Units",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitCost",
          label: "Unit Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "attributableFraction",
          label: "Attributable Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "grossCost", label: "Gross Cost", valueType: { type: "number" } },
        {
          id: "attributedCost",
          label: "Attributed Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = resourceUseUnitCostOneLineTermTool.execute;
export default resourceUseUnitCostOneLineTermTool;
