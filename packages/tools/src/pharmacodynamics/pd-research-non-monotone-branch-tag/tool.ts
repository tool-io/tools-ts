import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly levels: readonly number[];
  readonly responses: readonly number[];
  readonly tolerance: number;
};
export type Output = {
  readonly risingSegments: readonly number[];
  readonly fallingSegments: readonly number[];
  readonly flatSegments: readonly number[];
  readonly nonMonotone: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    levels: { type: "array", maxItems: 256, items: { type: "number" } },
    responses: { type: "array", maxItems: 256, items: { type: "number" } },
    tolerance: { type: "number" },
  },
  required: ["levels", "responses", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    risingSegments: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    fallingSegments: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    flatSegments: { type: "array", maxItems: 256, items: { type: "integer" } },
    nonMonotone: { type: "boolean" },
  },
  required: [
    "risingSegments",
    "fallingSegments",
    "flatSegments",
    "nonMonotone",
  ],
} as const;
/** Label supplied response segments under an explicit flatness tolerance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { levels, responses, tolerance } = request;
  const compute = (): Output => {
    H.sameLength(levels, responses);
    H.domain(
      levels.length >= 2 &&
        levels.every((x, i) => i === 0 || x > levels[i - 1]) &&
        tolerance >= 0,
    );
    const risingSegments: number[] = [],
      fallingSegments: number[] = [],
      flatSegments: number[] = [];
    for (let i = 0; i < responses.length - 1; i++) {
      const d = responses[i + 1] - responses[i];
      (d > tolerance
        ? risingSegments
        : d < -tolerance
          ? fallingSegments
          : flatSegments
      ).push(i);
    }
    return {
      risingSegments,
      fallingSegments,
      flatSegments,
      nonMonotone: risingSegments.length > 0 && fallingSegments.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { levels: [1, 2, 3, 4], responses: [1, 3, 2, 2], tolerance: 0 },
  output: {
    risingSegments: [0],
    fallingSegments: [1],
    flatSegments: [2],
    nonMonotone: true,
  },
} satisfies ToolExample<Input, Output>;
export const pdResearchNonMonotoneBranchTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/pd-research-non-monotone-branch-tag",
    title: "PD Research Non Monotone Branch Tag Tool",
    description:
      "Label supplied response segments under an explicit flatness tolerance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        levels: { type: "array", maxItems: 256, items: { type: "number" } },
        responses: { type: "array", maxItems: 256, items: { type: "number" } },
        tolerance: { type: "number" },
      },
      required: ["levels", "responses", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        risingSegments: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        fallingSegments: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        flatSegments: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        nonMonotone: { type: "boolean" },
      },
      required: [
        "risingSegments",
        "fallingSegments",
        "flatSegments",
        "nonMonotone",
      ],
    },
    ports: {
      inputs: [
        {
          id: "levels",
          label: "Levels",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "responses",
          label: "Responses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "risingSegments",
          label: "Rising Segments",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "fallingSegments",
          label: "Falling Segments",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "flatSegments",
          label: "Flat Segments",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "nonMonotone",
          label: "Non Monotone",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = pdResearchNonMonotoneBranchTagTool.execute;
export default pdResearchNonMonotoneBranchTagTool;
