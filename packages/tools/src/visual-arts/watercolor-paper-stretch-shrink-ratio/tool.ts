import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetLength: number;
  readonly dryLength: number;
  readonly desiredDryLength: number;
};
export type Output = {
  readonly retention: number;
  readonly requiredWetLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetLength: { type: "number", exclusiveMinimum: 0 },
    dryLength: { type: "number", exclusiveMinimum: 0 },
    desiredDryLength: { type: "number", minimum: 0 },
  },
  required: ["wetLength", "dryLength", "desiredDryLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retention: { type: "number" },
    requiredWetLength: { type: "number" },
  },
  required: ["retention", "requiredWetLength"],
} as const;
/** Calculate watercolor paper stretch shrink ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetLength, dryLength, desiredDryLength } = request;
  const compute = (): Output => {
    H.positive(wetLength);
    H.positive(dryLength);
    H.domain(desiredDryLength >= 0);
    return {
      retention: dryLength / wetLength,
      requiredWetLength: (desiredDryLength * wetLength) / dryLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetLength: 110, dryLength: 100, desiredDryLength: 50 },
  output: { retention: 0.9090909090909091, requiredWetLength: 55 },
} satisfies ToolExample<Input, Output>;
export const watercolorPaperStretchShrinkRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/watercolor-paper-stretch-shrink-ratio",
    title: "Watercolor Paper Stretch Shrink Ratio Tool",
    description:
      "Calculate watercolor paper stretch shrink ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetLength: { type: "number", exclusiveMinimum: 0 },
        dryLength: { type: "number", exclusiveMinimum: 0 },
        desiredDryLength: { type: "number", minimum: 0 },
      },
      required: ["wetLength", "dryLength", "desiredDryLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retention: { type: "number" },
        requiredWetLength: { type: "number" },
      },
      required: ["retention", "requiredWetLength"],
    },
    ports: {
      inputs: [
        {
          id: "wetLength",
          label: "Wet Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryLength",
          label: "Dry Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "desiredDryLength",
          label: "Desired Dry Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "retention", label: "Retention", valueType: { type: "number" } },
        {
          id: "requiredWetLength",
          label: "Required Wet Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = watercolorPaperStretchShrinkRatioTool.execute;
export default watercolorPaperStretchShrinkRatioTool;
