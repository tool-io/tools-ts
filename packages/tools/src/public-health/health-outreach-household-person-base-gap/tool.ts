import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly households: number;
  readonly reachedHouseholds: number;
  readonly eligiblePeople: number;
  readonly reachedPeople: number;
};
export type Output = {
  readonly householdShare: number;
  readonly personShare: number;
  readonly percentagePointGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    households: { type: "integer", minimum: 1 },
    reachedHouseholds: { type: "integer", minimum: 0 },
    eligiblePeople: { type: "integer", minimum: 1 },
    reachedPeople: { type: "integer", minimum: 0 },
  },
  required: [
    "households",
    "reachedHouseholds",
    "eligiblePeople",
    "reachedPeople",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    householdShare: { type: "number" },
    personShare: { type: "number" },
    percentagePointGap: { type: "number" },
  },
  required: ["householdShare", "personShare", "percentagePointGap"],
} as const;
/** Compare household and person coverage without exchanging denominators. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { households, reachedHouseholds, eligiblePeople, reachedPeople } =
    request;
  const compute = (): Output => {
    H.integer(households, 1);
    H.integer(reachedHouseholds, 0, households);
    H.integer(eligiblePeople, 1);
    H.integer(reachedPeople, 0, eligiblePeople);
    return {
      householdShare: reachedHouseholds / households,
      personShare: reachedPeople / eligiblePeople,
      percentagePointGap:
        100 * (reachedPeople / eligiblePeople - reachedHouseholds / households),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    households: 100,
    reachedHouseholds: 60,
    eligiblePeople: 400,
    reachedPeople: 200,
  },
  output: {
    householdShare: 0.6,
    personShare: 0.5,
    percentagePointGap: -9.999999999999998,
  },
} satisfies ToolExample<Input, Output>;
export const healthOutreachHouseholdPersonBaseGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-health/health-outreach-household-person-base-gap",
      title: "Health Outreach Household Person Base Gap Tool",
      description:
        "Compare household and person coverage without exchanging denominators.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          households: { type: "integer", minimum: 1 },
          reachedHouseholds: { type: "integer", minimum: 0 },
          eligiblePeople: { type: "integer", minimum: 1 },
          reachedPeople: { type: "integer", minimum: 0 },
        },
        required: [
          "households",
          "reachedHouseholds",
          "eligiblePeople",
          "reachedPeople",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          householdShare: { type: "number" },
          personShare: { type: "number" },
          percentagePointGap: { type: "number" },
        },
        required: ["householdShare", "personShare", "percentagePointGap"],
      },
      ports: {
        inputs: [
          {
            id: "households",
            label: "Households",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reachedHouseholds",
            label: "Reached Households",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "eligiblePeople",
            label: "Eligible People",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reachedPeople",
            label: "Reached People",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "householdShare",
            label: "Household Share",
            valueType: { type: "number" },
          },
          {
            id: "personShare",
            label: "Person Share",
            valueType: { type: "number" },
          },
          {
            id: "percentagePointGap",
            label: "Percentage Point Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthOutreachHouseholdPersonBaseGapTool.execute;
export default healthOutreachHouseholdPersonBaseGapTool;
