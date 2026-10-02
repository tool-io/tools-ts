import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly candidateFraction: number;
  readonly undecidedFraction: number;
};
export type Output = {
  readonly decidedFraction: number;
  readonly conditionalSupport: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    candidateFraction: { type: "number", minimum: 0 },
    undecidedFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["candidateFraction", "undecidedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    decidedFraction: { type: "number" },
    conditionalSupport: { type: "number" },
  },
  required: ["decidedFraction", "conditionalSupport"],
} as const;
/** Calculate opinion poll undecided renormalization from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { candidateFraction, undecidedFraction } = request;
  const compute = (): Output => {
    H.domain(
      undecidedFraction >= 0 &&
        undecidedFraction < 1 &&
        candidateFraction >= 0 &&
        candidateFraction <= 1 - undecidedFraction,
    );
    return {
      decidedFraction: 1 - undecidedFraction,
      conditionalSupport: candidateFraction / (1 - undecidedFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { candidateFraction: 0.4, undecidedFraction: 0.2 },
  output: { decidedFraction: 0.8, conditionalSupport: 0.5 },
} satisfies ToolExample<Input, Output>;
export const opinionPollUndecidedRenormalizationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "political-science/opinion-poll-undecided-renormalization",
      title: "Opinion Poll Undecided Renormalization Tool",
      description:
        "Calculate opinion poll undecided renormalization from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          candidateFraction: { type: "number", minimum: 0 },
          undecidedFraction: {
            type: "number",
            minimum: 0,
            exclusiveMaximum: 1,
          },
        },
        required: ["candidateFraction", "undecidedFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          decidedFraction: { type: "number" },
          conditionalSupport: { type: "number" },
        },
        required: ["decidedFraction", "conditionalSupport"],
      },
      ports: {
        inputs: [
          {
            id: "candidateFraction",
            label: "Candidate Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "undecidedFraction",
            label: "Undecided Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "decidedFraction",
            label: "Decided Fraction",
            valueType: { type: "number" },
          },
          {
            id: "conditionalSupport",
            label: "Conditional Support",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = opinionPollUndecidedRenormalizationTool.execute;
export default opinionPollUndecidedRenormalizationTool;
