import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryTime: number;
  readonly plannedEnd: number;
  readonly censorTime: number;
  readonly censored: boolean;
};
export type Output = {
  readonly effectiveEnd: number;
  readonly exposureDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryTime: { type: "number" },
    plannedEnd: { type: "number" },
    censorTime: { type: "number" },
    censored: { type: "boolean" },
  },
  required: ["entryTime", "plannedEnd", "censorTime", "censored"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveEnd: { type: "number" },
    exposureDuration: { type: "number" },
  },
  required: ["effectiveEnd", "exposureDuration"],
} as const;
/** Choose a supplied censoring or planned follow-up endpoint without inferring censoring status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryTime, plannedEnd, censorTime, censored } = request;
  const compute = (): Output => {
    H.domain(plannedEnd >= entryTime, "plannedEnd");
    H.domain(!censored || censorTime >= entryTime, "censored");
    return (() => {
      const effectiveEnd = censored
        ? Math.min(plannedEnd, censorTime)
        : plannedEnd;
      return { effectiveEnd, exposureDuration: effectiveEnd - entryTime };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entryTime: 2, plannedEnd: 12, censorTime: 8, censored: true },
  output: { effectiveEnd: 8, exposureDuration: 6 },
} satisfies ToolExample<Input, Output>;
export const followupExposureCensoringEndTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["epidemiology", "health and medicine"],
      keywords: ["epidemiology", "health and medicine"],
    },
    id: "epidemiology/follow-up-exposure-censoring-end",
    title: "Follow Up Exposure Censoring End",
    description:
      "Choose a supplied censoring or planned follow-up endpoint without inferring censoring status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryTime: { type: "number" },
        plannedEnd: { type: "number" },
        censorTime: { type: "number" },
        censored: { type: "boolean" },
      },
      required: ["entryTime", "plannedEnd", "censorTime", "censored"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveEnd: { type: "number" },
        exposureDuration: { type: "number" },
      },
      required: ["effectiveEnd", "exposureDuration"],
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
          id: "plannedEnd",
          label: "Planned End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "censorTime",
          label: "Censor Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "censored",
          label: "Censored",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "effectiveEnd",
          label: "Effective End",
          valueType: { type: "number" },
        },
        {
          id: "exposureDuration",
          label: "Exposure Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = followupExposureCensoringEndTool.execute;
export default followupExposureCensoringEndTool;
