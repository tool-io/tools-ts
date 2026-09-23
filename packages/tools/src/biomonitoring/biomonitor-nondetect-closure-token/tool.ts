import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly limit: number;
  readonly nondetect: boolean;
  readonly includeLimit: boolean;
};
export type Output = {
  readonly consistentUnderRule: boolean;
  readonly upperBounded: boolean;
  readonly upperBound: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    limit: { type: "number" },
    nondetect: { type: "boolean" },
    includeLimit: { type: "boolean" },
  },
  required: ["value", "limit", "nondetect", "includeLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consistentUnderRule: { type: "boolean" },
    upperBounded: { type: "boolean" },
    upperBound: { type: "number" },
  },
  required: ["consistentUnderRule", "upperBounded", "upperBound"],
} as const;
/** Audit a supplied nondetect annotation against an explicit limit convention without substituting a concentration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, limit, nondetect, includeLimit } = request;
  const compute = (): Output => {
    return {
      consistentUnderRule:
        !nondetect || (includeLimit ? value <= limit : value < limit),
      upperBounded: nondetect,
      upperBound: nondetect ? limit : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 5, limit: 5, nondetect: true, includeLimit: false },
  output: { consistentUnderRule: false, upperBounded: true, upperBound: 5 },
} satisfies ToolExample<Input, Output>;
export const biomonitorNondetectClosureTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomonitoring/biomonitor-nondetect-closure-token",
    title: "Biomonitor Nondetect Closure Token Tool",
    description:
      "Audit a supplied nondetect annotation against an explicit limit convention without substituting a concentration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        limit: { type: "number" },
        nondetect: { type: "boolean" },
        includeLimit: { type: "boolean" },
      },
      required: ["value", "limit", "nondetect", "includeLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consistentUnderRule: { type: "boolean" },
        upperBounded: { type: "boolean" },
        upperBound: { type: "number" },
      },
      required: ["consistentUnderRule", "upperBounded", "upperBound"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "limit",
          label: "Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nondetect",
          label: "Nondetect",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeLimit",
          label: "Include Limit",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "consistentUnderRule",
          label: "Consistent Under Rule",
          valueType: { type: "boolean" },
        },
        {
          id: "upperBounded",
          label: "Upper Bounded",
          valueType: { type: "boolean" },
        },
        {
          id: "upperBound",
          label: "Upper Bound",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biomonitorNondetectClosureTokenTool.execute;
export default biomonitorNondetectClosureTokenTool;
