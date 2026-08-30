import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly confidentialCommunication: boolean;
  readonly taxAdvicePurpose: boolean;
  readonly federallyAuthorizedPractitioner: boolean;
  readonly criminalTaxMatter: boolean;
  readonly taxShelterPromotion: boolean;
}>;
export type Output = Readonly<{
  readonly supportingConditionCount: number;
  readonly exclusionCount: number;
  readonly screenResult: string;
}>;

export const calculate = (input: Input): Output => {
  const supportingConditionCount = [
    input.confidentialCommunication,
    input.taxAdvicePurpose,
    input.federallyAuthorizedPractitioner,
  ].filter(Boolean).length;
  const exclusionCount = [
    input.criminalTaxMatter,
    input.taxShelterPromotion,
  ].filter(Boolean).length;
  return {
    supportingConditionCount,
    exclusionCount,
    screenResult:
      exclusionCount > 0
        ? "excluded"
        : supportingConditionCount === 3
          ? "potentially-covered"
          : "review",
  };
};

export const exampleInput = {
  confidentialCommunication: true,
  taxAdvicePurpose: true,
  federallyAuthorizedPractitioner: true,
  criminalTaxMatter: false,
  taxShelterPromotion: false,
} satisfies Input;
export const exampleOutput = {
  supportingConditionCount: 3,
  exclusionCount: 0,
  screenResult: "potentially-covered",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      confidentialCommunication: input.confidentialCommunication as boolean,
      taxAdvicePurpose: input.taxAdvicePurpose as boolean,
      federallyAuthorizedPractitioner:
        input.federallyAuthorizedPractitioner as boolean,
      criminalTaxMatter: input.criminalTaxMatter as boolean,
      taxShelterPromotion: input.taxShelterPromotion as boolean,
    }),
  description:
    "Screen supplied communication facts for potential tax-practitioner privilege.",
  id: "taxation/privilege-communication-screen",
  inputs: [
    {
      id: "confidentialCommunication",
      label: "Communication was confidential",
      kind: "boolean",
    },
    { id: "taxAdvicePurpose", label: "Made for tax advice", kind: "boolean" },
    {
      id: "federallyAuthorizedPractitioner",
      label: "Practitioner is federally authorized",
      kind: "boolean",
    },
    { id: "criminalTaxMatter", label: "Criminal tax matter", kind: "boolean" },
    {
      id: "taxShelterPromotion",
      label: "Tax-shelter promotion",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "supportingConditionCount",
      label: "Supporting condition count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "exclusionCount",
      label: "Exclusion count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "screenResult",
      label: "Privilege screen result",
      kind: "string",
      enum: ["potentially-covered", "excluded", "review"],
    },
  ],
  title: "Privilege Communication Screen",
});

export const run = tool.execute;
export default tool;
