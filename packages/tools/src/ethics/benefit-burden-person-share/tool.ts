import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personBenefit: number;
  readonly totalBenefit: number;
  readonly personBurden: number;
  readonly totalBurden: number;
};
export type Output = {
  readonly benefitShare: number;
  readonly burdenShare: number;
  readonly shareGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personBenefit: { type: "number", minimum: 0 },
    totalBenefit: { type: "number", exclusiveMinimum: 0 },
    personBurden: { type: "number", minimum: 0 },
    totalBurden: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["personBenefit", "totalBenefit", "personBurden", "totalBurden"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    benefitShare: { type: "number" },
    burdenShare: { type: "number" },
    shareGap: { type: "number" },
  },
  required: ["benefitShare", "burdenShare", "shareGap"],
} as const;
/** Compare a person's supplied shares of total benefit and burden without deciding fairness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personBenefit, totalBenefit, personBurden, totalBurden } = request;
  const compute = (): Output => {
    (H.domain(totalBenefit > 0, "totalBenefit"), totalBenefit);
    (H.domain(totalBurden > 0, "totalBurden"), totalBurden);
    H.domain(
      personBenefit >= 0 &&
        personBenefit <= totalBenefit &&
        personBurden >= 0 &&
        personBurden <= totalBurden,
      "personBenefit",
    );
    return {
      benefitShare: personBenefit / totalBenefit,
      burdenShare: personBurden / totalBurden,
      shareGap: personBenefit / totalBenefit - personBurden / totalBurden,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    personBenefit: 20,
    totalBenefit: 100,
    personBurden: 30,
    totalBurden: 100,
  },
  output: {
    benefitShare: 0.2,
    burdenShare: 0.3,
    shareGap: -0.09999999999999998,
  },
} satisfies ToolExample<Input, Output>;
export const benefitBurdenPersonShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/benefit-burden-person-share",
    title: "Benefit Burden Person Share Tool",
    description:
      "Compare a person's supplied shares of total benefit and burden without deciding fairness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personBenefit: { type: "number", minimum: 0 },
        totalBenefit: { type: "number", exclusiveMinimum: 0 },
        personBurden: { type: "number", minimum: 0 },
        totalBurden: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "personBenefit",
        "totalBenefit",
        "personBurden",
        "totalBurden",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        benefitShare: { type: "number" },
        burdenShare: { type: "number" },
        shareGap: { type: "number" },
      },
      required: ["benefitShare", "burdenShare", "shareGap"],
    },
    ports: {
      inputs: [
        {
          id: "personBenefit",
          label: "Person Benefit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalBenefit",
          label: "Total Benefit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "personBurden",
          label: "Person Burden",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalBurden",
          label: "Total Burden",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "benefitShare",
          label: "Benefit Share",
          valueType: { type: "number" },
        },
        {
          id: "burdenShare",
          label: "Burden Share",
          valueType: { type: "number" },
        },
        { id: "shareGap", label: "Share Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = benefitBurdenPersonShareTool.execute;
export default benefitBurdenPersonShareTool;
