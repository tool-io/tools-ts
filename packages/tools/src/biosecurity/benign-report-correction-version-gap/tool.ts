import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalVersion: string;
  readonly correctionVersion: string;
  readonly originalTime: number;
  readonly correctionTime: number;
};
export type Output = {
  readonly versionChanged: boolean;
  readonly elapsed: number;
  readonly chronological: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalVersion: { type: "string", maxLength: 8192 },
    correctionVersion: { type: "string", maxLength: 8192 },
    originalTime: { type: "number" },
    correctionTime: { type: "number" },
  },
  required: [
    "originalVersion",
    "correctionVersion",
    "originalTime",
    "correctionTime",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    versionChanged: { type: "boolean" },
    elapsed: { type: "number" },
    chronological: { type: "boolean" },
  },
  required: ["versionChanged", "elapsed", "chronological"],
} as const;
/** Compare supplied benign inventory/report correction metadata without evaluating biological information. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalVersion, correctionVersion, originalTime, correctionTime } =
    request;
  const compute = (): Output => {
    return {
      versionChanged: originalVersion !== correctionVersion,
      elapsed: correctionTime - originalTime,
      chronological: correctionTime >= originalTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalVersion: "v1",
    correctionVersion: "v2",
    originalTime: 10,
    correctionTime: 15,
  },
  output: { versionChanged: true, elapsed: 5, chronological: true },
} satisfies ToolExample<Input, Output>;
export const benignReportCorrectionVersionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosecurity/benign-report-correction-version-gap",
    title: "Benign Report Correction Version Gap Tool",
    description:
      "Compare supplied benign inventory/report correction metadata without evaluating biological information.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalVersion: { type: "string", maxLength: 8192 },
        correctionVersion: { type: "string", maxLength: 8192 },
        originalTime: { type: "number" },
        correctionTime: { type: "number" },
      },
      required: [
        "originalVersion",
        "correctionVersion",
        "originalTime",
        "correctionTime",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        versionChanged: { type: "boolean" },
        elapsed: { type: "number" },
        chronological: { type: "boolean" },
      },
      required: ["versionChanged", "elapsed", "chronological"],
    },
    ports: {
      inputs: [
        {
          id: "originalVersion",
          label: "Original Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "correctionVersion",
          label: "Correction Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "originalTime",
          label: "Original Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "correctionTime",
          label: "Correction Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "versionChanged",
          label: "Version Changed",
          valueType: { type: "boolean" },
        },
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        {
          id: "chronological",
          label: "Chronological",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = benignReportCorrectionVersionGapTool.execute;
export default benignReportCorrectionVersionGapTool;
