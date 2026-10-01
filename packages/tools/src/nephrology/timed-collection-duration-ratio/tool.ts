import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualDuration: number;
  readonly plannedDuration: number;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualDuration: { type: "number", minimum: 0 },
    plannedDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["actualDuration", "plannedDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Compare supplied research collection times without a clinical adequacy decision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actualDuration, plannedDuration } = request;
  const compute = (): Output => {
    H.domain(actualDuration >= 0);
    H.positive(plannedDuration);
    return { ratio: actualDuration / plannedDuration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actualDuration: 18, plannedDuration: 24 },
  output: { ratio: 0.75 },
} satisfies ToolExample<Input, Output>;
export const timedCollectionDurationRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nephrology/timed-collection-duration-ratio",
    title: "Timed Collection Duration Ratio Tool",
    description:
      "Compare supplied research collection times without a clinical adequacy decision.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualDuration: { type: "number", minimum: 0 },
        plannedDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["actualDuration", "plannedDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        {
          id: "actualDuration",
          label: "Actual Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plannedDuration",
          label: "Planned Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = timedCollectionDurationRatioTool.execute;
export default timedCollectionDurationRatioTool;
