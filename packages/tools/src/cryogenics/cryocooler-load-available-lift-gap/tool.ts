import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableLift: number;
  readonly loads: readonly number[];
  readonly reserveFraction: number;
};
export type Output = {
  readonly totalLoad: number;
  readonly operatingBudget: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableLift: { type: "number", minimum: 0 },
    loads: { type: "array", maxItems: 256, items: { type: "number" } },
    reserveFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["availableLift", "loads", "reserveFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalLoad: { type: "number" },
    operatingBudget: { type: "number" },
    margin: { type: "number" },
  },
  required: ["totalLoad", "operatingBudget", "margin"],
} as const;
/** Arithmetic load budget at an explicitly supplied lift value and reserve, without inferring a cooler performance curve. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableLift, loads, reserveFraction } = request;
  const compute = (): Output => {
    H.domain(availableLift >= 0 && loads.every((x) => x >= 0));
    H.probability(reserveFraction);
    return {
      totalLoad: loads.reduce((a, b) => a + b, 0),
      operatingBudget: availableLift * (1 - reserveFraction),
      margin:
        availableLift * (1 - reserveFraction) -
        loads.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableLift: 20, loads: [5, 6], reserveFraction: 0.2 },
  output: { totalLoad: 11, operatingBudget: 16, margin: 5 },
} satisfies ToolExample<Input, Output>;
export const cryocoolerLoadAvailableLiftGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/cryocooler-load-available-lift-gap",
    title: "Cryocooler Load Available Lift Gap Tool",
    description:
      "Arithmetic load budget at an explicitly supplied lift value and reserve, without inferring a cooler performance curve.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableLift: { type: "number", minimum: 0 },
        loads: { type: "array", maxItems: 256, items: { type: "number" } },
        reserveFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["availableLift", "loads", "reserveFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalLoad: { type: "number" },
        operatingBudget: { type: "number" },
        margin: { type: "number" },
      },
      required: ["totalLoad", "operatingBudget", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "availableLift",
          label: "Available Lift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "loads",
          label: "Loads",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "reserveFraction",
          label: "Reserve Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "totalLoad", label: "Total Load", valueType: { type: "number" } },
        {
          id: "operatingBudget",
          label: "Operating Budget",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cryocoolerLoadAvailableLiftGapTool.execute;
export default cryocoolerLoadAvailableLiftGapTool;
