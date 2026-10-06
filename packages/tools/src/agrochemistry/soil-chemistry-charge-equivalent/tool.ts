import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amountMillimoles: number;
  readonly chargeMagnitude: number;
};
export type Output = { readonly chargeMillimoles: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amountMillimoles: { type: "number", minimum: 0 },
    chargeMagnitude: { type: "integer", minimum: 1 },
  },
  required: ["amountMillimoles", "chargeMagnitude"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { chargeMillimoles: { type: "number" } },
  required: ["chargeMillimoles"],
} as const;
/** Multiply explicit millimoles of ions by a supplied absolute charge number to obtain millimoles of charge. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amountMillimoles, chargeMagnitude } = request;
  const compute = (): Output => {
    H.domain(amountMillimoles >= 0, "amountMillimoles");
    (H.domain(
      Number.isSafeInteger(chargeMagnitude) &&
        chargeMagnitude >= 1 &&
        chargeMagnitude <= Number.MAX_SAFE_INTEGER,
      "chargeMagnitude",
    ),
      chargeMagnitude);
    return { chargeMillimoles: amountMillimoles * chargeMagnitude };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amountMillimoles: 2.5, chargeMagnitude: 2 },
  output: { chargeMillimoles: 5 },
} satisfies ToolExample<Input, Output>;
export const soilChemistryChargeEquivalentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "learn"],
      fields: ["agrochemistry", "agriculture"],
      keywords: ["agrochemistry", "agriculture"],
    },
    id: "agrochemistry/soil-chemistry-charge-equivalent",
    title: "Soil Chemistry Charge Equivalent",
    description:
      "Multiply explicit millimoles of ions by a supplied absolute charge number to obtain millimoles of charge.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amountMillimoles: { type: "number", minimum: 0 },
        chargeMagnitude: { type: "integer", minimum: 1 },
      },
      required: ["amountMillimoles", "chargeMagnitude"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { chargeMillimoles: { type: "number" } },
      required: ["chargeMillimoles"],
    },
    ports: {
      inputs: [
        {
          id: "amountMillimoles",
          label: "Amount Millimoles",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "chargeMagnitude",
          label: "Charge Magnitude",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "chargeMillimoles",
          label: "Charge Millimoles",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilChemistryChargeEquivalentTool.execute;
export default soilChemistryChargeEquivalentTool;
