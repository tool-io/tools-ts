import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualLoad: number;
  readonly suppliedLimit: number;
  readonly measurementHalfwidth: number;
};
export type Output = {
  readonly nominalMargin: number;
  readonly conservativeMargin: number;
  readonly exceeds: boolean;
  readonly uncertain: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualLoad: { type: "number", minimum: 0 },
    suppliedLimit: { type: "number", minimum: 0 },
    measurementHalfwidth: { type: "number", minimum: 0 },
  },
  required: ["actualLoad", "suppliedLimit", "measurementHalfwidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalMargin: { type: "number" },
    conservativeMargin: { type: "number" },
    exceeds: { type: "boolean" },
    uncertain: { type: "boolean" },
  },
  required: ["nominalMargin", "conservativeMargin", "exceeds", "uncertain"],
} as const;
/** Compare a supplied task load and uncertainty against a caller-established limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actualLoad, suppliedLimit, measurementHalfwidth } = request;
  const compute = (): Output => {
    H.domain(
      actualLoad >= 0 && suppliedLimit >= 0 && measurementHalfwidth >= 0,
    );
    return {
      nominalMargin: suppliedLimit - actualLoad,
      conservativeMargin: suppliedLimit - actualLoad - measurementHalfwidth,
      exceeds: actualLoad - measurementHalfwidth > suppliedLimit,
      uncertain:
        actualLoad - measurementHalfwidth <= suppliedLimit &&
        actualLoad + measurementHalfwidth > suppliedLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actualLoad: 12, suppliedLimit: 15, measurementHalfwidth: 1 },
  output: {
    nominalMargin: 3,
    conservativeMargin: 2,
    exceeds: false,
    uncertain: false,
  },
} satisfies ToolExample<Input, Output>;
export const manualTaskExplicitLoadLimitGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/manual-task-explicit-load-limit-gap",
    title: "Manual Task Explicit Load Limit Gap Tool",
    description:
      "Compare a supplied task load and uncertainty against a caller-established limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualLoad: { type: "number", minimum: 0 },
        suppliedLimit: { type: "number", minimum: 0 },
        measurementHalfwidth: { type: "number", minimum: 0 },
      },
      required: ["actualLoad", "suppliedLimit", "measurementHalfwidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalMargin: { type: "number" },
        conservativeMargin: { type: "number" },
        exceeds: { type: "boolean" },
        uncertain: { type: "boolean" },
      },
      required: ["nominalMargin", "conservativeMargin", "exceeds", "uncertain"],
    },
    ports: {
      inputs: [
        {
          id: "actualLoad",
          label: "Actual Load",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measurementHalfwidth",
          label: "Measurement Halfwidth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nominalMargin",
          label: "Nominal Margin",
          valueType: { type: "number" },
        },
        {
          id: "conservativeMargin",
          label: "Conservative Margin",
          valueType: { type: "number" },
        },
        { id: "exceeds", label: "Exceeds", valueType: { type: "boolean" } },
        { id: "uncertain", label: "Uncertain", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = manualTaskExplicitLoadLimitGapTool.execute;
export default manualTaskExplicitLoadLimitGapTool;
