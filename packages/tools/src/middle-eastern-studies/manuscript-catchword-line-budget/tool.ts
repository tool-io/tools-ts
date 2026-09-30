import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lineCapacity: number;
  readonly bodyUnits: number;
  readonly catchwordUnits: number;
  readonly separationUnits: number;
};
export type Output = {
  readonly required: number;
  readonly remaining: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineCapacity: { type: "integer", minimum: 0 },
    bodyUnits: { type: "integer", minimum: 0 },
    catchwordUnits: { type: "integer", minimum: 0 },
    separationUnits: { type: "integer", minimum: 0 },
  },
  required: ["lineCapacity", "bodyUnits", "catchwordUnits", "separationUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    required: { type: "integer" },
    remaining: { type: "integer" },
    fits: { type: "boolean" },
  },
  required: ["required", "remaining", "fits"],
} as const;
/** Calculate manuscript catchword line budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lineCapacity, bodyUnits, catchwordUnits, separationUnits } = request;
  const compute = (): Output => {
    H.integer(lineCapacity, 0);
    H.integer(bodyUnits, 0);
    H.integer(catchwordUnits, 0);
    H.integer(separationUnits, 0);
    return {
      required: bodyUnits + catchwordUnits + separationUnits,
      remaining: lineCapacity - bodyUnits - catchwordUnits - separationUnits,
      fits: bodyUnits + catchwordUnits + separationUnits <= lineCapacity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lineCapacity: 80,
    bodyUnits: 60,
    catchwordUnits: 8,
    separationUnits: 2,
  },
  output: { required: 70, remaining: 10, fits: true },
} satisfies ToolExample<Input, Output>;
export const manuscriptCatchwordLineBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/manuscript-catchword-line-budget",
    title: "Manuscript Catchword Line Budget Tool",
    description:
      "Calculate manuscript catchword line budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineCapacity: { type: "integer", minimum: 0 },
        bodyUnits: { type: "integer", minimum: 0 },
        catchwordUnits: { type: "integer", minimum: 0 },
        separationUnits: { type: "integer", minimum: 0 },
      },
      required: [
        "lineCapacity",
        "bodyUnits",
        "catchwordUnits",
        "separationUnits",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        required: { type: "integer" },
        remaining: { type: "integer" },
        fits: { type: "boolean" },
      },
      required: ["required", "remaining", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "lineCapacity",
          label: "Line Capacity",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bodyUnits",
          label: "Body Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "catchwordUnits",
          label: "Catchword Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "separationUnits",
          label: "Separation Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "required", label: "Required", valueType: { type: "integer" } },
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = manuscriptCatchwordLineBudgetTool.execute;
export default manuscriptCatchwordLineBudgetTool;
