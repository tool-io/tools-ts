import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShellCompanyIndicatorInput = {
  readonly employeeCount: number;
  readonly nomineeCount: number;
  readonly registeredAddressSharedCount: number;
  readonly registrationAgeDays: number;
  readonly scoreThreshold: number;
};

export type ShellCompanyIndicatorOutput = {
  readonly highIndicatorRisk: boolean;
  readonly indicatorCount: number;
  readonly indicatorsPresent: ReadonlyArray<string>;
  readonly riskScore: number;
};

export const scoreShellCompanyIndicators = (
  input: ShellCompanyIndicatorInput,
): ShellCompanyIndicatorOutput => {
  for (const [field, value] of [
    ["employeeCount", input.employeeCount],
    ["nomineeCount", input.nomineeCount],
    ["registeredAddressSharedCount", input.registeredAddressSharedCount],
    ["registrationAgeDays", input.registrationAgeDays],
  ] as const)
    if (!Number.isSafeInteger(value) || value < 0)
      simpleError(
        field,
        `${field} must be a nonnegative whole number.`,
        "invalid_indicator_count",
      );
  if (
    !Number.isFinite(input.scoreThreshold) ||
    input.scoreThreshold < 0 ||
    input.scoreThreshold > 100
  )
    simpleError(
      "scoreThreshold",
      "Risk-score threshold must be from 0 through 100.",
      "invalid_score_threshold",
    );
  const indicatorsPresent: string[] = [];
  if (input.registrationAgeDays < 365)
    indicatorsPresent.push("recent_registration");
  if (input.nomineeCount > 0) indicatorsPresent.push("nominee_present");
  if (input.employeeCount === 0) indicatorsPresent.push("no_employees");
  if (input.registeredAddressSharedCount > 0)
    indicatorsPresent.push("shared_registered_address");
  return {
    highIndicatorRisk: indicatorsPresent.length * 25 >= input.scoreThreshold,
    indicatorCount: indicatorsPresent.length,
    indicatorsPresent,
    riskScore: indicatorsPresent.length * 25,
  };
};

export const shellCompanyIndicatorExample = {
  input: {
    employeeCount: 0,
    nomineeCount: 1,
    registeredAddressSharedCount: 2,
    registrationAgeDays: 180,
    scoreThreshold: 50,
  },
  output: {
    highIndicatorRisk: true,
    indicatorCount: 4,
    indicatorsPresent: [
      "recent_registration",
      "nominee_present",
      "no_employees",
      "shared_registered_address",
    ],
    riskScore: 100,
  },
} satisfies ToolExample<
  ShellCompanyIndicatorInput,
  ShellCompanyIndicatorOutput
>;

export const shellCompanyIndicatorTool = createSimpleTool({
  calculate: (input) =>
    scoreShellCompanyIndicators({
      employeeCount: input.employeeCount as number,
      nomineeCount: input.nomineeCount as number,
      registeredAddressSharedCount:
        input.registeredAddressSharedCount as number,
      registrationAgeDays: input.registrationAgeDays as number,
      scoreThreshold: input.scoreThreshold as number,
    }),
  description:
    "Score four caller-supplied shell-company indicators at 25 points each and compare the transparent heuristic score with a selected review threshold.",
  id: "auditing/shell-company-registration-age-nominee-indicator-lookup",
  inputs: [
    {
      description: "Employee count reported for the entity.",
      id: "employeeCount",
      kind: "integer",
      label: "Employee count",
      minimum: 0,
    },
    {
      description: "Number of reported nominee or nominee-service indicators.",
      id: "nomineeCount",
      kind: "integer",
      label: "Nominee count",
      minimum: 0,
    },
    {
      description: "Number of entities sharing the registered address.",
      id: "registeredAddressSharedCount",
      kind: "integer",
      label: "Shared registered address count",
      minimum: 0,
    },
    {
      description: "Whole days since entity registration.",
      id: "registrationAgeDays",
      kind: "integer",
      label: "Registration age days",
      minimum: 0,
    },
    {
      description:
        "Heuristic score at or above which the entity is flagged for review.",
      id: "scoreThreshold",
      kind: "number",
      label: "Risk score threshold",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "highIndicatorRisk",
      kind: "boolean",
      label: "High indicator risk",
    },
    {
      id: "indicatorCount",
      kind: "integer",
      label: "Indicators present",
      minimum: 0,
    },
    {
      id: "indicatorsPresent",
      kind: "stringList",
      label: "Indicator labels",
    },
    { id: "riskScore", kind: "number", label: "Risk score", minimum: 0 },
  ],
  title: "Shell Company Registration Age Nominee Indicator Lookup",
});

export const runShellCompanyIndicator = shellCompanyIndicatorTool.execute;
export default shellCompanyIndicatorTool;
