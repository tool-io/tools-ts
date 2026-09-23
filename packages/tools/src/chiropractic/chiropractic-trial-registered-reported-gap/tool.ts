import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly registered: readonly string[];
  readonly reported: readonly string[];
};
export type Output = {
  readonly omitted: readonly string[];
  readonly unregistered: readonly string[];
  readonly reportedRegistered: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    registered: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    reported: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["registered", "reported"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    omitted: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unregistered: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    reportedRegistered: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["omitted", "unregistered", "reportedRegistered"],
} as const;
/** Compare supplied registered and reported outcome identifiers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { registered, reported } = request;
  const compute = (): Output => {
    H.domain(
      new Set(registered).size === registered.length &&
        new Set(reported).size === reported.length,
    );
    return {
      omitted: registered.filter((x) => !reported.includes(x)),
      unregistered: reported.filter((x) => !registered.includes(x)),
      reportedRegistered: registered.filter((x) => reported.includes(x)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    registered: ["pain", "function"],
    reported: ["pain", "satisfaction"],
  },
  output: {
    omitted: ["function"],
    unregistered: ["satisfaction"],
    reportedRegistered: ["pain"],
  },
} satisfies ToolExample<Input, Output>;
export const chiropracticTrialRegisteredReportedGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chiropractic/chiropractic-trial-registered-reported-gap",
      title: "Chiropractic Trial Registered Reported Gap Tool",
      description:
        "Compare supplied registered and reported outcome identifiers.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          registered: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          reported: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["registered", "reported"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          omitted: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          unregistered: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          reportedRegistered: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["omitted", "unregistered", "reportedRegistered"],
      },
      ports: {
        inputs: [
          {
            id: "registered",
            label: "Registered",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "reported",
            label: "Reported",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "omitted",
            label: "Omitted",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "unregistered",
            label: "Unregistered",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "reportedRegistered",
            label: "Reported Registered",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = chiropracticTrialRegisteredReportedGapTool.execute;
export default chiropracticTrialRegisteredReportedGapTool;
