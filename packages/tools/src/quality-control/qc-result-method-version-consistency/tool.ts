import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultMethod: string;
  readonly methodVersion: string;
  readonly approvedMethod: string;
  readonly approvedVersion: string;
  readonly executedDay: number;
  readonly effectiveDay: number;
};
export type Output = {
  readonly methodMatches: boolean;
  readonly versionMatches: boolean;
  readonly effective: boolean;
  readonly consistent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultMethod: { type: "string", maxLength: 8192 },
    methodVersion: { type: "string", maxLength: 8192 },
    approvedMethod: { type: "string", maxLength: 8192 },
    approvedVersion: { type: "string", maxLength: 8192 },
    executedDay: { type: "integer" },
    effectiveDay: { type: "integer" },
  },
  required: [
    "resultMethod",
    "methodVersion",
    "approvedMethod",
    "approvedVersion",
    "executedDay",
    "effectiveDay",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    methodMatches: { type: "boolean" },
    versionMatches: { type: "boolean" },
    effective: { type: "boolean" },
    consistent: { type: "boolean" },
  },
  required: ["methodMatches", "versionMatches", "effective", "consistent"],
} as const;
/** Check supplied result method/version against an explicitly effective reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    resultMethod,
    methodVersion,
    approvedMethod,
    approvedVersion,
    executedDay,
    effectiveDay,
  } = request;
  const compute = (): Output => {
    const methodMatches = resultMethod === approvedMethod,
      versionMatches = methodVersion === approvedVersion,
      effective = executedDay >= effectiveDay;
    return {
      methodMatches,
      versionMatches,
      effective,
      consistent: methodMatches && versionMatches && effective,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resultMethod: "M1",
    methodVersion: "v2",
    approvedMethod: "M1",
    approvedVersion: "v2",
    executedDay: 110,
    effectiveDay: 100,
  },
  output: {
    methodMatches: true,
    versionMatches: true,
    effective: true,
    consistent: true,
  },
} satisfies ToolExample<Input, Output>;
export const qcResultMethodVersionConsistencyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/qc-result-method-version-consistency",
    title: "QC Result Method Version Consistency Tool",
    description:
      "Check supplied result method/version against an explicitly effective reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultMethod: { type: "string", maxLength: 8192 },
        methodVersion: { type: "string", maxLength: 8192 },
        approvedMethod: { type: "string", maxLength: 8192 },
        approvedVersion: { type: "string", maxLength: 8192 },
        executedDay: { type: "integer" },
        effectiveDay: { type: "integer" },
      },
      required: [
        "resultMethod",
        "methodVersion",
        "approvedMethod",
        "approvedVersion",
        "executedDay",
        "effectiveDay",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        methodMatches: { type: "boolean" },
        versionMatches: { type: "boolean" },
        effective: { type: "boolean" },
        consistent: { type: "boolean" },
      },
      required: ["methodMatches", "versionMatches", "effective", "consistent"],
    },
    ports: {
      inputs: [
        {
          id: "resultMethod",
          label: "Result Method",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "methodVersion",
          label: "Method Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "approvedMethod",
          label: "Approved Method",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "approvedVersion",
          label: "Approved Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "executedDay",
          label: "Executed Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "effectiveDay",
          label: "Effective Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "methodMatches",
          label: "Method Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "versionMatches",
          label: "Version Matches",
          valueType: { type: "boolean" },
        },
        { id: "effective", label: "Effective", valueType: { type: "boolean" } },
        {
          id: "consistent",
          label: "Consistent",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = qcResultMethodVersionConsistencyTool.execute;
export default qcResultMethodVersionConsistencyTool;
