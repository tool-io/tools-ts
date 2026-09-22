import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstRun: number; readonly secondRun: number };
export type Output = { readonly planLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRun: { type: "number", minimum: 0 },
    secondRun: { type: "number", minimum: 0 },
  },
  required: ["firstRun", "secondRun"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { planLength: { type: "number" } },
  required: ["planLength"],
} as const;
/** Calculate roof valley plan diagonal factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstRun, secondRun } = request;
  const compute = (): Output => {
    H.domain(firstRun >= 0 && secondRun >= 0);
    return { planLength: Math.hypot(firstRun, secondRun) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstRun: 3, secondRun: 4 },
  output: { planLength: 5 },
} satisfies ToolExample<Input, Output>;
export const roofValleyPlanDiagonalFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/roof-valley-plan-diagonal-factor",
    title: "Roof Valley Plan Diagonal Factor Tool",
    description:
      "Calculate roof valley plan diagonal factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRun: { type: "number", minimum: 0 },
        secondRun: { type: "number", minimum: 0 },
      },
      required: ["firstRun", "secondRun"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { planLength: { type: "number" } },
      required: ["planLength"],
    },
    ports: {
      inputs: [
        {
          id: "firstRun",
          label: "First Run",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondRun",
          label: "Second Run",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "planLength",
          label: "Plan Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = roofValleyPlanDiagonalFactorTool.execute;
export default roofValleyPlanDiagonalFactorTool;
