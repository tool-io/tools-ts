import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly portfolioId: string;
  readonly competencyCode: string;
  readonly evidenceId: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    portfolioId: { type: "string", maxLength: 8192, minLength: 1 },
    competencyCode: { type: "string", maxLength: 8192, minLength: 1 },
    evidenceId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["portfolioId", "competencyCode", "evidenceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Link one portfolio evidence identifier to an explicit competency code without judging competency achievement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { portfolioId, competencyCode, evidenceId } = request;
  const compute = (): Output => {
    H.domain(
      portfolioId.length > 0 &&
        competencyCode.length > 0 &&
        evidenceId.length > 0,
      "portfolioId",
    );
    return { tag: JSON.stringify([portfolioId, competencyCode, evidenceId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { portfolioId: "PF17", competencyCode: "C3", evidenceId: "E12" },
  output: { tag: '["PF17","C3","E12"]' },
} satisfies ToolExample<Input, Output>;
export const adultPortfolioCompetencyTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["adult-education", "adult education", "education"],
      keywords: ["adult education", "education"],
    },
    id: "adult-education/adult-portfolio-competency-tag",
    title: "Adult Portfolio Competency Tag",
    description:
      "Link one portfolio evidence identifier to an explicit competency code without judging competency achievement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        portfolioId: { type: "string", maxLength: 8192, minLength: 1 },
        competencyCode: { type: "string", maxLength: 8192, minLength: 1 },
        evidenceId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["portfolioId", "competencyCode", "evidenceId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "portfolioId",
          label: "Portfolio Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "competencyCode",
          label: "Competency Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evidenceId",
          label: "Evidence Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = adultPortfolioCompetencyTagTool.execute;
export default adultPortfolioCompetencyTagTool;
