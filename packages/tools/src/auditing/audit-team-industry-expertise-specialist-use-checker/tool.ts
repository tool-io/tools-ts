import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AuditTeamExpertiseInput = {
  readonly minimumSpecialists: number;
  readonly requiredIndustry: string;
  readonly teamIndustries: ReadonlyArray<string>;
};

export type AuditTeamExpertiseOutput = {
  readonly qualifiedSpecialists: number;
  readonly requirementMet: boolean;
  readonly teamMembers: number;
};

const normalizeIndustries = (
  values: ReadonlyArray<string>,
  field: string,
): string[] => {
  if (!Array.isArray(values))
    simpleError(field, `${field} must be an array.`, "industry_list_required");
  return values.map((value, index) => {
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        `${field}.${index}`,
        "Industry labels must be nonempty strings.",
        "invalid_industry",
      );
    return value.trim().toLowerCase();
  });
};

export const countAuditTeamIndustrySpecialists = (
  input: AuditTeamExpertiseInput,
): AuditTeamExpertiseOutput => {
  if (
    typeof input.requiredIndustry !== "string" ||
    input.requiredIndustry.trim() === ""
  )
    simpleError(
      "requiredIndustry",
      "A required industry must be supplied.",
      "required_industry_required",
    );
  if (
    !Number.isSafeInteger(input.minimumSpecialists) ||
    input.minimumSpecialists < 0
  )
    simpleError(
      "minimumSpecialists",
      "The specialist minimum must be a nonnegative whole number.",
      "invalid_minimum_specialists",
    );
  const requiredIndustry = input.requiredIndustry.trim().toLowerCase();
  const qualifiedSpecialists = normalizeIndustries(
    input.teamIndustries,
    "teamIndustries",
  ).filter((industry) => industry === requiredIndustry).length;
  return {
    qualifiedSpecialists,
    requirementMet: qualifiedSpecialists >= input.minimumSpecialists,
    teamMembers: input.teamIndustries.length,
  };
};

export const auditTeamExpertiseExample = {
  input: {
    minimumSpecialists: 2,
    requiredIndustry: "Manufacturing",
    teamIndustries: ["manufacturing", "Technology", "manufacturing"],
  },
  output: { qualifiedSpecialists: 2, requirementMet: true, teamMembers: 3 },
} satisfies ToolExample<AuditTeamExpertiseInput, AuditTeamExpertiseOutput>;

export const auditTeamExpertiseTool = createSimpleTool({
  calculate: (input) =>
    countAuditTeamIndustrySpecialists({
      minimumSpecialists: input.minimumSpecialists as number,
      requiredIndustry: input.requiredIndustry as string,
      teamIndustries: input.teamIndustries as string[],
    }),
  description:
    "Count audit team members whose normalized industry label matches a required industry and compare that count with a minimum specialist requirement.",
  id: "auditing/audit-team-industry-expertise-specialist-use-checker",
  inputs: [
    {
      description: "Minimum number of matching industry specialists required.",
      id: "minimumSpecialists",
      kind: "integer",
      label: "Minimum specialists",
      minimum: 0,
    },
    {
      description: "Industry expertise needed for the engagement.",
      id: "requiredIndustry",
      kind: "string",
      label: "Required industry",
    },
    {
      description: "One industry label for each audit team member.",
      id: "teamIndustries",
      kind: "stringList",
      label: "Team industries",
    },
  ],
  outputs: [
    {
      id: "qualifiedSpecialists",
      kind: "integer",
      label: "Qualified specialists",
      minimum: 0,
    },
    { id: "requirementMet", kind: "boolean", label: "Requirement met" },
    { id: "teamMembers", kind: "integer", label: "Team members", minimum: 0 },
  ],
  title: "Audit Team Industry Expertise Specialist Use Checker",
});

export const runAuditTeamExpertise = auditTeamExpertiseTool.execute;
export default auditTeamExpertiseTool;
