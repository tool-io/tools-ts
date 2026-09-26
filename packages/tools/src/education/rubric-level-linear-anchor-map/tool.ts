import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly level: number;
  readonly lowLevel: number;
  readonly highLevel: number;
  readonly lowScore: number;
  readonly highScore: number;
};
export type Output = { readonly score: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    level: { type: "number" },
    lowLevel: { type: "number" },
    highLevel: { type: "number" },
    lowScore: { type: "number" },
    highScore: { type: "number" },
  },
  required: ["level", "lowLevel", "highLevel", "lowScore", "highScore"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { score: { type: "number" } },
  required: ["score"],
} as const;
/** Calculate rubric level linear anchor map from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { level, lowLevel, highLevel, lowScore, highScore } = request;
  const compute = (): Output => {
    H.domain(lowLevel < highLevel && level >= lowLevel && level <= highLevel);
    return {
      score:
        lowScore +
        ((level - lowLevel) * (highScore - lowScore)) / (highLevel - lowLevel),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { level: 3, lowLevel: 1, highLevel: 5, lowScore: 0, highScore: 100 },
  output: { score: 50 },
} satisfies ToolExample<Input, Output>;
export const rubricLevelLinearAnchorMapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/rubric-level-linear-anchor-map",
    title: "Rubric Level Linear Anchor Map Tool",
    description:
      "Calculate rubric level linear anchor map from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        level: { type: "number" },
        lowLevel: { type: "number" },
        highLevel: { type: "number" },
        lowScore: { type: "number" },
        highScore: { type: "number" },
      },
      required: ["level", "lowLevel", "highLevel", "lowScore", "highScore"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { score: { type: "number" } },
      required: ["score"],
    },
    ports: {
      inputs: [
        {
          id: "level",
          label: "Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowLevel",
          label: "Low Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "highLevel",
          label: "High Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowScore",
          label: "Low Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "highScore",
          label: "High Score",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "score", label: "Score", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = rubricLevelLinearAnchorMapTool.execute;
export default rubricLevelLinearAnchorMapTool;
