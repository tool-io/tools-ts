import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coveredCount: number;
  readonly targetCount: number;
};
export type Output = {
  readonly coverageFraction: number;
  readonly shortfallCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredCount: { type: "integer", minimum: 0 },
    targetCount: { type: "integer", minimum: 1 },
  },
  required: ["coveredCount", "targetCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coverageFraction: { type: "number" },
    shortfallCount: { type: "integer" },
  },
  required: ["coverageFraction", "shortfallCount"],
} as const;
/** Compare recorded intervention coverage against a positive target count, preserving over-target ratios. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coveredCount, targetCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(targetCount) &&
        targetCount >= 1 &&
        targetCount <= Number.MAX_SAFE_INTEGER,
      "targetCount",
    ),
      targetCount);
    (H.domain(
      Number.isSafeInteger(coveredCount) &&
        coveredCount >= 0 &&
        coveredCount <= Number.MAX_SAFE_INTEGER,
      "coveredCount",
    ),
      coveredCount);
    return {
      coverageFraction: coveredCount / targetCount,
      shortfallCount: Math.max(0, targetCount - coveredCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coveredCount: 70, targetCount: 100 },
  output: { coverageFraction: 0.7, shortfallCount: 30 },
} satisfies ToolExample<Input, Output>;
export const interventionCoverageShortfallTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/intervention-coverage-shortfall",
    title: "Intervention Coverage Shortfall Tool",
    description:
      "Compare recorded intervention coverage against a positive target count, preserving over-target ratios.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredCount: { type: "integer", minimum: 0 },
        targetCount: { type: "integer", minimum: 1 },
      },
      required: ["coveredCount", "targetCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coverageFraction: { type: "number" },
        shortfallCount: { type: "integer" },
      },
      required: ["coverageFraction", "shortfallCount"],
    },
    ports: {
      inputs: [
        {
          id: "coveredCount",
          label: "Covered Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetCount",
          label: "Target Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "coverageFraction",
          label: "Coverage Fraction",
          valueType: { type: "number" },
        },
        {
          id: "shortfallCount",
          label: "Shortfall Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = interventionCoverageShortfallTool.execute;
export default interventionCoverageShortfallTool;
