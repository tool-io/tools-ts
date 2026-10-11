import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly yesVotes: number;
  readonly noVotes: number;
  readonly blankVotes: number;
  readonly includeBlank: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly yesShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yesVotes: { type: "integer", minimum: 0 },
    noVotes: { type: "integer", minimum: 0 },
    blankVotes: { type: "integer", minimum: 0 },
    includeBlank: { type: "boolean" },
  },
  required: ["yesVotes", "noVotes", "blankVotes", "includeBlank"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    yesShare: { type: "number" },
  },
  required: ["denominator", "yesShare"],
} as const;
/** Normalize explicit referendum yes votes under a supplied blank-ballot denominator policy without applying electoral rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { yesVotes, noVotes, blankVotes, includeBlank } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(yesVotes) &&
        yesVotes >= 0 &&
        yesVotes <= Number.MAX_SAFE_INTEGER,
      "yesVotes",
    ),
      yesVotes);
    (H.domain(
      Number.isSafeInteger(noVotes) &&
        noVotes >= 0 &&
        noVotes <= Number.MAX_SAFE_INTEGER,
      "noVotes",
    ),
      noVotes);
    (H.domain(
      Number.isSafeInteger(blankVotes) &&
        blankVotes >= 0 &&
        blankVotes <= Number.MAX_SAFE_INTEGER,
      "blankVotes",
    ),
      blankVotes);
    return (() => {
      const denominator = Number(
        BigInt(yesVotes) +
          BigInt(noVotes) +
          (includeBlank ? BigInt(blankVotes) : 0n),
      );
      H.domain(
        Number.isSafeInteger(denominator) && denominator > 0,
        "yesVotes",
      );
      return { denominator, yesShare: yesVotes / denominator };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { yesVotes: 40, noVotes: 40, blankVotes: 20, includeBlank: true },
  output: { denominator: 100, yesShare: 0.4 },
} satisfies ToolExample<Input, Output>;
export const referendumBlankBallotDenominatorRuleTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["political-science", "political science", "social sciences"],
        keywords: ["political science", "social sciences"],
      },
      id: "political-science/referendum-blank-ballot-denominator-rule",
      title: "Referendum Blank Ballot Denominator Rule",
      description:
        "Normalize explicit referendum yes votes under a supplied blank-ballot denominator policy without applying electoral rules.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          yesVotes: { type: "integer", minimum: 0 },
          noVotes: { type: "integer", minimum: 0 },
          blankVotes: { type: "integer", minimum: 0 },
          includeBlank: { type: "boolean" },
        },
        required: ["yesVotes", "noVotes", "blankVotes", "includeBlank"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          yesShare: { type: "number" },
        },
        required: ["denominator", "yesShare"],
      },
      ports: {
        inputs: [
          {
            id: "yesVotes",
            label: "Yes Votes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "noVotes",
            label: "No Votes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "blankVotes",
            label: "Blank Votes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "includeBlank",
            label: "Include Blank",
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
          { id: "yesShare", label: "Yes Share", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = referendumBlankBallotDenominatorRuleTool.execute;
export default referendumBlankBallotDenominatorRuleTool;
