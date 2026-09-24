import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly projectStart: number;
  readonly projectEnd: number;
  readonly fundingStart: number;
  readonly fundingEnd: number;
};
export type Output = {
  readonly unfundedBefore: number;
  readonly unfundedAfter: number;
  readonly fundedDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectStart: { type: "number" },
    projectEnd: { type: "number" },
    fundingStart: { type: "number" },
    fundingEnd: { type: "number" },
  },
  required: ["projectStart", "projectEnd", "fundingStart", "fundingEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unfundedBefore: { type: "number" },
    unfundedAfter: { type: "number" },
    fundedDuration: { type: "number" },
  },
  required: ["unfundedBefore", "unfundedAfter", "fundedDuration"],
} as const;
/** Calculate project funding period gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { projectStart, projectEnd, fundingStart, fundingEnd } = request;
  const compute = (): Output => {
    H.domain(projectEnd >= projectStart && fundingEnd >= fundingStart);
    return (() => {
      const fundedDuration = Math.max(
        0,
        Math.min(projectEnd, fundingEnd) - Math.max(projectStart, fundingStart),
      );
      return {
        unfundedBefore: Math.max(
          0,
          Math.min(projectEnd, fundingStart) - projectStart,
        ),
        unfundedAfter: Math.max(
          0,
          projectEnd - Math.max(projectStart, fundingEnd),
        ),
        fundedDuration,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { projectStart: 0, projectEnd: 10, fundingStart: 2, fundingEnd: 8 },
  output: { unfundedBefore: 2, unfundedAfter: 2, fundedDuration: 6 },
} satisfies ToolExample<Input, Output>;
export const projectFundingPeriodGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-development/project-funding-period-gap",
    title: "Project Funding Period Gap Tool",
    description:
      "Calculate project funding period gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        projectStart: { type: "number" },
        projectEnd: { type: "number" },
        fundingStart: { type: "number" },
        fundingEnd: { type: "number" },
      },
      required: ["projectStart", "projectEnd", "fundingStart", "fundingEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unfundedBefore: { type: "number" },
        unfundedAfter: { type: "number" },
        fundedDuration: { type: "number" },
      },
      required: ["unfundedBefore", "unfundedAfter", "fundedDuration"],
    },
    ports: {
      inputs: [
        {
          id: "projectStart",
          label: "Project Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "projectEnd",
          label: "Project End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fundingStart",
          label: "Funding Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fundingEnd",
          label: "Funding End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unfundedBefore",
          label: "Unfunded Before",
          valueType: { type: "number" },
        },
        {
          id: "unfundedAfter",
          label: "Unfunded After",
          valueType: { type: "number" },
        },
        {
          id: "fundedDuration",
          label: "Funded Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = projectFundingPeriodGapTool.execute;
export default projectFundingPeriodGapTool;
