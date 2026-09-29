import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly times: readonly number[];
  readonly maximumGap: number;
};
export type Output = {
  readonly gaps: readonly number[];
  readonly exceededIndices: readonly number[];
  readonly longestGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    times: { type: "array", maxItems: 256, items: { type: "number" } },
    maximumGap: { type: "number" },
  },
  required: ["times", "maximumGap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gaps: { type: "array", maxItems: 256, items: { type: "number" } },
    exceededIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    longestGap: { type: "number" },
  },
  required: ["gaps", "exceededIndices", "longestGap"],
} as const;
/** Audit logger observation gaps without inferring temperature compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { times, maximumGap } = request;
  const compute = (): Output => {
    H.domain(
      times.length >= 1 &&
        times.every((x, i) => i === 0 || x > times[i - 1]) &&
        maximumGap >= 0,
    );
    const gaps = times.slice(1).map((x, i) => x - times[i]);
    return {
      gaps,
      exceededIndices: gaps.flatMap((x, i) => (x > maximumGap ? [i] : [])),
      longestGap: Math.max(0, ...gaps),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { times: [0, 5, 20, 25], maximumGap: 10 },
  output: { gaps: [5, 15, 5], exceededIndices: [1], longestGap: 15 },
} satisfies ToolExample<Input, Output>;
export const hospitalPharmacyColdChainRecordGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/hospital-pharmacy-cold-chain-record-gap",
    title: "Hospital Pharmacy Cold Chain Record Gap Tool",
    description:
      "Audit logger observation gaps without inferring temperature compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        times: { type: "array", maxItems: 256, items: { type: "number" } },
        maximumGap: { type: "number" },
      },
      required: ["times", "maximumGap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gaps: { type: "array", maxItems: 256, items: { type: "number" } },
        exceededIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        longestGap: { type: "number" },
      },
      required: ["gaps", "exceededIndices", "longestGap"],
    },
    ports: {
      inputs: [
        {
          id: "times",
          label: "Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "maximumGap",
          label: "Maximum Gap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "gaps",
          label: "Gaps",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "exceededIndices",
          label: "Exceeded Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "longestGap",
          label: "Longest Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hospitalPharmacyColdChainRecordGapTool.execute;
export default hospitalPharmacyColdChainRecordGapTool;
