import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pageLimit: number;
  readonly evidencePages: number;
  readonly narrativePages: number;
  readonly excludedAppendixPages: number;
};
export type Output = {
  readonly countedPages: number;
  readonly remainingPages: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pageLimit: { type: "integer", minimum: 0 },
    evidencePages: { type: "integer", minimum: 0 },
    narrativePages: { type: "integer", minimum: 0 },
    excludedAppendixPages: { type: "integer", minimum: 0 },
  },
  required: [
    "pageLimit",
    "evidencePages",
    "narrativePages",
    "excludedAppendixPages",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedPages: { type: "integer" },
    remainingPages: { type: "integer" },
  },
  required: ["countedPages", "remainingPages"],
} as const;
/** Calculate recognition portfolio page budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pageLimit, evidencePages, narrativePages, excludedAppendixPages } =
    request;
  const compute = (): Output => {
    H.integer(pageLimit, 0);
    H.integer(evidencePages, 0);
    H.integer(narrativePages, 0);
    H.integer(excludedAppendixPages, 0, evidencePages);
    return {
      countedPages: evidencePages + narrativePages - excludedAppendixPages,
      remainingPages:
        pageLimit - evidencePages - narrativePages + excludedAppendixPages,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pageLimit: 50,
    evidencePages: 30,
    narrativePages: 15,
    excludedAppendixPages: 5,
  },
  output: { countedPages: 40, remainingPages: 10 },
} satisfies ToolExample<Input, Output>;
export const recognitionPortfolioPageBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/recognition-portfolio-page-budget",
    title: "Recognition Portfolio Page Budget Tool",
    description:
      "Calculate recognition portfolio page budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pageLimit: { type: "integer", minimum: 0 },
        evidencePages: { type: "integer", minimum: 0 },
        narrativePages: { type: "integer", minimum: 0 },
        excludedAppendixPages: { type: "integer", minimum: 0 },
      },
      required: [
        "pageLimit",
        "evidencePages",
        "narrativePages",
        "excludedAppendixPages",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedPages: { type: "integer" },
        remainingPages: { type: "integer" },
      },
      required: ["countedPages", "remainingPages"],
    },
    ports: {
      inputs: [
        {
          id: "pageLimit",
          label: "Page Limit",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "evidencePages",
          label: "Evidence Pages",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "narrativePages",
          label: "Narrative Pages",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedAppendixPages",
          label: "Excluded Appendix Pages",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "countedPages",
          label: "Counted Pages",
          valueType: { type: "integer" },
        },
        {
          id: "remainingPages",
          label: "Remaining Pages",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = recognitionPortfolioPageBudgetTool.execute;
export default recognitionPortfolioPageBudgetTool;
