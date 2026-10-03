import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invited: number;
  readonly consented: number;
  readonly tested: number;
  readonly validResults: number;
};
export type Output = {
  readonly consentShare: number;
  readonly testAmongConsented: number;
  readonly validAmongTested: number;
  readonly validAmongInvited: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invited: { type: "integer", minimum: 1 },
    consented: { type: "integer", minimum: 1 },
    tested: { type: "integer", minimum: 1 },
    validResults: { type: "integer", minimum: 0 },
  },
  required: ["invited", "consented", "tested", "validResults"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consentShare: { type: "number" },
    testAmongConsented: { type: "number" },
    validAmongTested: { type: "number" },
    validAmongInvited: { type: "number" },
  },
  required: [
    "consentShare",
    "testAmongConsented",
    "validAmongTested",
    "validAmongInvited",
  ],
} as const;
/** Audit supplied screening participation stages without estimating test accuracy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { invited, consented, tested, validResults } = request;
  const compute = (): Output => {
    H.integer(invited, 1);
    H.integer(consented, 1, invited);
    H.integer(tested, 1, consented);
    H.integer(validResults, 0, tested);
    return {
      consentShare: consented / invited,
      testAmongConsented: tested / consented,
      validAmongTested: validResults / tested,
      validAmongInvited: validResults / invited,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { invited: 100, consented: 80, tested: 60, validResults: 54 },
  output: {
    consentShare: 0.8,
    testAmongConsented: 0.75,
    validAmongTested: 0.9,
    validAmongInvited: 0.54,
  },
} satisfies ToolExample<Input, Output>;
export const screeningProgramInvitedTestedShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-health/screening-program-invited-tested-share",
    title: "Screening Program Invited Tested Share Tool",
    description:
      "Audit supplied screening participation stages without estimating test accuracy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        invited: { type: "integer", minimum: 1 },
        consented: { type: "integer", minimum: 1 },
        tested: { type: "integer", minimum: 1 },
        validResults: { type: "integer", minimum: 0 },
      },
      required: ["invited", "consented", "tested", "validResults"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consentShare: { type: "number" },
        testAmongConsented: { type: "number" },
        validAmongTested: { type: "number" },
        validAmongInvited: { type: "number" },
      },
      required: [
        "consentShare",
        "testAmongConsented",
        "validAmongTested",
        "validAmongInvited",
      ],
    },
    ports: {
      inputs: [
        {
          id: "invited",
          label: "Invited",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "consented",
          label: "Consented",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tested",
          label: "Tested",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "validResults",
          label: "Valid Results",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "consentShare",
          label: "Consent Share",
          valueType: { type: "number" },
        },
        {
          id: "testAmongConsented",
          label: "Test Among Consented",
          valueType: { type: "number" },
        },
        {
          id: "validAmongTested",
          label: "Valid Among Tested",
          valueType: { type: "number" },
        },
        {
          id: "validAmongInvited",
          label: "Valid Among Invited",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = screeningProgramInvitedTestedShareTool.execute;
export default screeningProgramInvitedTestedShareTool;
