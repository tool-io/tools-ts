import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CamJurisdictionInput = {
  readonly auditorIndependent: boolean;
  readonly basisForInclusion: string;
  readonly entityListed: boolean;
  readonly jurisdictionRequiresCam: boolean;
  readonly requirementsMet: boolean;
};

export type CamJurisdictionOutput = {
  readonly canReport: boolean;
  readonly missingRequirements: ReadonlyArray<string>;
  readonly required: boolean;
};

export const evaluateCamJurisdictionRequirements = (
  input: CamJurisdictionInput,
): CamJurisdictionOutput => {
  for (const field of [
    "auditorIndependent",
    "entityListed",
    "jurisdictionRequiresCam",
    "requirementsMet",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  if (
    typeof input.basisForInclusion !== "string" ||
    input.basisForInclusion.trim() === ""
  )
    simpleError(
      "basisForInclusion",
      "A nonempty basis for inclusion is required.",
      "cam_basis_required",
    );
  const missingRequirements: string[] = [];
  if (input.jurisdictionRequiresCam && !input.entityListed)
    missingRequirements.push("entity_not_listed");
  if (input.jurisdictionRequiresCam && !input.auditorIndependent)
    missingRequirements.push("auditor_not_independent");
  if (input.jurisdictionRequiresCam && !input.requirementsMet)
    missingRequirements.push("requirements_not_met");
  return {
    canReport: missingRequirements.length === 0,
    missingRequirements,
    required: input.jurisdictionRequiresCam,
  };
};

export const camJurisdictionExample = {
  input: {
    auditorIndependent: true,
    basisForInclusion: "Audited financial statements",
    entityListed: false,
    jurisdictionRequiresCam: true,
    requirementsMet: true,
  },
  output: {
    canReport: false,
    missingRequirements: ["entity_not_listed"],
    required: true,
  },
} satisfies ToolExample<CamJurisdictionInput, CamJurisdictionOutput>;

export const camJurisdictionTool = createSimpleTool({
  calculate: (input) =>
    evaluateCamJurisdictionRequirements({
      auditorIndependent: input.auditorIndependent as boolean,
      basisForInclusion: input.basisForInclusion as string,
      entityListed: input.entityListed as boolean,
      jurisdictionRequiresCam: input.jurisdictionRequiresCam as boolean,
      requirementsMet: input.requirementsMet as boolean,
    }),
  description:
    "Evaluate caller-supplied jurisdiction, listing, independence, requirement, and basis facts for a key-audit-matter communication without determining applicable law.",
  id: "auditing/key-audit-matters-cam-kam-jurisdiction-crosswalk-lookup",
  inputs: [
    { id: "auditorIndependent", kind: "boolean", label: "Auditor independent" },
    { id: "basisForInclusion", kind: "string", label: "Basis for inclusion" },
    { id: "entityListed", kind: "boolean", label: "Entity listed" },
    {
      id: "jurisdictionRequiresCam",
      kind: "boolean",
      label: "Jurisdiction requires CAM",
    },
    { id: "requirementsMet", kind: "boolean", label: "Requirements met" },
  ],
  outputs: [
    { id: "canReport", kind: "boolean", label: "CAM communication supported" },
    {
      id: "missingRequirements",
      kind: "stringList",
      label: "Missing requirements",
    },
    { id: "required", kind: "boolean", label: "CAM required" },
  ],
  title: "Key Audit Matters CAM KAM Jurisdiction Crosswalk Lookup",
});

export const runCamJurisdiction = camJurisdictionTool.execute;
export default camJurisdictionTool;
