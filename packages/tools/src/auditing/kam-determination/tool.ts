import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly significantAuditorAttention: boolean;
  readonly communicatedWithGovernance: boolean;
  readonly mostSignificantMatter: boolean;
  readonly disclosureProhibited: boolean;
}>;
export type Output = Readonly<{
  readonly criteriaMet: number;
  readonly qualifiesAsKam: boolean;
  readonly communicationResult: string;
}>;

export const calculate = (input: Input): Output => {
  const criteriaMet = [
      input.significantAuditorAttention,
      input.communicatedWithGovernance,
      input.mostSignificantMatter,
    ].filter(Boolean).length,
    qualifiesAsKam = criteriaMet === 3;
  return {
    criteriaMet,
    qualifiesAsKam,
    communicationResult: qualifiesAsKam
      ? input.disclosureProhibited
        ? "omit-prohibited"
        : "include"
      : "not-kam",
  };
};

export const exampleInput = {
  significantAuditorAttention: true,
  communicatedWithGovernance: true,
  mostSignificantMatter: true,
  disclosureProhibited: false,
} satisfies Input;
export const exampleOutput = {
  criteriaMet: 3,
  qualifiesAsKam: true,
  communicationResult: "include",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      significantAuditorAttention: input.significantAuditorAttention as boolean,
      communicatedWithGovernance: input.communicatedWithGovernance as boolean,
      mostSignificantMatter: input.mostSignificantMatter as boolean,
      disclosureProhibited: input.disclosureProhibited as boolean,
    }),
  description: "Evaluate supplied criteria for key-audit-matter determination.",
  id: "auditing/kam-determination",
  inputs: [
    {
      id: "significantAuditorAttention",
      label: "Required significant auditor attention",
      kind: "boolean",
    },
    {
      id: "communicatedWithGovernance",
      label: "Communicated with governance",
      kind: "boolean",
    },
    {
      id: "mostSignificantMatter",
      label: "Among most significant matters",
      kind: "boolean",
    },
    {
      id: "disclosureProhibited",
      label: "Disclosure is prohibited",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "criteriaMet",
      label: "KAM criteria met",
      kind: "integer",
      minimum: 0,
    },
    { id: "qualifiesAsKam", label: "Qualifies as KAM", kind: "boolean" },
    {
      id: "communicationResult",
      label: "Communication result",
      kind: "string",
      enum: ["include", "omit-prohibited", "not-kam"],
    },
  ],
  title: "KAM Determination",
});

export const run = tool.execute;
export default tool;
