import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NonresponseProcedureInput = {
  readonly alternativeProcedures: ReadonlyArray<string>;
  readonly confirmationStatus:
    "nonresponse" | "partial_response" | "response_received";
  readonly remainingResponses: number;
  readonly secondRequestSent: boolean;
};

export type NonresponseProcedureOutput = {
  readonly action:
    | "document_alternatives"
    | "obtain_response"
    | "resolve_response"
    | "send_second_request";
  readonly alternativeCount: number;
  readonly complete: boolean;
};

export const planNonresponseProcedures = (
  input: NonresponseProcedureInput,
): NonresponseProcedureOutput => {
  if (
    !Number.isSafeInteger(input.remainingResponses) ||
    input.remainingResponses < 0
  )
    simpleError(
      "remainingResponses",
      "Remaining responses must be a nonnegative whole number.",
      "invalid_remaining_responses",
    );
  if (typeof input.secondRequestSent !== "boolean")
    simpleError(
      "secondRequestSent",
      "Second-request status must be a boolean.",
      "boolean_field_required",
    );
  if (!Array.isArray(input.alternativeProcedures))
    simpleError(
      "alternativeProcedures",
      "Alternative procedures must be an array.",
      "alternative_procedures_required",
    );
  for (const [index, procedure] of input.alternativeProcedures.entries())
    if (typeof procedure !== "string" || procedure.trim() === "")
      simpleError(
        `alternativeProcedures.${index}`,
        "Alternative procedures must be nonempty labels.",
        "invalid_alternative_procedure",
      );
  const alternativeCount = input.alternativeProcedures.length;
  if (input.remainingResponses > 0)
    return {
      action: input.secondRequestSent
        ? "resolve_response"
        : "send_second_request",
      alternativeCount,
      complete: false,
    };
  return {
    action: "document_alternatives",
    alternativeCount,
    complete:
      input.confirmationStatus !== "response_received" && alternativeCount > 0,
  };
};

export const nonresponseProcedureExample = {
  input: {
    alternativeProcedures: [],
    confirmationStatus: "nonresponse",
    remainingResponses: 1,
    secondRequestSent: false,
  },
  output: {
    action: "send_second_request",
    alternativeCount: 0,
    complete: false,
  },
} satisfies ToolExample<NonresponseProcedureInput, NonresponseProcedureOutput>;

export const nonresponseProcedureTool = createSimpleTool({
  calculate: (input) =>
    planNonresponseProcedures({
      alternativeProcedures: input.alternativeProcedures as string[],
      confirmationStatus:
        input.confirmationStatus as NonresponseProcedureInput["confirmationStatus"],
      remainingResponses: input.remainingResponses as number,
      secondRequestSent: input.secondRequestSent as boolean,
    }),
  description:
    "Select the next confirmation follow-up or require documented alternative procedures when no responses remain outstanding.",
  id: "auditing/nonresponse-alternative-procedures-second-request-steps",
  inputs: [
    {
      description:
        "Alternative procedures available for nonresponding balances.",
      id: "alternativeProcedures",
      kind: "stringList",
      label: "Alternative procedures",
    },
    {
      enum: ["nonresponse", "partial_response", "response_received"],
      id: "confirmationStatus",
      kind: "string",
      label: "Confirmation status",
    },
    {
      description: "Number of confirmation responses still outstanding.",
      id: "remainingResponses",
      kind: "integer",
      label: "Remaining responses",
      minimum: 0,
    },
    {
      id: "secondRequestSent",
      kind: "boolean",
      label: "Second request sent",
    },
  ],
  outputs: [
    {
      enum: [
        "document_alternatives",
        "obtain_response",
        "resolve_response",
        "send_second_request",
      ],
      id: "action",
      kind: "string",
      label: "Next action",
    },
    {
      id: "alternativeCount",
      kind: "integer",
      label: "Alternative procedures",
      minimum: 0,
    },
    { id: "complete", kind: "boolean", label: "Follow-up complete" },
  ],
  title: "Nonresponse Alternative Procedures Second Request Steps",
});

export const runNonresponseProcedure = nonresponseProcedureTool.execute;
export default nonresponseProcedureTool;
