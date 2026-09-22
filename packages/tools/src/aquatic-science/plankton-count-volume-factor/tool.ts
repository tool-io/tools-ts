import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly sampledVolume: number;
  readonly referenceVolume: number;
};
export type Output = { readonly scaledCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    sampledVolume: { type: "number", exclusiveMinimum: 0 },
    referenceVolume: { type: "number", minimum: 0 },
  },
  required: ["count", "sampledVolume", "referenceVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scaledCount: { type: "number" } },
  required: ["scaledCount"],
} as const;
/** Calculate plankton count volume factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, sampledVolume, referenceVolume } = request;
  const compute = (): Output => {
    H.integer(count, 0);
    H.positive(sampledVolume);
    H.domain(referenceVolume >= 0);
    return { scaledCount: (count / sampledVolume) * referenceVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 12, sampledVolume: 3, referenceVolume: 10 },
  output: { scaledCount: 40 },
} satisfies ToolExample<Input, Output>;
export const planktonCountVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/plankton-count-volume-factor",
    title: "Plankton Count Volume Factor Tool",
    description:
      "Calculate plankton count volume factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        sampledVolume: { type: "number", exclusiveMinimum: 0 },
        referenceVolume: { type: "number", minimum: 0 },
      },
      required: ["count", "sampledVolume", "referenceVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scaledCount: { type: "number" } },
      required: ["scaledCount"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampledVolume",
          label: "Sampled Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceVolume",
          label: "Reference Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaledCount",
          label: "Scaled Count",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = planktonCountVolumeFactorTool.execute;
export default planktonCountVolumeFactorTool;
