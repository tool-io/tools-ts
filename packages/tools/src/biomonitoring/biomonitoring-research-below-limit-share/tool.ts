import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measured: number;
  readonly leftCensored: number;
  readonly rightCensored: number;
  readonly missing: number;
  readonly includeMissing: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly belowShare: number;
  readonly measuredShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measured: { type: "integer", minimum: 0 },
    leftCensored: { type: "integer", minimum: 0 },
    rightCensored: { type: "integer", minimum: 0 },
    missing: { type: "integer", minimum: 0 },
    includeMissing: { type: "boolean" },
  },
  required: [
    "measured",
    "leftCensored",
    "rightCensored",
    "missing",
    "includeMissing",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    belowShare: { type: "number" },
    measuredShare: { type: "number" },
  },
  required: ["denominator", "belowShare", "measuredShare"],
} as const;
/** Calculate biomonitoring research below limit share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measured, leftCensored, rightCensored, missing, includeMissing } =
    request;
  const compute = (): Output => {
    H.integer(measured, 0);
    H.integer(leftCensored, 0);
    H.integer(rightCensored, 0);
    H.integer(missing, 0);
    H.domain(measured + leftCensored + rightCensored > 0);
    return {
      denominator:
        measured +
        leftCensored +
        rightCensored +
        (includeMissing ? missing : 0),
      belowShare:
        leftCensored /
        (measured +
          leftCensored +
          rightCensored +
          (includeMissing ? missing : 0)),
      measuredShare:
        measured /
        (measured +
          leftCensored +
          rightCensored +
          (includeMissing ? missing : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measured: 70,
    leftCensored: 20,
    rightCensored: 10,
    missing: 5,
    includeMissing: false,
  },
  output: { denominator: 100, belowShare: 0.2, measuredShare: 0.7 },
} satisfies ToolExample<Input, Output>;
export const biomonitoringResearchBelowLimitShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biomonitoring/biomonitoring-research-below-limit-share",
      title: "Biomonitoring Research Below Limit Share Tool",
      description:
        "Calculate biomonitoring research below limit share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measured: { type: "integer", minimum: 0 },
          leftCensored: { type: "integer", minimum: 0 },
          rightCensored: { type: "integer", minimum: 0 },
          missing: { type: "integer", minimum: 0 },
          includeMissing: { type: "boolean" },
        },
        required: [
          "measured",
          "leftCensored",
          "rightCensored",
          "missing",
          "includeMissing",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          belowShare: { type: "number" },
          measuredShare: { type: "number" },
        },
        required: ["denominator", "belowShare", "measuredShare"],
      },
      ports: {
        inputs: [
          {
            id: "measured",
            label: "Measured",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "leftCensored",
            label: "Left Censored",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "rightCensored",
            label: "Right Censored",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "missing",
            label: "Missing",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "includeMissing",
            label: "Include Missing",
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
            id: "belowShare",
            label: "Below Share",
            valueType: { type: "number" },
          },
          {
            id: "measuredShare",
            label: "Measured Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biomonitoringResearchBelowLimitShareTool.execute;
export default biomonitoringResearchBelowLimitShareTool;
