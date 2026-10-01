import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedDistance: number;
  readonly sourceToTargetFactor: number;
};
export type Output = { readonly distance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDistance: { type: "number", minimum: 0 },
    sourceToTargetFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recordedDistance", "sourceToTargetFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" } },
  required: ["distance"],
} as const;
/** Calculate visual stimulus distance factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedDistance, sourceToTargetFactor } = request;
  const compute = (): Output => {
    H.domain(recordedDistance >= 0);
    H.positive(sourceToTargetFactor);
    return { distance: recordedDistance * sourceToTargetFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedDistance: 200, sourceToTargetFactor: 0.01 },
  output: { distance: 2 },
} satisfies ToolExample<Input, Output>;
export const visualStimulusDistanceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/visual-stimulus-distance-factor",
    title: "Visual Stimulus Distance Factor Tool",
    description:
      "Calculate visual stimulus distance factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedDistance: { type: "number", minimum: 0 },
        sourceToTargetFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recordedDistance", "sourceToTargetFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distance: { type: "number" } },
      required: ["distance"],
    },
    ports: {
      inputs: [
        {
          id: "recordedDistance",
          label: "Recorded Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceToTargetFactor",
          label: "Source To Target Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = visualStimulusDistanceFactorTool.execute;
export default visualStimulusDistanceFactorTool;
