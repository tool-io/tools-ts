import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableOptions: number;
  readonly mandated: number;
  readonly excluded: number;
  readonly mandatedExcluded: number;
};
export type Output = { readonly freeOptions: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableOptions: { type: "integer", minimum: 0 },
    mandated: { type: "integer", minimum: 0 },
    excluded: { type: "integer", minimum: 0 },
    mandatedExcluded: { type: "integer", minimum: 0 },
  },
  required: ["availableOptions", "mandated", "excluded", "mandatedExcluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { freeOptions: { type: "integer" } },
  required: ["freeOptions"],
} as const;
/** Calculate task autonomy choice budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableOptions, mandated, excluded, mandatedExcluded } = request;
  const compute = (): Output => {
    H.integer(availableOptions, 0);
    H.integer(mandated, 0, availableOptions);
    H.integer(excluded, 0, availableOptions);
    H.integer(mandatedExcluded, 0, Math.min(mandated, excluded));
    H.domain(mandated + excluded - mandatedExcluded <= availableOptions);
    return {
      freeOptions: availableOptions - mandated - excluded + mandatedExcluded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    availableOptions: 10,
    mandated: 2,
    excluded: 3,
    mandatedExcluded: 1,
  },
  output: { freeOptions: 6 },
} satisfies ToolExample<Input, Output>;
export const taskAutonomyChoiceBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "andragogy/task-autonomy-choice-budget",
    title: "Task Autonomy Choice Budget Tool",
    description:
      "Calculate task autonomy choice budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableOptions: { type: "integer", minimum: 0 },
        mandated: { type: "integer", minimum: 0 },
        excluded: { type: "integer", minimum: 0 },
        mandatedExcluded: { type: "integer", minimum: 0 },
      },
      required: [
        "availableOptions",
        "mandated",
        "excluded",
        "mandatedExcluded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { freeOptions: { type: "integer" } },
      required: ["freeOptions"],
    },
    ports: {
      inputs: [
        {
          id: "availableOptions",
          label: "Available Options",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "mandated",
          label: "Mandated",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "mandatedExcluded",
          label: "Mandated Excluded",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "freeOptions",
          label: "Free Options",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = taskAutonomyChoiceBudgetTool.execute;
export default taskAutonomyChoiceBudgetTool;
