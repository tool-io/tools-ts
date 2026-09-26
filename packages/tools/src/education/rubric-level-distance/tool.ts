import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLabel: string;
  readonly secondLabel: string;
  readonly orderedLevels: readonly string[];
};
export type Output = {
  readonly signedDistance: number;
  readonly absoluteDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLabel: { type: "string", maxLength: 8192 },
    secondLabel: { type: "string", maxLength: 8192 },
    orderedLevels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["firstLabel", "secondLabel", "orderedLevels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDistance: { type: "integer" },
    absoluteDistance: { type: "integer" },
  },
  required: ["signedDistance", "absoluteDistance"],
} as const;
/** Compare ordinal positions in a supplied rubric without assuming equally spaced achievement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLabel, secondLabel, orderedLevels } = request;
  const compute = (): Output => {
    H.domain(new Set(orderedLevels).size === orderedLevels.length);
    const a = orderedLevels.indexOf(firstLabel),
      b = orderedLevels.indexOf(secondLabel);
    H.domain(a >= 0 && b >= 0);
    return { signedDistance: b - a, absoluteDistance: Math.abs(b - a) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstLabel: "developing",
    secondLabel: "advanced",
    orderedLevels: ["beginning", "developing", "proficient", "advanced"],
  },
  output: { signedDistance: 2, absoluteDistance: 2 },
} satisfies ToolExample<Input, Output>;
export const rubricLevelDistanceTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "education/rubric-level-distance",
      title: "Rubric Level Distance Tool",
      description:
        "Compare ordinal positions in a supplied rubric without assuming equally spaced achievement.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstLabel: { type: "string", maxLength: 8192 },
          secondLabel: { type: "string", maxLength: 8192 },
          orderedLevels: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["firstLabel", "secondLabel", "orderedLevels"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedDistance: { type: "integer" },
          absoluteDistance: { type: "integer" },
        },
        required: ["signedDistance", "absoluteDistance"],
      },
      ports: {
        inputs: [
          {
            id: "firstLabel",
            label: "First Label",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondLabel",
            label: "Second Label",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "orderedLevels",
            label: "Ordered Levels",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "signedDistance",
            label: "Signed Distance",
            valueType: { type: "integer" },
          },
          {
            id: "absoluteDistance",
            label: "Absolute Distance",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = rubricLevelDistanceTool.execute;
export default rubricLevelDistanceTool;
