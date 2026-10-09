import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly partnerFunding: number;
  readonly projectFunding: number;
};
export type Output = { readonly partnerShare: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    partnerFunding: { type: "number", minimum: 0 },
    projectFunding: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["partnerFunding", "projectFunding"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { partnerShare: { type: "number" } },
  required: ["partnerShare"],
} as const;
/** Calculate an explicit partner funding share on a common currency and project-cost basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { partnerFunding, projectFunding } = request;
  const compute = (): Output => {
    (H.domain(projectFunding > 0, "projectFunding"), projectFunding);
    H.domain(
      partnerFunding >= 0 && partnerFunding <= projectFunding,
      "partnerFunding",
    );
    return { partnerShare: partnerFunding / projectFunding };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { partnerFunding: 250, projectFunding: 1000 },
  output: { partnerShare: 0.25 },
} satisfies ToolExample<Input, Output>;
export const transNationalProjectFundingShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["global-studies", "global studies", "social sciences"],
      keywords: ["global studies", "social sciences"],
    },
    id: "global-studies/trans-national-project-funding-share",
    title: "Trans National Project Funding Share",
    description:
      "Calculate an explicit partner funding share on a common currency and project-cost basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        partnerFunding: { type: "number", minimum: 0 },
        projectFunding: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["partnerFunding", "projectFunding"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { partnerShare: { type: "number" } },
      required: ["partnerShare"],
    },
    ports: {
      inputs: [
        {
          id: "partnerFunding",
          label: "Partner Funding",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "projectFunding",
          label: "Project Funding",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "partnerShare",
          label: "Partner Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = transNationalProjectFundingShareTool.execute;
export default transNationalProjectFundingShareTool;
