import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly directDays: number;
  readonly proxyOnlyDays: number;
  readonly unknownDays: number;
  readonly includeProxy: boolean;
};
export type Output = {
  readonly knownDays: number;
  readonly denominatorDays: number;
  readonly coverageDefined: boolean;
  readonly coverage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    directDays: { type: "integer", minimum: 0 },
    proxyOnlyDays: { type: "integer", minimum: 0 },
    unknownDays: { type: "integer", minimum: 0 },
    includeProxy: { type: "boolean" },
  },
  required: ["directDays", "proxyOnlyDays", "unknownDays", "includeProxy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knownDays: { type: "integer" },
    denominatorDays: { type: "integer" },
    coverageDefined: { type: "boolean" },
    coverage: { type: "number" },
  },
  required: ["knownDays", "denominatorDays", "coverageDefined", "coverage"],
} as const;
/** Coverage bookkeeping for disjoint supplied direct, proxy-only and unknown reporting days. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { directDays, proxyOnlyDays, unknownDays, includeProxy } = request;
  const compute = (): Output => {
    H.integer(directDays, 0);
    H.integer(proxyOnlyDays, 0);
    H.integer(unknownDays, 0);
    return {
      knownDays: directDays + (includeProxy ? proxyOnlyDays : 0),
      denominatorDays: directDays + proxyOnlyDays + unknownDays,
      coverageDefined: directDays + proxyOnlyDays + unknownDays > 0,
      coverage:
        directDays + proxyOnlyDays + unknownDays > 0
          ? (directDays + (includeProxy ? proxyOnlyDays : 0)) /
            (directDays + proxyOnlyDays + unknownDays)
          : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    directDays: 5,
    proxyOnlyDays: 3,
    unknownDays: 2,
    includeProxy: true,
  },
  output: {
    knownDays: 8,
    denominatorDays: 10,
    coverageDefined: true,
    coverage: 0.8,
  },
} satisfies ToolExample<Input, Output>;
export const caregiverReportWindowBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pediatrics/caregiver-report-window-base-flag",
    title: "Caregiver Report Window Base Flag Tool",
    description:
      "Coverage bookkeeping for disjoint supplied direct, proxy-only and unknown reporting days.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        directDays: { type: "integer", minimum: 0 },
        proxyOnlyDays: { type: "integer", minimum: 0 },
        unknownDays: { type: "integer", minimum: 0 },
        includeProxy: { type: "boolean" },
      },
      required: ["directDays", "proxyOnlyDays", "unknownDays", "includeProxy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        knownDays: { type: "integer" },
        denominatorDays: { type: "integer" },
        coverageDefined: { type: "boolean" },
        coverage: { type: "number" },
      },
      required: ["knownDays", "denominatorDays", "coverageDefined", "coverage"],
    },
    ports: {
      inputs: [
        {
          id: "directDays",
          label: "Direct Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "proxyOnlyDays",
          label: "Proxy Only Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unknownDays",
          label: "Unknown Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeProxy",
          label: "Include Proxy",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "knownDays",
          label: "Known Days",
          valueType: { type: "integer" },
        },
        {
          id: "denominatorDays",
          label: "Denominator Days",
          valueType: { type: "integer" },
        },
        {
          id: "coverageDefined",
          label: "Coverage Defined",
          valueType: { type: "boolean" },
        },
        { id: "coverage", label: "Coverage", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = caregiverReportWindowBaseFlagTool.execute;
export default caregiverReportWindowBaseFlagTool;
