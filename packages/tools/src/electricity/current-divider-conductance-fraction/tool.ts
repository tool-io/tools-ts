import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalCurrent: number;
  readonly branchConductance: number;
  readonly totalConductance: number;
};
export type Output = {
  readonly branchCurrent: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCurrent: { type: "number" },
    branchConductance: { type: "number", minimum: 0 },
    totalConductance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["totalCurrent", "branchConductance", "totalConductance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    branchCurrent: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["branchCurrent", "fraction"],
} as const;
/** Calculate current divider conductance fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalCurrent, branchConductance, totalConductance } = request;
  const compute = (): Output => {
    H.domain(branchConductance >= 0);
    H.positive(totalConductance);
    H.domain(branchConductance <= totalConductance);
    const fraction = branchConductance / totalConductance;
    return { branchCurrent: totalCurrent * fraction, fraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalCurrent: 12, branchConductance: 2, totalConductance: 6 },
  output: { branchCurrent: 4, fraction: 0.3333333333333333 },
} satisfies ToolExample<Input, Output>;
export const currentDividerConductanceFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/current-divider-conductance-fraction",
    title: "Current Divider Conductance Fraction Tool",
    description:
      "Calculate current divider conductance fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalCurrent: { type: "number" },
        branchConductance: { type: "number", minimum: 0 },
        totalConductance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["totalCurrent", "branchConductance", "totalConductance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        branchCurrent: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["branchCurrent", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "totalCurrent",
          label: "Total Current",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "branchConductance",
          label: "Branch Conductance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalConductance",
          label: "Total Conductance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "branchCurrent",
          label: "Branch Current",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = currentDividerConductanceFractionTool.execute;
export default currentDividerConductanceFractionTool;
