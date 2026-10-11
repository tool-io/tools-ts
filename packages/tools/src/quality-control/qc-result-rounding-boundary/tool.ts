import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rawResult: number;
  readonly reportedResult: number;
  readonly suppliedBoundary: number;
};
export type Output = {
  readonly rawAtOrAbove: boolean;
  readonly reportedAtOrAbove: boolean;
  readonly crossesBoundary: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawResult: { type: "number" },
    reportedResult: { type: "number" },
    suppliedBoundary: { type: "number" },
  },
  required: ["rawResult", "reportedResult", "suppliedBoundary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawAtOrAbove: { type: "boolean" },
    reportedAtOrAbove: { type: "boolean" },
    crossesBoundary: { type: "boolean" },
  },
  required: ["rawAtOrAbove", "reportedAtOrAbove", "crossesBoundary"],
} as const;
/** Compare explicit raw and reported values against the same supplied boundary without rounding either value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawResult, reportedResult, suppliedBoundary } = request;
  const compute = (): Output => {
    return {
      rawAtOrAbove: rawResult >= suppliedBoundary,
      reportedAtOrAbove: reportedResult >= suppliedBoundary,
      crossesBoundary:
        rawResult >= suppliedBoundary !== reportedResult >= suppliedBoundary,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rawResult: 9.96, reportedResult: 10, suppliedBoundary: 10 },
  output: {
    rawAtOrAbove: false,
    reportedAtOrAbove: true,
    crossesBoundary: true,
  },
} satisfies ToolExample<Input, Output>;
export const qcResultRoundingBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "quality-control",
        "quality control",
        "research and quality management",
      ],
      keywords: ["quality control", "research and quality management"],
    },
    id: "quality-control/qc-result-rounding-boundary",
    title: "QC Result Rounding Boundary",
    description:
      "Compare explicit raw and reported values against the same supplied boundary without rounding either value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawResult: { type: "number" },
        reportedResult: { type: "number" },
        suppliedBoundary: { type: "number" },
      },
      required: ["rawResult", "reportedResult", "suppliedBoundary"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawAtOrAbove: { type: "boolean" },
        reportedAtOrAbove: { type: "boolean" },
        crossesBoundary: { type: "boolean" },
      },
      required: ["rawAtOrAbove", "reportedAtOrAbove", "crossesBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "rawResult",
          label: "Raw Result",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportedResult",
          label: "Reported Result",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBoundary",
          label: "Supplied Boundary",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rawAtOrAbove",
          label: "Raw At Or Above",
          valueType: { type: "boolean" },
        },
        {
          id: "reportedAtOrAbove",
          label: "Reported At Or Above",
          valueType: { type: "boolean" },
        },
        {
          id: "crossesBoundary",
          label: "Crosses Boundary",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = qcResultRoundingBoundaryTool.execute;
export default qcResultRoundingBoundaryTool;
