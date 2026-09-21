import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableHours: number;
  readonly plannedHours: readonly number[];
  readonly contingencyHours: number;
};
export type Output = {
  readonly plannedTotal: number;
  readonly remainingHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableHours: { type: "number", minimum: 0 },
    plannedHours: { type: "array", maxItems: 256, items: { type: "number" } },
    contingencyHours: { type: "number", minimum: 0 },
  },
  required: ["availableHours", "plannedHours", "contingencyHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedTotal: { type: "number" },
    remainingHours: { type: "number" },
  },
  required: ["plannedTotal", "remainingHours"],
} as const;
/** Calculate self directed plan buffer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableHours, plannedHours, contingencyHours } = request;
  const compute = (): Output => {
    H.domain(
      availableHours >= 0 &&
        plannedHours.every((x) => x >= 0) &&
        contingencyHours >= 0,
    );
    return {
      plannedTotal: plannedHours.reduce((a, b) => a + b, 0),
      remainingHours:
        availableHours -
        plannedHours.reduce((a, b) => a + b, 0) -
        contingencyHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableHours: 20, plannedHours: [5, 6, 4], contingencyHours: 2 },
  output: { plannedTotal: 15, remainingHours: 3 },
} satisfies ToolExample<Input, Output>;
export const selfDirectedPlanBufferTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "andragogy/self-directed-plan-buffer",
    title: "Self Directed Plan Buffer Tool",
    description:
      "Calculate self directed plan buffer from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableHours: { type: "number", minimum: 0 },
        plannedHours: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        contingencyHours: { type: "number", minimum: 0 },
      },
      required: ["availableHours", "plannedHours", "contingencyHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedTotal: { type: "number" },
        remainingHours: { type: "number" },
      },
      required: ["plannedTotal", "remainingHours"],
    },
    ports: {
      inputs: [
        {
          id: "availableHours",
          label: "Available Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plannedHours",
          label: "Planned Hours",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "contingencyHours",
          label: "Contingency Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "plannedTotal",
          label: "Planned Total",
          valueType: { type: "number" },
        },
        {
          id: "remainingHours",
          label: "Remaining Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = selfDirectedPlanBufferTool.execute;
export default selfDirectedPlanBufferTool;
