import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly approvedCapitalBudget: number;
  readonly committedCapital: number;
  readonly proposedProjectCost: number;
};
export type Output = {
  readonly headroomBeforeProject: number;
  readonly headroomAfterProject: number;
  readonly fitsWithinBudget: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    approvedCapitalBudget: { type: "number", minimum: 0 },
    committedCapital: { type: "number", minimum: 0 },
    proposedProjectCost: { type: "number", minimum: 0 },
  },
  required: [
    "approvedCapitalBudget",
    "committedCapital",
    "proposedProjectCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headroomBeforeProject: { type: "number" },
    headroomAfterProject: { type: "number" },
    fitsWithinBudget: { type: "boolean" },
  },
  required: [
    "headroomBeforeProject",
    "headroomAfterProject",
    "fitsWithinBudget",
  ],
} as const;
/** Compare an explicit proposed capital cost with budget remaining after nonoverlapping commitments without evaluating investment merit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { approvedCapitalBudget, committedCapital, proposedProjectCost } =
    request;
  const compute = (): Output => {
    H.domain(
      approvedCapitalBudget >= 0 &&
        committedCapital >= 0 &&
        proposedProjectCost >= 0,
      "approvedCapitalBudget",
    );
    return {
      headroomBeforeProject: approvedCapitalBudget - committedCapital,
      headroomAfterProject:
        approvedCapitalBudget - committedCapital - proposedProjectCost,
      fitsWithinBudget:
        committedCapital + proposedProjectCost <= approvedCapitalBudget,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    approvedCapitalBudget: 1000,
    committedCapital: 600,
    proposedProjectCost: 250,
  },
  output: {
    headroomBeforeProject: 400,
    headroomAfterProject: 150,
    fitsWithinBudget: true,
  },
} satisfies ToolExample<Input, Output>;
export const capitalBudgetProjectHeadroomTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: [
        "corporate-finance",
        "corporate finance",
        "business and finance",
      ],
      keywords: ["corporate finance", "business and finance"],
    },
    id: "corporate-finance/capital-budget-project-headroom",
    title: "Capital Budget Project Headroom",
    description:
      "Compare an explicit proposed capital cost with budget remaining after nonoverlapping commitments without evaluating investment merit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        approvedCapitalBudget: { type: "number", minimum: 0 },
        committedCapital: { type: "number", minimum: 0 },
        proposedProjectCost: { type: "number", minimum: 0 },
      },
      required: [
        "approvedCapitalBudget",
        "committedCapital",
        "proposedProjectCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headroomBeforeProject: { type: "number" },
        headroomAfterProject: { type: "number" },
        fitsWithinBudget: { type: "boolean" },
      },
      required: [
        "headroomBeforeProject",
        "headroomAfterProject",
        "fitsWithinBudget",
      ],
    },
    ports: {
      inputs: [
        {
          id: "approvedCapitalBudget",
          label: "Approved Capital Budget",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "committedCapital",
          label: "Committed Capital",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "proposedProjectCost",
          label: "Proposed Project Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "headroomBeforeProject",
          label: "Headroom Before Project",
          valueType: { type: "number" },
        },
        {
          id: "headroomAfterProject",
          label: "Headroom After Project",
          valueType: { type: "number" },
        },
        {
          id: "fitsWithinBudget",
          label: "Fits Within Budget",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = capitalBudgetProjectHeadroomTool.execute;
export default capitalBudgetProjectHeadroomTool;
