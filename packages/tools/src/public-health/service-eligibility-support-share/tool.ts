import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly populationWeights: readonly number[];
  readonly eligible: readonly boolean[];
  readonly eligibilityVerified: readonly boolean[];
  readonly serviceObserved: readonly boolean[];
};
export type Output = {
  readonly eligibleWeight: number;
  readonly verifiedServiceWeight: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    populationWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    eligible: { type: "array", maxItems: 256, items: { type: "boolean" } },
    eligibilityVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    serviceObserved: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "populationWeights",
    "eligible",
    "eligibilityVerified",
    "serviceObserved",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleWeight: { type: "number" },
    verifiedServiceWeight: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["eligibleWeight", "verifiedServiceWeight", "share", "defined"],
} as const;
/** Use explicitly supplied eligibility and verification flags; no public-health eligibility rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { populationWeights, eligible, eligibilityVerified, serviceObserved } =
    request;
  const compute = (): Output => {
    H.sameLength(populationWeights, eligible);
    H.sameLength(populationWeights, eligibilityVerified);
    H.sameLength(populationWeights, serviceObserved);
    H.domain(populationWeights.every((x) => x >= 0));
    return (() => {
      const eligibleWeight = populationWeights.reduce(
          (s, x, i) => s + (eligible[i] ? x : 0),
          0,
        ),
        verifiedServiceWeight = populationWeights.reduce(
          (s, x, i) =>
            s +
            (eligible[i] && eligibilityVerified[i] && serviceObserved[i]
              ? x
              : 0),
          0,
        );
      return {
        eligibleWeight,
        verifiedServiceWeight,
        share: eligibleWeight > 0 ? verifiedServiceWeight / eligibleWeight : 0,
        defined: eligibleWeight > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    populationWeights: [2, 3, 5],
    eligible: [true, true, false],
    eligibilityVerified: [true, true, true],
    serviceObserved: [true, false, true],
  },
  output: {
    eligibleWeight: 5,
    verifiedServiceWeight: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const serviceEligibilitySupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-health/service-eligibility-support-share",
    title: "Service Eligibility Support Share Tool",
    description:
      "Use explicitly supplied eligibility and verification flags; no public-health eligibility rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        populationWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        eligible: { type: "array", maxItems: 256, items: { type: "boolean" } },
        eligibilityVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        serviceObserved: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "populationWeights",
        "eligible",
        "eligibilityVerified",
        "serviceObserved",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleWeight: { type: "number" },
        verifiedServiceWeight: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["eligibleWeight", "verifiedServiceWeight", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "populationWeights",
          label: "Population Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "eligible",
          label: "Eligible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "eligibilityVerified",
          label: "Eligibility Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "serviceObserved",
          label: "Service Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "eligibleWeight",
          label: "Eligible Weight",
          valueType: { type: "number" },
        },
        {
          id: "verifiedServiceWeight",
          label: "Verified Service Weight",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = serviceEligibilitySupportShareTool.execute;
export default serviceEligibilitySupportShareTool;
