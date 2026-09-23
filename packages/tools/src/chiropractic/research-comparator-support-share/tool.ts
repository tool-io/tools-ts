import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyIds: readonly string[];
  readonly comparatorReported: readonly boolean[];
  readonly baselineReported: readonly boolean[];
  readonly outcomeReported: readonly boolean[];
};
export type Output = {
  readonly studies: number;
  readonly fullySupportedStudies: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    comparatorReported: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    baselineReported: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    outcomeReported: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "studyIds",
    "comparatorReported",
    "baselineReported",
    "outcomeReported",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studies: { type: "integer" },
    fullySupportedStudies: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["studies", "fullySupportedStudies", "share", "defined"],
} as const;
/** Count explicit research reporting support without asserting intervention efficacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyIds, comparatorReported, baselineReported, outcomeReported } =
    request;
  const compute = (): Output => {
    H.sameLength(studyIds, comparatorReported);
    H.sameLength(studyIds, baselineReported);
    H.sameLength(studyIds, outcomeReported);
    return (() => {
      const all = new Set(studyIds),
        yes = new Set(
          studyIds.filter(
            (x, i) =>
              comparatorReported[i] &&
              baselineReported[i] &&
              outcomeReported[i],
          ),
        );
      return {
        studies: all.size,
        fullySupportedStudies: yes.size,
        share: all.size > 0 ? yes.size / all.size : 0,
        defined: all.size > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    studyIds: ["s1", "s2"],
    comparatorReported: [true, true],
    baselineReported: [true, false],
    outcomeReported: [true, true],
  },
  output: { studies: 2, fullySupportedStudies: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const researchComparatorSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chiropractic/research-comparator-support-share",
    title: "Research Comparator Support Share Tool",
    description:
      "Count explicit research reporting support without asserting intervention efficacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        comparatorReported: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        baselineReported: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        outcomeReported: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "studyIds",
        "comparatorReported",
        "baselineReported",
        "outcomeReported",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studies: { type: "integer" },
        fullySupportedStudies: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["studies", "fullySupportedStudies", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "studyIds",
          label: "Study Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "comparatorReported",
          label: "Comparator Reported",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "baselineReported",
          label: "Baseline Reported",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "outcomeReported",
          label: "Outcome Reported",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "studies", label: "Studies", valueType: { type: "integer" } },
        {
          id: "fullySupportedStudies",
          label: "Fully Supported Studies",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = researchComparatorSupportShareTool.execute;
export default researchComparatorSupportShareTool;
