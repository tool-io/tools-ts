import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialGroup: number;
  readonly retainedGroup: number;
  readonly initialOther: number;
  readonly retainedOther: number;
};
export type Output = {
  readonly groupRetention: number;
  readonly otherRetention: number;
  readonly retentionGap: number;
  readonly retainedGroupShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialGroup: { type: "integer", minimum: 1 },
    retainedGroup: { type: "integer", minimum: 0 },
    initialOther: { type: "integer", minimum: 1 },
    retainedOther: { type: "integer", minimum: 0 },
  },
  required: ["initialGroup", "retainedGroup", "initialOther", "retainedOther"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupRetention: { type: "number" },
    otherRetention: { type: "number" },
    retentionGap: { type: "number" },
    retainedGroupShare: { type: "number" },
  },
  required: [
    "groupRetention",
    "otherRetention",
    "retentionGap",
    "retainedGroupShare",
  ],
} as const;
/** Observed differential retention across two caller-defined groups; no missingness mechanism or causal attrition bias is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialGroup, retainedGroup, initialOther, retainedOther } = request;
  const compute = (): Output => {
    H.integer(initialGroup, 1);
    H.integer(initialOther, 1);
    H.integer(retainedGroup, 0, initialGroup);
    H.integer(retainedOther, 0, initialOther);
    H.domain(retainedGroup + retainedOther > 0);
    return {
      groupRetention: retainedGroup / initialGroup,
      otherRetention: retainedOther / initialOther,
      retentionGap: retainedGroup / initialGroup - retainedOther / initialOther,
      retainedGroupShare: retainedGroup / (retainedGroup + retainedOther),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialGroup: 100,
    retainedGroup: 60,
    initialOther: 200,
    retainedOther: 160,
  },
  output: {
    groupRetention: 0.6,
    otherRetention: 0.8,
    retentionGap: -0.20000000000000007,
    retainedGroupShare: 0.2727272727272727,
  },
} satisfies ToolExample<Input, Output>;
export const agingCohortSelectiveAttritionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/aging-cohort-selective-attrition-share",
    title: "Aging Cohort Selective Attrition Share Tool",
    description:
      "Observed differential retention across two caller-defined groups; no missingness mechanism or causal attrition bias is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialGroup: { type: "integer", minimum: 1 },
        retainedGroup: { type: "integer", minimum: 0 },
        initialOther: { type: "integer", minimum: 1 },
        retainedOther: { type: "integer", minimum: 0 },
      },
      required: [
        "initialGroup",
        "retainedGroup",
        "initialOther",
        "retainedOther",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupRetention: { type: "number" },
        otherRetention: { type: "number" },
        retentionGap: { type: "number" },
        retainedGroupShare: { type: "number" },
      },
      required: [
        "groupRetention",
        "otherRetention",
        "retentionGap",
        "retainedGroupShare",
      ],
    },
    ports: {
      inputs: [
        {
          id: "initialGroup",
          label: "Initial Group",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "retainedGroup",
          label: "Retained Group",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "initialOther",
          label: "Initial Other",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "retainedOther",
          label: "Retained Other",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "groupRetention",
          label: "Group Retention",
          valueType: { type: "number" },
        },
        {
          id: "otherRetention",
          label: "Other Retention",
          valueType: { type: "number" },
        },
        {
          id: "retentionGap",
          label: "Retention Gap",
          valueType: { type: "number" },
        },
        {
          id: "retainedGroupShare",
          label: "Retained Group Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = agingCohortSelectiveAttritionShareTool.execute;
export default agingCohortSelectiveAttritionShareTool;
