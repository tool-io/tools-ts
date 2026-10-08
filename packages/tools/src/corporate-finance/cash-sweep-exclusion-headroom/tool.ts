import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashAvailable: number;
  readonly suppliedExclusions: number;
  readonly requiredMinimumCash: number;
};
export type Output = {
  readonly rawSweepHeadroom: number;
  readonly nonnegativeSweep: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashAvailable: { type: "number", minimum: 0 },
    suppliedExclusions: { type: "number", minimum: 0 },
    requiredMinimumCash: { type: "number", minimum: 0 },
  },
  required: ["cashAvailable", "suppliedExclusions", "requiredMinimumCash"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawSweepHeadroom: { type: "number" },
    nonnegativeSweep: { type: "number" },
  },
  required: ["rawSweepHeadroom", "nonnegativeSweep"],
} as const;
/** Calculate cash-sweep headroom from explicit cash, exclusions and retained minimum without selecting loan terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cashAvailable, suppliedExclusions, requiredMinimumCash } = request;
  const compute = (): Output => {
    H.domain(cashAvailable >= 0, "cashAvailable");
    H.domain(suppliedExclusions >= 0, "suppliedExclusions");
    H.domain(requiredMinimumCash >= 0, "requiredMinimumCash");
    return (() => {
      const rawSweepHeadroom =
        cashAvailable - suppliedExclusions - requiredMinimumCash;
      return {
        rawSweepHeadroom,
        nonnegativeSweep: Math.max(0, rawSweepHeadroom),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cashAvailable: 1000,
    suppliedExclusions: 200,
    requiredMinimumCash: 300,
  },
  output: { rawSweepHeadroom: 500, nonnegativeSweep: 500 },
} satisfies ToolExample<Input, Output>;
export const cashSweepExclusionHeadroomTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: [
        "corporate-finance",
        "corporate finance",
        "business and finance",
      ],
      keywords: ["corporate finance", "business and finance"],
    },
    id: "corporate-finance/cash-sweep-exclusion-headroom",
    title: "Cash Sweep Exclusion Headroom",
    description:
      "Calculate cash-sweep headroom from explicit cash, exclusions and retained minimum without selecting loan terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cashAvailable: { type: "number", minimum: 0 },
        suppliedExclusions: { type: "number", minimum: 0 },
        requiredMinimumCash: { type: "number", minimum: 0 },
      },
      required: ["cashAvailable", "suppliedExclusions", "requiredMinimumCash"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawSweepHeadroom: { type: "number" },
        nonnegativeSweep: { type: "number" },
      },
      required: ["rawSweepHeadroom", "nonnegativeSweep"],
    },
    ports: {
      inputs: [
        {
          id: "cashAvailable",
          label: "Cash Available",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedExclusions",
          label: "Supplied Exclusions",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredMinimumCash",
          label: "Required Minimum Cash",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rawSweepHeadroom",
          label: "Raw Sweep Headroom",
          valueType: { type: "number" },
        },
        {
          id: "nonnegativeSweep",
          label: "Nonnegative Sweep",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cashSweepExclusionHeadroomTool.execute;
export default cashSweepExclusionHeadroomTool;
