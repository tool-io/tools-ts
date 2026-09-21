import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleAreas: readonly number[];
  readonly rates: readonly number[];
  readonly suppliedCap: number;
  readonly alreadyReceived: number;
};
export type Output = {
  readonly unlimitedSupport: number;
  readonly remainingCap: number;
  readonly margin: number;
  readonly appliedAdditionalSupport: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleAreas: { type: "array", maxItems: 256, items: { type: "number" } },
    rates: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedCap: { type: "number", minimum: 0 },
    alreadyReceived: { type: "number", minimum: 0 },
  },
  required: ["eligibleAreas", "rates", "suppliedCap", "alreadyReceived"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unlimitedSupport: { type: "number" },
    remainingCap: { type: "number" },
    margin: { type: "number" },
    appliedAdditionalSupport: { type: "number" },
  },
  required: [
    "unlimitedSupport",
    "remainingCap",
    "margin",
    "appliedAdditionalSupport",
  ],
} as const;
/** Apply explicit area rates and a remaining support cap; no program eligibility is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleAreas, rates, suppliedCap, alreadyReceived } = request;
  const compute = (): Output => {
    H.sameLength(eligibleAreas, rates);
    H.domain(
      [...eligibleAreas, ...rates].every((x) => x >= 0) &&
        suppliedCap >= 0 &&
        alreadyReceived >= 0,
    );
    return (() => {
      const unlimitedSupport = eligibleAreas.reduce(
          (s, x, i) => s + x * rates[i],
          0,
        ),
        remainingCap = Math.max(0, suppliedCap - alreadyReceived);
      return {
        unlimitedSupport,
        remainingCap,
        margin: remainingCap - unlimitedSupport,
        appliedAdditionalSupport: Math.min(unlimitedSupport, remainingCap),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligibleAreas: [2, 3],
    rates: [10, 20],
    suppliedCap: 100,
    alreadyReceived: 30,
  },
  output: {
    unlimitedSupport: 80,
    remainingCap: 70,
    margin: -10,
    appliedAdditionalSupport: 70,
  },
} satisfies ToolExample<Input, Output>;
export const farmSupportCapMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/farm-support-cap-margin",
    title: "Farm Support Cap Margin Tool",
    description:
      "Apply explicit area rates and a remaining support cap; no program eligibility is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        rates: { type: "array", maxItems: 256, items: { type: "number" } },
        suppliedCap: { type: "number", minimum: 0 },
        alreadyReceived: { type: "number", minimum: 0 },
      },
      required: ["eligibleAreas", "rates", "suppliedCap", "alreadyReceived"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unlimitedSupport: { type: "number" },
        remainingCap: { type: "number" },
        margin: { type: "number" },
        appliedAdditionalSupport: { type: "number" },
      },
      required: [
        "unlimitedSupport",
        "remainingCap",
        "margin",
        "appliedAdditionalSupport",
      ],
    },
    ports: {
      inputs: [
        {
          id: "eligibleAreas",
          label: "Eligible Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "rates",
          label: "Rates",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedCap",
          label: "Supplied Cap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alreadyReceived",
          label: "Already Received",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unlimitedSupport",
          label: "Unlimited Support",
          valueType: { type: "number" },
        },
        {
          id: "remainingCap",
          label: "Remaining Cap",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        {
          id: "appliedAdditionalSupport",
          label: "Applied Additional Support",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmSupportCapMarginTool.execute;
export default farmSupportCapMarginTool;
