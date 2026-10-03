import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly correct: number;
  readonly incorrect: number;
  readonly omitted: number;
  readonly unscorable: number;
  readonly includeOmitted: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly fraction: number;
  readonly unscorableShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correct: { type: "integer", minimum: 0 },
    incorrect: { type: "integer", minimum: 0 },
    omitted: { type: "integer", minimum: 0 },
    unscorable: { type: "integer", minimum: 0 },
    includeOmitted: { type: "boolean" },
  },
  required: ["correct", "incorrect", "omitted", "unscorable", "includeOmitted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    fraction: { type: "number" },
    unscorableShare: { type: "number" },
  },
  required: ["denominator", "fraction", "unscorableShare"],
} as const;
/** Calculate articulation target correct opportunity share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { correct, incorrect, omitted, unscorable, includeOmitted } = request;
  const compute = (): Output => {
    H.integer(correct, 0);
    H.integer(incorrect, 0);
    H.integer(omitted, 0);
    H.integer(unscorable, 0);
    H.domain(correct + incorrect > 0);
    return {
      denominator: correct + incorrect + (includeOmitted ? omitted : 0),
      fraction:
        correct / (correct + incorrect + (includeOmitted ? omitted : 0)),
      unscorableShare:
        unscorable / (correct + incorrect + omitted + unscorable),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    correct: 30,
    incorrect: 10,
    omitted: 5,
    unscorable: 5,
    includeOmitted: true,
  },
  output: {
    denominator: 45,
    fraction: 0.6666666666666666,
    unscorableShare: 0.1,
  },
} satisfies ToolExample<Input, Output>;
export const articulationTargetCorrectOpportunityShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "speech-therapy/articulation-target-correct-opportunity-share",
      title: "Articulation Target Correct Opportunity Share Tool",
      description:
        "Calculate articulation target correct opportunity share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correct: { type: "integer", minimum: 0 },
          incorrect: { type: "integer", minimum: 0 },
          omitted: { type: "integer", minimum: 0 },
          unscorable: { type: "integer", minimum: 0 },
          includeOmitted: { type: "boolean" },
        },
        required: [
          "correct",
          "incorrect",
          "omitted",
          "unscorable",
          "includeOmitted",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          fraction: { type: "number" },
          unscorableShare: { type: "number" },
        },
        required: ["denominator", "fraction", "unscorableShare"],
      },
      ports: {
        inputs: [
          {
            id: "correct",
            label: "Correct",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "incorrect",
            label: "Incorrect",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "omitted",
            label: "Omitted",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unscorable",
            label: "Unscorable",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "includeOmitted",
            label: "Include Omitted",
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
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
          {
            id: "unscorableShare",
            label: "Unscorable Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = articulationTargetCorrectOpportunityShareTool.execute;
export default articulationTargetCorrectOpportunityShareTool;
