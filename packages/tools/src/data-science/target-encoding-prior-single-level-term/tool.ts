import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly levelTargetSum: number;
  readonly levelCount: number;
  readonly priorMean: number;
  readonly priorWeight: number;
};
export type Output = { readonly smoothedEncoding: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    levelTargetSum: { type: "number" },
    levelCount: { type: "integer", minimum: 0 },
    priorMean: { type: "number" },
    priorWeight: { type: "number", minimum: 0 },
  },
  required: ["levelTargetSum", "levelCount", "priorMean", "priorWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { smoothedEncoding: { type: "number" } },
  required: ["smoothedEncoding"],
} as const;
/** Calculate an explicit additive-prior target encoding from supplied level sum, count, prior mean and nonnegative pseudo-count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { levelTargetSum, levelCount, priorMean, priorWeight } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(levelCount) &&
        levelCount >= 0 &&
        levelCount <= Number.MAX_SAFE_INTEGER,
      "levelCount",
    ),
      levelCount);
    H.domain(priorWeight >= 0 && levelCount + priorWeight > 0, "priorWeight");
    return {
      smoothedEncoding:
        (levelTargetSum + priorWeight * priorMean) / (levelCount + priorWeight),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { levelTargetSum: 12, levelCount: 4, priorMean: 2, priorWeight: 2 },
  output: { smoothedEncoding: 2.6666666666666665 },
} satisfies ToolExample<Input, Output>;
export const targetEncodingPriorSingleLevelTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/target-encoding-prior-single-level-term",
    title: "Target Encoding Prior Single Level Term Tool",
    description:
      "Calculate an explicit additive-prior target encoding from supplied level sum, count, prior mean and nonnegative pseudo-count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        levelTargetSum: { type: "number" },
        levelCount: { type: "integer", minimum: 0 },
        priorMean: { type: "number" },
        priorWeight: { type: "number", minimum: 0 },
      },
      required: ["levelTargetSum", "levelCount", "priorMean", "priorWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { smoothedEncoding: { type: "number" } },
      required: ["smoothedEncoding"],
    },
    ports: {
      inputs: [
        {
          id: "levelTargetSum",
          label: "Level Target Sum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "levelCount",
          label: "Level Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "priorMean",
          label: "Prior Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priorWeight",
          label: "Prior Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "smoothedEncoding",
          label: "Smoothed Encoding",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = targetEncodingPriorSingleLevelTermTool.execute;
export default targetEncodingPriorSingleLevelTermTool;
