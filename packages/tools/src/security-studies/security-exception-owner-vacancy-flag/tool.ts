import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exceptionActive: boolean;
  readonly ownerAssigned: boolean;
  readonly ownerCurrent: boolean;
};
export type Output = { readonly activeOwnerVacancy: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exceptionActive: { type: "boolean" },
    ownerAssigned: { type: "boolean" },
    ownerCurrent: { type: "boolean" },
  },
  required: ["exceptionActive", "ownerAssigned", "ownerCurrent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { activeOwnerVacancy: { type: "boolean" } },
  required: ["activeOwnerVacancy"],
} as const;
/** Combine explicit policy-exception and owner assignment flags without approving exceptions or changing access controls. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exceptionActive, ownerAssigned, ownerCurrent } = request;
  const compute = (): Output => {
    return {
      activeOwnerVacancy: exceptionActive && (!ownerAssigned || !ownerCurrent),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exceptionActive: true, ownerAssigned: true, ownerCurrent: false },
  output: { activeOwnerVacancy: true },
} satisfies ToolExample<Input, Output>;
export const securityExceptionOwnerVacancyFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["security-studies", "security studies", "social sciences"],
      keywords: ["security studies", "social sciences"],
    },
    id: "security-studies/security-exception-owner-vacancy-flag",
    title: "Security Exception Owner Vacancy Flag",
    description:
      "Combine explicit policy-exception and owner assignment flags without approving exceptions or changing access controls.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exceptionActive: { type: "boolean" },
        ownerAssigned: { type: "boolean" },
        ownerCurrent: { type: "boolean" },
      },
      required: ["exceptionActive", "ownerAssigned", "ownerCurrent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { activeOwnerVacancy: { type: "boolean" } },
      required: ["activeOwnerVacancy"],
    },
    ports: {
      inputs: [
        {
          id: "exceptionActive",
          label: "Exception Active",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "ownerAssigned",
          label: "Owner Assigned",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "ownerCurrent",
          label: "Owner Current",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "activeOwnerVacancy",
          label: "Active Owner Vacancy",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = securityExceptionOwnerVacancyFlagTool.execute;
export default securityExceptionOwnerVacancyFlagTool;
