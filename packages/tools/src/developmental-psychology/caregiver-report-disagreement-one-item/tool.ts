import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRating: number;
  readonly secondRating: number;
  readonly scaleMinimum: number;
  readonly scaleMaximum: number;
};
export type Output = {
  readonly signedDifference: number;
  readonly absoluteDifference: number;
  readonly rangeNormalizedDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRating: { type: "number" },
    secondRating: { type: "number" },
    scaleMinimum: { type: "number" },
    scaleMaximum: { type: "number" },
  },
  required: ["firstRating", "secondRating", "scaleMinimum", "scaleMaximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDifference: { type: "number" },
    absoluteDifference: { type: "number" },
    rangeNormalizedDifference: { type: "number" },
  },
  required: [
    "signedDifference",
    "absoluteDifference",
    "rangeNormalizedDifference",
  ],
} as const;
/** Descriptive disagreement for one shared rating scale; no interpretation of child behavior or caregiver accuracy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstRating, secondRating, scaleMinimum, scaleMaximum } = request;
  const compute = (): Output => {
    H.domain(
      scaleMaximum > scaleMinimum &&
        firstRating >= scaleMinimum &&
        firstRating <= scaleMaximum &&
        secondRating >= scaleMinimum &&
        secondRating <= scaleMaximum,
    );
    return {
      signedDifference: secondRating - firstRating,
      absoluteDifference: Math.abs(secondRating - firstRating),
      rangeNormalizedDifference:
        Math.abs(secondRating - firstRating) / (scaleMaximum - scaleMinimum),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstRating: 2, secondRating: 4, scaleMinimum: 1, scaleMaximum: 5 },
  output: {
    signedDifference: 2,
    absoluteDifference: 2,
    rangeNormalizedDifference: 0.5,
  },
} satisfies ToolExample<Input, Output>;
export const caregiverReportDisagreementOneItemTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/caregiver-report-disagreement-one-item",
    title: "Caregiver Report Disagreement One Item Tool",
    description:
      "Descriptive disagreement for one shared rating scale; no interpretation of child behavior or caregiver accuracy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRating: { type: "number" },
        secondRating: { type: "number" },
        scaleMinimum: { type: "number" },
        scaleMaximum: { type: "number" },
      },
      required: ["firstRating", "secondRating", "scaleMinimum", "scaleMaximum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDifference: { type: "number" },
        absoluteDifference: { type: "number" },
        rangeNormalizedDifference: { type: "number" },
      },
      required: [
        "signedDifference",
        "absoluteDifference",
        "rangeNormalizedDifference",
      ],
    },
    ports: {
      inputs: [
        {
          id: "firstRating",
          label: "First Rating",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondRating",
          label: "Second Rating",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleMinimum",
          label: "Scale Minimum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleMaximum",
          label: "Scale Maximum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedDifference",
          label: "Signed Difference",
          valueType: { type: "number" },
        },
        {
          id: "absoluteDifference",
          label: "Absolute Difference",
          valueType: { type: "number" },
        },
        {
          id: "rangeNormalizedDifference",
          label: "Range Normalized Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = caregiverReportDisagreementOneItemTool.execute;
export default caregiverReportDisagreementOneItemTool;
