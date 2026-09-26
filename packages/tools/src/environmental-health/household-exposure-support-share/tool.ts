import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly householdIds: readonly string[];
  readonly exposureWeights: readonly number[];
  readonly observationValid: readonly boolean[];
  readonly sourceVerified: readonly boolean[];
};
export type Output = {
  readonly totalExposureWeight: number;
  readonly supportedExposureWeight: number;
  readonly supportedHouseholds: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    householdIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    exposureWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    observationValid: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    sourceVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "householdIds",
    "exposureWeights",
    "observationValid",
    "sourceVerified",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalExposureWeight: { type: "number" },
    supportedExposureWeight: { type: "number" },
    supportedHouseholds: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "totalExposureWeight",
    "supportedExposureWeight",
    "supportedHouseholds",
    "share",
    "defined",
  ],
} as const;
/** Calculate household exposure support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { householdIds, exposureWeights, observationValid, sourceVerified } =
    request;
  const compute = (): Output => {
    H.sameLength(householdIds, exposureWeights);
    H.sameLength(householdIds, observationValid);
    H.sameLength(householdIds, sourceVerified);
    H.domain(exposureWeights.every((x) => x >= 0));
    return (() => {
      const totalExposureWeight = exposureWeights.reduce((a, b) => a + b, 0),
        supportedExposureWeight = exposureWeights.reduce(
          (s, x, i) => s + (observationValid[i] && sourceVerified[i] ? x : 0),
          0,
        ),
        supportedHouseholds = new Set(
          householdIds.filter(
            (x, i) => observationValid[i] && sourceVerified[i],
          ),
        ).size;
      return {
        totalExposureWeight,
        supportedExposureWeight,
        supportedHouseholds,
        share:
          totalExposureWeight > 0
            ? supportedExposureWeight / totalExposureWeight
            : 0,
        defined: totalExposureWeight > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    householdIds: ["a", "a", "b"],
    exposureWeights: [2, 3, 5],
    observationValid: [true, true, true],
    sourceVerified: [true, false, false],
  },
  output: {
    totalExposureWeight: 10,
    supportedExposureWeight: 2,
    supportedHouseholds: 1,
    share: 0.2,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const householdExposureSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-health/household-exposure-support-share",
    title: "Household Exposure Support Share Tool",
    description:
      "Calculate household exposure support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        householdIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        exposureWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        observationValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        sourceVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "householdIds",
        "exposureWeights",
        "observationValid",
        "sourceVerified",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalExposureWeight: { type: "number" },
        supportedExposureWeight: { type: "number" },
        supportedHouseholds: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "totalExposureWeight",
        "supportedExposureWeight",
        "supportedHouseholds",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "householdIds",
          label: "Household Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "exposureWeights",
          label: "Exposure Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "observationValid",
          label: "Observation Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sourceVerified",
          label: "Source Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "totalExposureWeight",
          label: "Total Exposure Weight",
          valueType: { type: "number" },
        },
        {
          id: "supportedExposureWeight",
          label: "Supported Exposure Weight",
          valueType: { type: "number" },
        },
        {
          id: "supportedHouseholds",
          label: "Supported Households",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = householdExposureSupportShareTool.execute;
export default householdExposureSupportShareTool;
