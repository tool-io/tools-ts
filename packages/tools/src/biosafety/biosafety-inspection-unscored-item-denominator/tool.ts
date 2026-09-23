import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scored: number;
  readonly unscored: number;
  readonly excluded: number;
  readonly maximumPoints: number;
  readonly earnedPoints: number;
  readonly includeUnscored: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly scoreFraction: number;
  readonly unscoredShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scored: { type: "integer", minimum: 1 },
    unscored: { type: "integer", minimum: 0 },
    excluded: { type: "integer", minimum: 0 },
    maximumPoints: { type: "number", exclusiveMinimum: 0 },
    earnedPoints: { type: "number", minimum: 0 },
    includeUnscored: { type: "boolean" },
  },
  required: [
    "scored",
    "unscored",
    "excluded",
    "maximumPoints",
    "earnedPoints",
    "includeUnscored",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    scoreFraction: { type: "number" },
    unscoredShare: { type: "number" },
  },
  required: ["denominator", "scoreFraction", "unscoredShare"],
} as const;
/** Calculate biosafety inspection unscored item denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    scored,
    unscored,
    excluded,
    maximumPoints,
    earnedPoints,
    includeUnscored,
  } = request;
  const compute = (): Output => {
    H.integer(scored, 1);
    H.integer(unscored, 0);
    H.integer(excluded, 0);
    H.positive(maximumPoints);
    H.domain(earnedPoints >= 0 && earnedPoints <= scored * maximumPoints);
    return {
      denominator: scored + (includeUnscored ? unscored : 0),
      scoreFraction:
        earnedPoints /
        (maximumPoints * (scored + (includeUnscored ? unscored : 0))),
      unscoredShare: unscored / (scored + unscored + excluded),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scored: 8,
    unscored: 2,
    excluded: 1,
    maximumPoints: 5,
    earnedPoints: 30,
    includeUnscored: true,
  },
  output: {
    denominator: 10,
    scoreFraction: 0.6,
    unscoredShare: 0.18181818181818182,
  },
} satisfies ToolExample<Input, Output>;
export const biosafetyInspectionUnscoredItemDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosafety/biosafety-inspection-unscored-item-denominator",
      title: "Biosafety Inspection Unscored Item Denominator Tool",
      description:
        "Calculate biosafety inspection unscored item denominator from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scored: { type: "integer", minimum: 1 },
          unscored: { type: "integer", minimum: 0 },
          excluded: { type: "integer", minimum: 0 },
          maximumPoints: { type: "number", exclusiveMinimum: 0 },
          earnedPoints: { type: "number", minimum: 0 },
          includeUnscored: { type: "boolean" },
        },
        required: [
          "scored",
          "unscored",
          "excluded",
          "maximumPoints",
          "earnedPoints",
          "includeUnscored",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          scoreFraction: { type: "number" },
          unscoredShare: { type: "number" },
        },
        required: ["denominator", "scoreFraction", "unscoredShare"],
      },
      ports: {
        inputs: [
          {
            id: "scored",
            label: "Scored",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unscored",
            label: "Unscored",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excluded",
            label: "Excluded",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "maximumPoints",
            label: "Maximum Points",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "earnedPoints",
            label: "Earned Points",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "includeUnscored",
            label: "Include Unscored",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          {
            id: "scoreFraction",
            label: "Score Fraction",
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "unscoredShare",
            label: "Unscored Share",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosafetyInspectionUnscoredItemDenominatorTool.execute;
export default biosafetyInspectionUnscoredItemDenominatorTool;
