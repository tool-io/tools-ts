import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryTime: number;
  readonly exitTime: number;
  readonly eventTime: number;
  readonly includeExitEquality: boolean;
};
export type Output = { readonly inRiskSet: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryTime: { type: "number" },
    exitTime: { type: "number" },
    eventTime: { type: "number" },
    includeExitEquality: { type: "boolean" },
  },
  required: ["entryTime", "exitTime", "eventTime", "includeExitEquality"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inRiskSet: { type: "boolean" } },
  required: ["inRiskSet"],
} as const;
/** Check entry < event time against an explicit inclusive/exclusive exit convention for one delayed-entry risk-set record. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryTime, exitTime, eventTime, includeExitEquality } = request;
  const compute = (): Output => {
    H.domain(exitTime >= entryTime, "exitTime");
    return {
      inRiskSet:
        entryTime < eventTime &&
        (eventTime < exitTime ||
          (eventTime === exitTime && includeExitEquality)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entryTime: 1, exitTime: 5, eventTime: 5, includeExitEquality: true },
  output: { inRiskSet: true },
} satisfies ToolExample<Input, Output>;
export const riskSetEventInclusionCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biostatistics", "research and quality management"],
      keywords: ["biostatistics", "research and quality management"],
    },
    id: "biostatistics/risk-set-event-inclusion-check",
    title: "Risk Set Event Inclusion Check",
    description:
      "Check entry < event time against an explicit inclusive/exclusive exit convention for one delayed-entry risk-set record.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryTime: { type: "number" },
        exitTime: { type: "number" },
        eventTime: { type: "number" },
        includeExitEquality: { type: "boolean" },
      },
      required: ["entryTime", "exitTime", "eventTime", "includeExitEquality"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inRiskSet: { type: "boolean" } },
      required: ["inRiskSet"],
    },
    ports: {
      inputs: [
        {
          id: "entryTime",
          label: "Entry Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exitTime",
          label: "Exit Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eventTime",
          label: "Event Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeExitEquality",
          label: "Include Exit Equality",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "inRiskSet",
          label: "In Risk Set",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = riskSetEventInclusionCheckTool.execute;
export default riskSetEventInclusionCheckTool;
