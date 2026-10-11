import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLower: number;
  readonly firstUpper: number;
  readonly secondLower: number;
  readonly secondUpper: number;
};
export type Output = {
  readonly overlap: boolean;
  readonly intersectionLower: number;
  readonly intersectionUpper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLower: { type: "number", minimum: 0, maximum: 1 },
    firstUpper: { type: "number", maximum: 1 },
    secondLower: { type: "number", minimum: 0, maximum: 1 },
    secondUpper: { type: "number", maximum: 1 },
  },
  required: ["firstLower", "firstUpper", "secondLower", "secondUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlap: { type: "boolean" },
    intersectionLower: { type: "number" },
    intersectionUpper: { type: "number" },
  },
  required: ["overlap", "intersectionLower", "intersectionUpper"],
} as const;
/** Check closed overlap of two explicitly supplied probability intervals; disjoint intersections retain inverted bounds and a false flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLower, firstUpper, secondLower, secondUpper } = request;
  const compute = (): Output => {
    (H.domain(firstLower >= 0 && firstLower <= 1, "firstLower"), firstLower);
    H.domain(firstUpper >= firstLower && firstUpper <= 1, "firstUpper");
    (H.domain(secondLower >= 0 && secondLower <= 1, "secondLower"),
      secondLower);
    H.domain(secondUpper >= secondLower && secondUpper <= 1, "secondUpper");
    return {
      overlap:
        Math.max(firstLower, secondLower) <= Math.min(firstUpper, secondUpper),
      intersectionLower: Math.max(firstLower, secondLower),
      intersectionUpper: Math.min(firstUpper, secondUpper),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstLower: 0.2,
    firstUpper: 0.4,
    secondLower: 0.3,
    secondUpper: 0.5,
  },
  output: { overlap: true, intersectionLower: 0.3, intersectionUpper: 0.4 },
} satisfies ToolExample<Input, Output>;
export const probabilityIntervalRoundingOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["probability", "mathematics"],
      keywords: ["probability", "mathematics"],
    },
    id: "probability/probability-interval-rounding-overlap",
    title: "Probability Interval Rounding Overlap",
    description:
      "Check closed overlap of two explicitly supplied probability intervals; disjoint intersections retain inverted bounds and a false flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLower: { type: "number", minimum: 0, maximum: 1 },
        firstUpper: { type: "number", maximum: 1 },
        secondLower: { type: "number", minimum: 0, maximum: 1 },
        secondUpper: { type: "number", maximum: 1 },
      },
      required: ["firstLower", "firstUpper", "secondLower", "secondUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlap: { type: "boolean" },
        intersectionLower: { type: "number" },
        intersectionUpper: { type: "number" },
      },
      required: ["overlap", "intersectionLower", "intersectionUpper"],
    },
    ports: {
      inputs: [
        {
          id: "firstLower",
          label: "First Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstUpper",
          label: "First Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondLower",
          label: "Second Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondUpper",
          label: "Second Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "boolean" } },
        {
          id: "intersectionLower",
          label: "Intersection Lower",
          valueType: { type: "number" },
        },
        {
          id: "intersectionUpper",
          label: "Intersection Upper",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = probabilityIntervalRoundingOverlapTool.execute;
export default probabilityIntervalRoundingOverlapTool;
