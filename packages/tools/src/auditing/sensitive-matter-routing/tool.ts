import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly involvesManagementIntegrity: boolean;
  readonly potentialIllegalAct: boolean;
  readonly whistleblowerIdentitySensitive: boolean;
  readonly immediateFinancialStatementImpact: boolean;
}>;
export type Output = Readonly<{
  readonly sensitivityScore: number;
  readonly primaryRoute: string;
  readonly restrictedDistribution: boolean;
}>;

export const calculate = (input: Input): Output => {
  const sensitivityScore =
    (input.involvesManagementIntegrity ? 3 : 0) +
    (input.potentialIllegalAct ? 3 : 0) +
    (input.whistleblowerIdentitySensitive ? 2 : 0) +
    (input.immediateFinancialStatementImpact ? 1 : 0);
  const primaryRoute = input.whistleblowerIdentitySensitive
    ? "restricted-channel"
    : input.potentialIllegalAct
      ? "legal-counsel"
      : input.involvesManagementIntegrity
        ? "audit-committee"
        : "engagement-lead";
  return {
    sensitivityScore,
    primaryRoute,
    restrictedDistribution: sensitivityScore >= 3,
  };
};

export const exampleInput = {
  involvesManagementIntegrity: false,
  potentialIllegalAct: true,
  whistleblowerIdentitySensitive: false,
  immediateFinancialStatementImpact: true,
} satisfies Input;
export const exampleOutput = {
  sensitivityScore: 4,
  primaryRoute: "legal-counsel",
  restrictedDistribution: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      involvesManagementIntegrity: input.involvesManagementIntegrity as boolean,
      potentialIllegalAct: input.potentialIllegalAct as boolean,
      whistleblowerIdentitySensitive:
        input.whistleblowerIdentitySensitive as boolean,
      immediateFinancialStatementImpact:
        input.immediateFinancialStatementImpact as boolean,
    }),
  description: "Route sensitive audit matters from supplied indicators.",
  id: "auditing/sensitive-matter-routing",
  inputs: [
    {
      id: "involvesManagementIntegrity",
      label: "Involves management integrity",
      kind: "boolean",
    },
    {
      id: "potentialIllegalAct",
      label: "Potential illegal act",
      kind: "boolean",
    },
    {
      id: "whistleblowerIdentitySensitive",
      label: "Whistleblower identity sensitive",
      kind: "boolean",
    },
    {
      id: "immediateFinancialStatementImpact",
      label: "Immediate financial-statement impact",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "sensitivityScore",
      label: "Sensitivity score",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "primaryRoute",
      label: "Primary route",
      kind: "string",
      enum: [
        "engagement-lead",
        "audit-committee",
        "legal-counsel",
        "restricted-channel",
      ],
    },
    {
      id: "restrictedDistribution",
      label: "Restricted distribution recommended",
      kind: "boolean",
    },
  ],
  title: "Sensitive-Matter Routing",
});

export const run = tool.execute;
export default tool;
