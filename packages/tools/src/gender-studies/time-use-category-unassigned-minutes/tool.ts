import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedMinutes: number;
  readonly assignedMinutes: readonly number[];
};
export type Output = {
  readonly assignedTotal: number;
  readonly unassigned: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedMinutes: { type: "number", minimum: 0 },
    assignedMinutes: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
  },
  required: ["observedMinutes", "assignedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assignedTotal: { type: "number" },
    unassigned: { type: "number" },
  },
  required: ["assignedTotal", "unassigned"],
} as const;
/** Calculate time use category unassigned minutes from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedMinutes, assignedMinutes } = request;
  const compute = (): Output => {
    H.domain(
      observedMinutes >= 0 &&
        assignedMinutes.every((x) => x >= 0) &&
        assignedMinutes.reduce((a, b) => a + b, 0) <= observedMinutes,
    );
    return {
      assignedTotal: assignedMinutes.reduce((a, b) => a + b, 0),
      unassigned: observedMinutes - assignedMinutes.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedMinutes: 60, assignedMinutes: [20, 15] },
  output: { assignedTotal: 35, unassigned: 25 },
} satisfies ToolExample<Input, Output>;
export const timeUseCategoryUnassignedMinutesTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/time-use-category-unassigned-minutes",
    title: "Time Use Category Unassigned Minutes Tool",
    description:
      "Calculate time use category unassigned minutes from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedMinutes: { type: "number", minimum: 0 },
        assignedMinutes: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
      },
      required: ["observedMinutes", "assignedMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assignedTotal: { type: "number" },
        unassigned: { type: "number" },
      },
      required: ["assignedTotal", "unassigned"],
    },
    ports: {
      inputs: [
        {
          id: "observedMinutes",
          label: "Observed Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "assignedMinutes",
          label: "Assigned Minutes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "assignedTotal",
          label: "Assigned Total",
          valueType: { type: "number" },
        },
        {
          id: "unassigned",
          label: "Unassigned",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = timeUseCategoryUnassignedMinutesTool.execute;
export default timeUseCategoryUnassignedMinutesTool;
