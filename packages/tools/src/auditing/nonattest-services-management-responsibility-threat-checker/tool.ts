import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NonattestServiceInput = {
  readonly auditorReportsPolicy: boolean;
  readonly managementDesignatesDecisionMaker: boolean;
  readonly safeguardCount: number;
  readonly servicePreapproved: boolean;
  readonly serviceType: string;
};

export type NonattestServiceOutput = {
  readonly managementResponsibilityThreatReduced: boolean;
  readonly missingSafeguards: ReadonlyArray<string>;
  readonly safeguardCount: number;
};

export const assessNonattestServiceThreat = (
  input: NonattestServiceInput,
): NonattestServiceOutput => {
  if (typeof input.serviceType !== "string" || input.serviceType.trim() === "")
    simpleError(
      "serviceType",
      "A nonempty nonattest-service type is required.",
      "service_type_required",
    );
  for (const field of [
    "auditorReportsPolicy",
    "managementDesignatesDecisionMaker",
    "servicePreapproved",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  if (!Number.isSafeInteger(input.safeguardCount) || input.safeguardCount < 0)
    simpleError(
      "safeguardCount",
      "Safeguard count must be a nonnegative whole number.",
      "invalid_safeguard_count",
    );
  const missingSafeguards: string[] = [];
  if (!input.servicePreapproved)
    missingSafeguards.push("service_not_preapproved");
  if (!input.managementDesignatesDecisionMaker)
    missingSafeguards.push("management_decision_maker_not_designated");
  if (!input.auditorReportsPolicy)
    missingSafeguards.push("policy_not_reported_to_auditor");
  if (input.safeguardCount < 2)
    missingSafeguards.push("fewer_than_two_safeguards");
  return {
    managementResponsibilityThreatReduced: missingSafeguards.length === 0,
    missingSafeguards,
    safeguardCount: input.safeguardCount,
  };
};

export const nonattestServiceExample = {
  input: {
    auditorReportsPolicy: true,
    managementDesignatesDecisionMaker: true,
    safeguardCount: 2,
    servicePreapproved: true,
    serviceType: "Census data implementation",
  },
  output: {
    managementResponsibilityThreatReduced: true,
    missingSafeguards: [],
    safeguardCount: 2,
  },
} satisfies ToolExample<NonattestServiceInput, NonattestServiceOutput>;

export const nonattestServiceTool = createSimpleTool({
  calculate: (input) =>
    assessNonattestServiceThreat({
      auditorReportsPolicy: input.auditorReportsPolicy as boolean,
      managementDesignatesDecisionMaker:
        input.managementDesignatesDecisionMaker as boolean,
      safeguardCount: input.safeguardCount as number,
      servicePreapproved: input.servicePreapproved as boolean,
      serviceType: input.serviceType as string,
    }),
  description:
    "Check four explicit nonattest-service safeguards and report missing preapproval, management decision ownership, auditor reporting, or safeguard count.",
  id: "auditing/nonattest-services-management-responsibility-threat-checker",
  inputs: [
    {
      id: "auditorReportsPolicy",
      kind: "boolean",
      label: "Auditor reports policy",
    },
    {
      id: "managementDesignatesDecisionMaker",
      kind: "boolean",
      label: "Management designates decision maker",
    },
    {
      description:
        "Number of additional safeguards implemented for the service.",
      id: "safeguardCount",
      kind: "integer",
      label: "Safeguard count",
      minimum: 0,
    },
    {
      id: "servicePreapproved",
      kind: "boolean",
      label: "Service preapproved",
    },
    { id: "serviceType", kind: "string", label: "Service type" },
  ],
  outputs: [
    {
      id: "managementResponsibilityThreatReduced",
      kind: "boolean",
      label: "Management responsibility threat reduced",
    },
    {
      id: "missingSafeguards",
      kind: "stringList",
      label: "Missing safeguards",
    },
    {
      id: "safeguardCount",
      kind: "integer",
      label: "Safeguard count",
      minimum: 0,
    },
  ],
  title: "Nonattest Services Management Responsibility Threat Checker",
});

export const runNonattestService = nonattestServiceTool.execute;
export default nonattestServiceTool;
