import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThreeLinesRolesInput = {
  readonly assuranceFunctions: ReadonlyArray<string>;
  readonly internalAuditFunctions: ReadonlyArray<string>;
  readonly managementFunctions: ReadonlyArray<string>;
};

export type ThreeLinesRolesOutput = {
  readonly overlapCount: number;
  readonly overlaps: ReadonlyArray<string>;
  readonly segregationSatisfied: boolean;
};

const normalize = (
  values: ReadonlyArray<string>,
  field: string,
): Set<string> => {
  if (!Array.isArray(values))
    simpleError(field, `${field} must be an array.`, "role_list_required");
  return new Set(
    values.map((value, index) => {
      if (typeof value !== "string" || value.trim() === "")
        simpleError(
          `${field}.${index}`,
          "Role labels must be nonempty strings.",
          "invalid_role",
        );
      return value.trim().toLowerCase();
    }),
  );
};

export const checkThreeLinesRoleSeparation = (
  input: ThreeLinesRolesInput,
): ThreeLinesRolesOutput => {
  const management = normalize(
    input.managementFunctions,
    "managementFunctions",
  );
  const internalAudit = normalize(
    input.internalAuditFunctions,
    "internalAuditFunctions",
  );
  const assurance = normalize(input.assuranceFunctions, "assuranceFunctions");
  const overlaps = [...management]
    .filter((role) => internalAudit.has(role) || assurance.has(role))
    .sort();
  for (const role of internalAudit)
    if (assurance.has(role) && !management.has(role)) overlaps.push(role);
  const uniqueOverlaps = [...new Set(overlaps)].sort();
  return {
    overlapCount: uniqueOverlaps.length,
    overlaps: uniqueOverlaps,
    segregationSatisfied: uniqueOverlaps.length === 0,
  };
};

export const threeLinesRolesExample = {
  input: {
    assuranceFunctions: ["Internal audit"],
    internalAuditFunctions: ["Risk monitoring"],
    managementFunctions: ["Risk monitoring", "Control operations"],
  },
  output: {
    overlapCount: 1,
    overlaps: ["risk monitoring"],
    segregationSatisfied: false,
  },
} satisfies ToolExample<ThreeLinesRolesInput, ThreeLinesRolesOutput>;

export const threeLinesRolesTool = createSimpleTool({
  calculate: (input) =>
    checkThreeLinesRoleSeparation({
      assuranceFunctions: input.assuranceFunctions as string[],
      internalAuditFunctions: input.internalAuditFunctions as string[],
      managementFunctions: input.managementFunctions as string[],
    }),
  description:
    "Compare normalized management, internal-audit, and assurance responsibility labels and report any role appearing in more than one line.",
  id: "auditing/three-lines-model-roles-assurance-lookup",
  inputs: [
    {
      description: "Responsibility labels assigned to the assurance line.",
      id: "assuranceFunctions",
      kind: "stringList",
      label: "Assurance functions",
    },
    {
      description: "Responsibility labels assigned to internal audit.",
      id: "internalAuditFunctions",
      kind: "stringList",
      label: "Internal audit functions",
    },
    {
      description: "Responsibility labels assigned to management.",
      id: "managementFunctions",
      kind: "stringList",
      label: "Management functions",
    },
  ],
  outputs: [
    {
      id: "overlapCount",
      kind: "integer",
      label: "Overlapping roles",
      minimum: 0,
    },
    { id: "overlaps", kind: "stringList", label: "Overlapping role labels" },
    {
      id: "segregationSatisfied",
      kind: "boolean",
      label: "Role segregation satisfied",
    },
  ],
  title: "Three Lines Model Roles Assurance Lookup",
});

export const runThreeLinesRoles = threeLinesRolesTool.execute;
export default threeLinesRolesTool;
