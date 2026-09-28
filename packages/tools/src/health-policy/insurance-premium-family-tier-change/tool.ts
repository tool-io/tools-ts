import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldMonthly: number;
  readonly newMonthly: number;
  readonly oldDays: number;
  readonly newDays: number;
  readonly monthDays: number;
  readonly credits: number;
};
export type Output = {
  readonly oldProration: number;
  readonly newProration: number;
  readonly netPremium: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldMonthly: { type: "number", minimum: 0 },
    newMonthly: { type: "number", minimum: 0 },
    oldDays: { type: "integer", minimum: 0 },
    newDays: { type: "integer", minimum: 0 },
    monthDays: { type: "integer", minimum: 1, maximum: 31 },
    credits: { type: "number", minimum: 0 },
  },
  required: [
    "oldMonthly",
    "newMonthly",
    "oldDays",
    "newDays",
    "monthDays",
    "credits",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldProration: { type: "number" },
    newProration: { type: "number" },
    netPremium: { type: "number" },
  },
  required: ["oldProration", "newProration", "netPremium"],
} as const;
/** Calculate insurance premium family tier change from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldMonthly, newMonthly, oldDays, newDays, monthDays, credits } =
    request;
  const compute = (): Output => {
    H.integer(monthDays, 1, 31);
    H.integer(oldDays, 0);
    H.integer(newDays, 0);
    H.domain(
      oldDays + newDays <= monthDays &&
        oldMonthly >= 0 &&
        newMonthly >= 0 &&
        credits >= 0,
    );
    return {
      oldProration: (oldMonthly * oldDays) / monthDays,
      newProration: (newMonthly * newDays) / monthDays,
      netPremium:
        (oldMonthly * oldDays + newMonthly * newDays) / monthDays - credits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    oldMonthly: 100,
    newMonthly: 200,
    oldDays: 10,
    newDays: 20,
    monthDays: 30,
    credits: 5,
  },
  output: {
    oldProration: 33.333333333333336,
    newProration: 133.33333333333334,
    netPremium: 161.66666666666666,
  },
} satisfies ToolExample<Input, Output>;
export const insurancePremiumFamilyTierChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/insurance-premium-family-tier-change",
    title: "Insurance Premium Family Tier Change Tool",
    description:
      "Calculate insurance premium family tier change from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldMonthly: { type: "number", minimum: 0 },
        newMonthly: { type: "number", minimum: 0 },
        oldDays: { type: "integer", minimum: 0 },
        newDays: { type: "integer", minimum: 0 },
        monthDays: { type: "integer", minimum: 1, maximum: 31 },
        credits: { type: "number", minimum: 0 },
      },
      required: [
        "oldMonthly",
        "newMonthly",
        "oldDays",
        "newDays",
        "monthDays",
        "credits",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldProration: { type: "number" },
        newProration: { type: "number" },
        netPremium: { type: "number" },
      },
      required: ["oldProration", "newProration", "netPremium"],
    },
    ports: {
      inputs: [
        {
          id: "oldMonthly",
          label: "Old Monthly",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newMonthly",
          label: "New Monthly",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldDays",
          label: "Old Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "newDays",
          label: "New Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "monthDays",
          label: "Month Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "credits",
          label: "Credits",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "oldProration",
          label: "Old Proration",
          valueType: { type: "number" },
        },
        {
          id: "newProration",
          label: "New Proration",
          valueType: { type: "number" },
        },
        {
          id: "netPremium",
          label: "Net Premium",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = insurancePremiumFamilyTierChangeTool.execute;
export default insurancePremiumFamilyTierChangeTool;
