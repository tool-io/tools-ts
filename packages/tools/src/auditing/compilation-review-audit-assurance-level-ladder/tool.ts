import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AssuranceLevelInput = {
  readonly engagementType: "audit" | "compilation" | "preparation" | "review";
};

export type AssuranceLevelOutput = {
  readonly assuranceLevel: "limited" | "no_assurance" | "reasonable";
  readonly practitionerReportIssued: boolean;
};

export const classifyAssuranceLevel = (
  input: AssuranceLevelInput,
): AssuranceLevelOutput => {
  if (
    !["audit", "compilation", "preparation", "review"].includes(
      input.engagementType,
    )
  )
    simpleError(
      "engagementType",
      "Engagement type is invalid.",
      "invalid_engagement_type",
    );
  if (input.engagementType === "audit")
    return { assuranceLevel: "reasonable", practitionerReportIssued: true };
  if (input.engagementType === "review")
    return { assuranceLevel: "limited", practitionerReportIssued: true };
  return {
    assuranceLevel: "no_assurance",
    practitionerReportIssued: input.engagementType === "compilation",
  };
};

export const assuranceLevelExample = {
  input: { engagementType: "review" },
  output: { assuranceLevel: "limited", practitionerReportIssued: true },
} satisfies ToolExample<AssuranceLevelInput, AssuranceLevelOutput>;

export const assuranceLevelTool = createSimpleTool({
  calculate: (input) =>
    classifyAssuranceLevel({
      engagementType:
        input.engagementType as AssuranceLevelInput["engagementType"],
    }),
  description:
    "Look up the conventional assurance level for financial-statement preparation, compilation, review, and audit engagements. The engagement type determines the assurance category; an arbitrary evidence score does not change one engagement into another.",
  id: "auditing/compilation-review-audit-assurance-level-ladder",
  inputs: [
    {
      enum: ["audit", "compilation", "preparation", "review"],
      id: "engagementType",
      kind: "string",
      label: "Engagement type",
    },
  ],
  outputs: [
    {
      enum: ["limited", "no_assurance", "reasonable"],
      id: "assuranceLevel",
      kind: "string",
      label: "Assurance level",
    },
    {
      id: "practitionerReportIssued",
      kind: "boolean",
      label: "Practitioner report ordinarily issued",
    },
  ],
  title: "Compilation Review Audit Assurance Level Ladder",
});

export const runAssuranceLevel = assuranceLevelTool.execute;
export default assuranceLevelTool;
