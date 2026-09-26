import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly positive: number;
  readonly screened: number;
  readonly invited: number;
  readonly confirmed: number;
};
export type Output = {
  readonly screenPositivity: number;
  readonly invitationYield: number;
  readonly confirmedPositiveFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positive: { type: "integer", minimum: 1 },
    screened: { type: "integer", minimum: 1 },
    invited: { type: "integer", minimum: 1 },
    confirmed: { type: "integer", minimum: 0 },
  },
  required: ["positive", "screened", "invited", "confirmed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    screenPositivity: { type: "number" },
    invitationYield: { type: "number" },
    confirmedPositiveFraction: { type: "number" },
  },
  required: [
    "screenPositivity",
    "invitationYield",
    "confirmedPositiveFraction",
  ],
} as const;
/** Calculate screening positive yield denominator choice from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { positive, screened, invited, confirmed } = request;
  const compute = (): Output => {
    H.integer(invited, 1);
    H.integer(screened, 1, invited);
    H.integer(positive, 1, screened);
    H.integer(confirmed, 0, positive);
    return {
      screenPositivity: positive / screened,
      invitationYield: confirmed / invited,
      confirmedPositiveFraction: confirmed / positive,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { positive: 20, screened: 100, invited: 200, confirmed: 10 },
  output: {
    screenPositivity: 0.2,
    invitationYield: 0.05,
    confirmedPositiveFraction: 0.5,
  },
} satisfies ToolExample<Input, Output>;
export const screeningPositiveYieldDenominatorChoiceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epidemiology/screening-positive-yield-denominator-choice",
      title: "Screening Positive Yield Denominator Choice Tool",
      description:
        "Calculate screening positive yield denominator choice from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          positive: { type: "integer", minimum: 1 },
          screened: { type: "integer", minimum: 1 },
          invited: { type: "integer", minimum: 1 },
          confirmed: { type: "integer", minimum: 0 },
        },
        required: ["positive", "screened", "invited", "confirmed"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          screenPositivity: { type: "number" },
          invitationYield: { type: "number" },
          confirmedPositiveFraction: { type: "number" },
        },
        required: [
          "screenPositivity",
          "invitationYield",
          "confirmedPositiveFraction",
        ],
      },
      ports: {
        inputs: [
          {
            id: "positive",
            label: "Positive",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "screened",
            label: "Screened",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "invited",
            label: "Invited",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "confirmed",
            label: "Confirmed",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "screenPositivity",
            label: "Screen Positivity",
            valueType: { type: "number" },
          },
          {
            id: "invitationYield",
            label: "Invitation Yield",
            valueType: { type: "number" },
          },
          {
            id: "confirmedPositiveFraction",
            label: "Confirmed Positive Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = screeningPositiveYieldDenominatorChoiceTool.execute;
export default screeningPositiveYieldDenominatorChoiceTool;
