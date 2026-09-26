import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedHours: number;
  readonly failedHours: number;
  readonly catchCount: number;
};
export type Output = {
  readonly effectiveHours: number;
  readonly rate: number;
  readonly fullEffortEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedHours: { type: "number" },
    failedHours: { type: "number", minimum: 0 },
    catchCount: { type: "integer", minimum: 0 },
  },
  required: ["plannedHours", "failedHours", "catchCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveHours: { type: "number" },
    rate: { type: "number" },
    fullEffortEquivalent: { type: "number" },
  },
  required: ["effectiveHours", "rate", "fullEffortEquivalent"],
} as const;
/** Catch-rate effort correction assumes constant catchability during unobserved failed hours. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedHours, failedHours, catchCount } = request;
  const compute = (): Output => {
    H.domain(failedHours >= 0 && plannedHours > failedHours);
    H.integer(catchCount, 0);
    return {
      effectiveHours: plannedHours - failedHours,
      rate: catchCount / (plannedHours - failedHours),
      fullEffortEquivalent:
        (catchCount * plannedHours) / (plannedHours - failedHours),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plannedHours: 24, failedHours: 6, catchCount: 30 },
  output: {
    effectiveHours: 18,
    rate: 1.6666666666666667,
    fullEffortEquivalent: 40,
  },
} satisfies ToolExample<Input, Output>;
export const insectTrapEffortFailureAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/insect-trap-effort-failure-adjustment",
    title: "Insect Trap Effort Failure Adjustment Tool",
    description:
      "Catch-rate effort correction assumes constant catchability during unobserved failed hours.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedHours: { type: "number" },
        failedHours: { type: "number", minimum: 0 },
        catchCount: { type: "integer", minimum: 0 },
      },
      required: ["plannedHours", "failedHours", "catchCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveHours: { type: "number" },
        rate: { type: "number" },
        fullEffortEquivalent: { type: "number" },
      },
      required: ["effectiveHours", "rate", "fullEffortEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "plannedHours",
          label: "Planned Hours",
          required: true,
          valueType: { type: "number", unit: "h" },
        },
        {
          id: "failedHours",
          label: "Failed Hours",
          required: true,
          valueType: { type: "number", unit: "h" },
        },
        {
          id: "catchCount",
          label: "Catch Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "effectiveHours",
          label: "Effective Hours",
          valueType: { type: "number", unit: "h" },
        },
        { id: "rate", label: "Rate", valueType: { type: "number" } },
        {
          id: "fullEffortEquivalent",
          label: "Full Effort Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = insectTrapEffortFailureAdjustmentTool.execute;
export default insectTrapEffortFailureAdjustmentTool;
