import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ElectronicConfirmationReliabilityInput = {
  readonly auditTrailCaptured: boolean;
  readonly responseDirect: boolean;
  readonly senderIndependent: boolean;
  readonly sourceType: "email_domain" | "management_portal" | "paper_mail";
  readonly recipientVerified: boolean;
};

export type ElectronicConfirmationReliabilityOutput = {
  readonly assessment: "conditional" | "strong" | "weak";
  readonly criteriaMet: number;
  readonly criterionCount: number;
};

export const assessElectronicConfirmationReliability = (
  input: ElectronicConfirmationReliabilityInput,
): ElectronicConfirmationReliabilityOutput => {
  const criteria: readonly (readonly [string, boolean])[] = [
    ["sender independent", input.senderIndependent],
    ["recipient verified", input.recipientVerified],
    ["response direct", input.responseDirect],
    ["audit trail captured", input.auditTrailCaptured],
  ];
  for (const [name, present] of criteria)
    if (typeof present !== "boolean")
      simpleError(
        name.replaceAll(" ", ""),
        `${name} must be a boolean.`,
        "boolean_field_required",
      );
  if (
    !["email_domain", "management_portal", "paper_mail"].includes(
      input.sourceType,
    )
  )
    simpleError(
      "sourceType",
      "Confirmation source type is invalid.",
      "invalid_source_type",
    );
  const criteriaMet = criteria.filter(([, present]) => present).length;
  return {
    assessment:
      criteriaMet === criteria.length &&
      input.sourceType !== "management_portal"
        ? "strong"
        : criteriaMet >= 2
          ? "conditional"
          : "weak",
    criteriaMet,
    criterionCount: criteria.length,
  };
};

export const electronicConfirmationReliabilityExample = {
  input: {
    auditTrailCaptured: true,
    responseDirect: true,
    recipientVerified: true,
    senderIndependent: true,
    sourceType: "email_domain",
  },
  output: { assessment: "strong", criteriaMet: 4, criterionCount: 4 },
} satisfies ToolExample<
  ElectronicConfirmationReliabilityInput,
  ElectronicConfirmationReliabilityOutput
>;

export const electronicConfirmationReliabilityTool = createSimpleTool({
  calculate: (input) =>
    assessElectronicConfirmationReliability({
      auditTrailCaptured: input.auditTrailCaptured as boolean,
      responseDirect: input.responseDirect as boolean,
      recipientVerified: input.recipientVerified as boolean,
      senderIndependent: input.senderIndependent as boolean,
      sourceType:
        input.sourceType as ElectronicConfirmationReliabilityInput["sourceType"],
    }),
  description:
    "Assess supplied electronic-confirmation independence, verification, direct-response, and audit-trail facts without treating any channel as inherently reliable.",
  id: "auditing/electronic-confirmation-direct-source-reliability-checker",
  inputs: [
    {
      id: "auditTrailCaptured",
      kind: "boolean",
      label: "Audit trail captured",
    },
    { id: "responseDirect", kind: "boolean", label: "Response direct" },
    {
      id: "recipientVerified",
      kind: "boolean",
      label: "Recipient verified",
    },
    {
      id: "senderIndependent",
      kind: "boolean",
      label: "Sender independent",
    },
    {
      enum: ["email_domain", "management_portal", "paper_mail"],
      id: "sourceType",
      kind: "string",
      label: "Source type",
    },
  ],
  outputs: [
    {
      enum: ["conditional", "strong", "weak"],
      id: "assessment",
      kind: "string",
      label: "Reliability assessment",
    },
    {
      id: "criteriaMet",
      kind: "integer",
      label: "Criteria met",
      minimum: 0,
    },
    {
      id: "criterionCount",
      kind: "integer",
      label: "Criteria checked",
      minimum: 4,
    },
  ],
  title: "Electronic Confirmation Direct Source Reliability Checker",
});

export const runElectronicConfirmationReliability =
  electronicConfirmationReliabilityTool.execute;
export default electronicConfirmationReliabilityTool;
