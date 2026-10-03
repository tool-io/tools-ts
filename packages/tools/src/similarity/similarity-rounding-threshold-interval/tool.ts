import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly displayed: number;
  readonly resolution: number;
  readonly threshold: number;
};
export type Output = {
  readonly lower: number;
  readonly upper: number;
  readonly classification: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displayed: { type: "number" },
    resolution: { type: "number", exclusiveMinimum: 0 },
    threshold: { type: "number" },
  },
  required: ["displayed", "resolution", "threshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    classification: { type: "string", maxLength: 8192 },
  },
  required: ["lower", "upper", "classification"],
} as const;
/** Calculate similarity rounding threshold interval from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { displayed, resolution, threshold } = request;
  const compute = (): Output => {
    H.positive(resolution);
    const lower = displayed - resolution / 2,
      upper = displayed + resolution / 2;
    return {
      lower,
      upper,
      classification:
        lower >= threshold
          ? "certain-pass"
          : upper < threshold
            ? "certain-fail"
            : "ambiguous",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { displayed: 0.8, resolution: 0.1, threshold: 0.78 },
  output: {
    lower: 0.75,
    upper: 0.8500000000000001,
    classification: "ambiguous",
  },
} satisfies ToolExample<Input, Output>;
export const similarityRoundingThresholdIntervalTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "similarity/similarity-rounding-threshold-interval",
      title: "Similarity Rounding Threshold Interval Tool",
      description:
        "Calculate similarity rounding threshold interval from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          displayed: { type: "number" },
          resolution: { type: "number", exclusiveMinimum: 0 },
          threshold: { type: "number" },
        },
        required: ["displayed", "resolution", "threshold"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lower: { type: "number" },
          upper: { type: "number" },
          classification: { type: "string", maxLength: 8192 },
        },
        required: ["lower", "upper", "classification"],
      },
      ports: {
        inputs: [
          {
            id: "displayed",
            label: "Displayed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "resolution",
            label: "Resolution",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "threshold",
            label: "Threshold",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "lower", label: "Lower", valueType: { type: "number" } },
          { id: "upper", label: "Upper", valueType: { type: "number" } },
          {
            id: "classification",
            label: "Classification",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = similarityRoundingThresholdIntervalTool.execute;
export default similarityRoundingThresholdIntervalTool;
