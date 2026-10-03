import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly score: number; readonly tolerance: number };
export type Output = {
  readonly negative: boolean;
  readonly antiparallel: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number", minimum: -1, maximum: 1 },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["score", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    negative: { type: "boolean" },
    antiparallel: { type: "boolean" },
  },
  required: ["negative", "antiparallel"],
} as const;
/** Calculate cosine antiparallel negative score label from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, tolerance } = request;
  const compute = (): Output => {
    H.domain(score >= -1 && score <= 1 && tolerance >= 0);
    return {
      negative: score < 0,
      antiparallel: Math.abs(score + 1) <= tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { score: -1, tolerance: 0 },
  output: { negative: true, antiparallel: true },
} satisfies ToolExample<Input, Output>;
export const cosineAntiparallelNegativeScoreLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "similarity/cosine-antiparallel-negative-score-label",
      title: "Cosine Antiparallel Negative Score Label Tool",
      description:
        "Calculate cosine antiparallel negative score label from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          score: { type: "number", minimum: -1, maximum: 1 },
          tolerance: { type: "number", minimum: 0 },
        },
        required: ["score", "tolerance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          negative: { type: "boolean" },
          antiparallel: { type: "boolean" },
        },
        required: ["negative", "antiparallel"],
      },
      ports: {
        inputs: [
          {
            id: "score",
            label: "Score",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "tolerance",
            label: "Tolerance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "negative", label: "Negative", valueType: { type: "boolean" } },
          {
            id: "antiparallel",
            label: "Antiparallel",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cosineAntiparallelNegativeScoreLabelTool.execute;
export default cosineAntiparallelNegativeScoreLabelTool;
