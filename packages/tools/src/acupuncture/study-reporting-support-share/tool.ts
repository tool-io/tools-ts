import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyIds: readonly string[];
  readonly requiredElements: readonly number[];
  readonly reportedElements: readonly number[];
};
export type Output = {
  readonly requiredDecimal: string;
  readonly reportedDecimal: string;
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
    requiredElements: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    reportedElements: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["studyIds", "requiredElements", "reportedElements"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    reportedDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["requiredDecimal", "reportedDecimal", "share", "defined"],
} as const;
/** Calculate study reporting support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyIds, requiredElements, reportedElements } = request;
  const compute = (): Output => {
    H.sameLength(studyIds, requiredElements);
    H.sameLength(studyIds, reportedElements);
    H.domain(
      requiredElements.every(
        (x, i) =>
          x >= 0 && reportedElements[i] >= 0 && reportedElements[i] <= x,
      ),
    );
    return (() => {
      const a = requiredElements.reduce((s, x) => s + BigInt(x), 0n),
        b = reportedElements.reduce((s, x) => s + BigInt(x), 0n);
      return {
        requiredDecimal: a.toString(),
        reportedDecimal: b.toString(),
        share: a > 0n ? Number(b) / Number(a) : 0,
        defined: a > 0n,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    studyIds: ["a", "b"],
    requiredElements: [3, 2],
    reportedElements: [2, 1],
  },
  output: {
    requiredDecimal: "5",
    reportedDecimal: "3",
    share: 0.6,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const studyReportingSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "acupuncture/study-reporting-support-share",
    title: "Study Reporting Support Share Tool",
    description:
      "Calculate study reporting support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredElements: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        reportedElements: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["studyIds", "requiredElements", "reportedElements"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        reportedDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["requiredDecimal", "reportedDecimal", "share", "defined"],
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
          id: "requiredElements",
          label: "Required Elements",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "reportedElements",
          label: "Reported Elements",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "requiredDecimal",
          label: "Required Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "reportedDecimal",
          label: "Reported Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = studyReportingSupportShareTool.execute;
export default studyReportingSupportShareTool;
