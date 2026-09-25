import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialPresentations: number;
  readonly repeats: number;
  readonly maximumPresentations: number;
};
export type Output = {
  readonly total: number;
  readonly remaining: number;
  readonly exceeded: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialPresentations: { type: "integer", minimum: 0 },
    repeats: { type: "integer", minimum: 0 },
    maximumPresentations: { type: "integer", minimum: 0 },
  },
  required: ["initialPresentations", "repeats", "maximumPresentations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: { type: "integer" },
    remaining: { type: "integer" },
    exceeded: { type: "boolean" },
  },
  required: ["total", "remaining", "exceeded"],
} as const;
/** Calculate child study instruction repeat count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialPresentations, repeats, maximumPresentations } = request;
  const compute = (): Output => {
    H.integer(initialPresentations, 0);
    H.integer(repeats, 0);
    H.integer(maximumPresentations, 0);
    return {
      total: initialPresentations + repeats,
      remaining: maximumPresentations - initialPresentations - repeats,
      exceeded: initialPresentations + repeats > maximumPresentations,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialPresentations: 1, repeats: 2, maximumPresentations: 4 },
  output: { total: 3, remaining: 1, exceeded: false },
} satisfies ToolExample<Input, Output>;
export const childStudyInstructionRepeatCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/child-study-instruction-repeat-count",
    title: "Child Study Instruction Repeat Count Tool",
    description:
      "Calculate child study instruction repeat count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialPresentations: { type: "integer", minimum: 0 },
        repeats: { type: "integer", minimum: 0 },
        maximumPresentations: { type: "integer", minimum: 0 },
      },
      required: ["initialPresentations", "repeats", "maximumPresentations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        total: { type: "integer" },
        remaining: { type: "integer" },
        exceeded: { type: "boolean" },
      },
      required: ["total", "remaining", "exceeded"],
    },
    ports: {
      inputs: [
        {
          id: "initialPresentations",
          label: "Initial Presentations",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "repeats",
          label: "Repeats",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "maximumPresentations",
          label: "Maximum Presentations",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "total", label: "Total", valueType: { type: "integer" } },
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
        { id: "exceeded", label: "Exceeded", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = childStudyInstructionRepeatCountTool.execute;
export default childStudyInstructionRepeatCountTool;
