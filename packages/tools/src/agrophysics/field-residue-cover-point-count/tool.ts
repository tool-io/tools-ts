import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coveredPoints: number;
  readonly totalPoints: number;
};
export type Output = {
  readonly coverFraction: number;
  readonly uncoveredPoints: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredPoints: { type: "integer", minimum: 0 },
    totalPoints: { type: "integer", minimum: 1 },
  },
  required: ["coveredPoints", "totalPoints"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coverFraction: { type: "number" },
    uncoveredPoints: { type: "integer" },
  },
  required: ["coverFraction", "uncoveredPoints"],
} as const;
/** Normalize an explicit covered-point count to a supplied positive point-count denominator without detecting cover from images. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coveredPoints, totalPoints } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalPoints) &&
        totalPoints >= 1 &&
        totalPoints <= Number.MAX_SAFE_INTEGER,
      "totalPoints",
    ),
      totalPoints);
    (H.domain(
      Number.isSafeInteger(coveredPoints) &&
        coveredPoints >= 0 &&
        coveredPoints <= totalPoints,
      "coveredPoints",
    ),
      coveredPoints);
    return {
      coverFraction: coveredPoints / totalPoints,
      uncoveredPoints: totalPoints - coveredPoints,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coveredPoints: 35, totalPoints: 100 },
  output: { coverFraction: 0.35, uncoveredPoints: 65 },
} satisfies ToolExample<Input, Output>;
export const fieldResidueCoverPointCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrophysics", "agriculture"],
      keywords: ["agrophysics", "agriculture"],
    },
    id: "agrophysics/field-residue-cover-point-count",
    title: "Field Residue Cover Point Count",
    description:
      "Normalize an explicit covered-point count to a supplied positive point-count denominator without detecting cover from images.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredPoints: { type: "integer", minimum: 0 },
        totalPoints: { type: "integer", minimum: 1 },
      },
      required: ["coveredPoints", "totalPoints"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coverFraction: { type: "number" },
        uncoveredPoints: { type: "integer" },
      },
      required: ["coverFraction", "uncoveredPoints"],
    },
    ports: {
      inputs: [
        {
          id: "coveredPoints",
          label: "Covered Points",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalPoints",
          label: "Total Points",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "coverFraction",
          label: "Cover Fraction",
          valueType: { type: "number" },
        },
        {
          id: "uncoveredPoints",
          label: "Uncovered Points",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = fieldResidueCoverPointCountTool.execute;
export default fieldResidueCoverPointCountTool;
