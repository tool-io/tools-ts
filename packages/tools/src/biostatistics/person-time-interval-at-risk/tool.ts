import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryTime: number;
  readonly exitTime: number;
  readonly observationStart: number;
  readonly observationEnd: number;
};
export type Output = { readonly atRiskTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryTime: { type: "number" },
    exitTime: { type: "number" },
    observationStart: { type: "number" },
    observationEnd: { type: "number" },
  },
  required: ["entryTime", "exitTime", "observationStart", "observationEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { atRiskTime: { type: "number" } },
  required: ["atRiskTime"],
} as const;
/** Intersect one explicit entry/exit interval with a study observation window using half-open time boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryTime, exitTime, observationStart, observationEnd } = request;
  const compute = (): Output => {
    H.domain(
      exitTime >= entryTime && observationEnd >= observationStart,
      "exitTime",
    );
    return {
      atRiskTime: Math.max(
        0,
        Math.min(exitTime, observationEnd) -
          Math.max(entryTime, observationStart),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entryTime: 2, exitTime: 10, observationStart: 0, observationEnd: 8 },
  output: { atRiskTime: 6 },
} satisfies ToolExample<Input, Output>;
export const personTimeIntervalAtRiskTool = H.defineSchemaCalculation<
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
    id: "biostatistics/person-time-interval-at-risk",
    title: "Person Time Interval At Risk",
    description:
      "Intersect one explicit entry/exit interval with a study observation window using half-open time boundaries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryTime: { type: "number" },
        exitTime: { type: "number" },
        observationStart: { type: "number" },
        observationEnd: { type: "number" },
      },
      required: ["entryTime", "exitTime", "observationStart", "observationEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { atRiskTime: { type: "number" } },
      required: ["atRiskTime"],
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
          id: "observationStart",
          label: "Observation Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observationEnd",
          label: "Observation End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "atRiskTime",
          label: "At Risk Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = personTimeIntervalAtRiskTool.execute;
export default personTimeIntervalAtRiskTool;
