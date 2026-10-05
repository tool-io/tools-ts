import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly validBallots: number;
  readonly invalidBallots: number;
  readonly registeredVoters: number;
  readonly includeInvalid: boolean;
};
export type Output = {
  readonly turnoutFraction: number;
  readonly numeratorBallots: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validBallots: { type: "integer", minimum: 0 },
    invalidBallots: { type: "integer", minimum: 0 },
    registeredVoters: { type: "integer", minimum: 1 },
    includeInvalid: { type: "boolean" },
  },
  required: [
    "validBallots",
    "invalidBallots",
    "registeredVoters",
    "includeInvalid",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    turnoutFraction: { type: "number" },
    numeratorBallots: { type: "integer" },
  },
  required: ["turnoutFraction", "numeratorBallots"],
} as const;
/** Make the ballot-count convention explicit when calculating registered-voter turnout. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { validBallots, invalidBallots, registeredVoters, includeInvalid } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(registeredVoters) &&
        registeredVoters >= 1 &&
        registeredVoters <= Number.MAX_SAFE_INTEGER,
      "registeredVoters",
    ),
      registeredVoters);
    (H.domain(
      Number.isSafeInteger(validBallots) &&
        validBallots >= 0 &&
        validBallots <= registeredVoters,
      "validBallots",
    ),
      validBallots);
    (H.domain(
      Number.isSafeInteger(invalidBallots) &&
        invalidBallots >= 0 &&
        invalidBallots <= registeredVoters - validBallots,
      "invalidBallots",
    ),
      invalidBallots);
    return {
      turnoutFraction:
        (validBallots + (includeInvalid ? invalidBallots : 0)) /
        registeredVoters,
      numeratorBallots: validBallots + (includeInvalid ? invalidBallots : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    validBallots: 700,
    invalidBallots: 50,
    registeredVoters: 1000,
    includeInvalid: true,
  },
  output: { turnoutFraction: 0.75, numeratorBallots: 750 },
} satisfies ToolExample<Input, Output>;
export const turnoutInvalidBallotDenominatorChoiceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "political-science/turnout-invalid-ballot-denominator-choice",
      title: "Turnout Invalid Ballot Denominator Choice Tool",
      description:
        "Make the ballot-count convention explicit when calculating registered-voter turnout.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          validBallots: { type: "integer", minimum: 0 },
          invalidBallots: { type: "integer", minimum: 0 },
          registeredVoters: { type: "integer", minimum: 1 },
          includeInvalid: { type: "boolean" },
        },
        required: [
          "validBallots",
          "invalidBallots",
          "registeredVoters",
          "includeInvalid",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          turnoutFraction: { type: "number" },
          numeratorBallots: { type: "integer" },
        },
        required: ["turnoutFraction", "numeratorBallots"],
      },
      ports: {
        inputs: [
          {
            id: "validBallots",
            label: "Valid Ballots",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "invalidBallots",
            label: "Invalid Ballots",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "registeredVoters",
            label: "Registered Voters",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "includeInvalid",
            label: "Include Invalid",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "turnoutFraction",
            label: "Turnout Fraction",
            valueType: { type: "number" },
          },
          {
            id: "numeratorBallots",
            label: "Numerator Ballots",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = turnoutInvalidBallotDenominatorChoiceTool.execute;
export default turnoutInvalidBallotDenominatorChoiceTool;
