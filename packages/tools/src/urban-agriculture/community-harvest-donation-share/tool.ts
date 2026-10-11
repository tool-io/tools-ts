import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly donatedHarvestMass: number;
  readonly totalHarvestMass: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    donatedHarvestMass: { type: "number", minimum: 0 },
    totalHarvestMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["donatedHarvestMass", "totalHarvestMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize explicitly donated harvest mass to compatible total harvest mass. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { donatedHarvestMass, totalHarvestMass } = request;
  const compute = (): Output => {
    (H.domain(totalHarvestMass > 0, "totalHarvestMass"), totalHarvestMass);
    H.domain(
      donatedHarvestMass >= 0 && donatedHarvestMass <= totalHarvestMass,
      "donatedHarvestMass",
    );
    return {
      fraction: donatedHarvestMass / totalHarvestMass,
      remainder: totalHarvestMass - donatedHarvestMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { donatedHarvestMass: 30, totalHarvestMass: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const communityHarvestDonationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["urban-agriculture", "urban agriculture", "agriculture"],
      keywords: ["urban agriculture", "agriculture"],
    },
    id: "urban-agriculture/community-harvest-donation-share",
    title: "Community Harvest Donation Share",
    description:
      "Normalize explicitly donated harvest mass to compatible total harvest mass.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        donatedHarvestMass: { type: "number", minimum: 0 },
        totalHarvestMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["donatedHarvestMass", "totalHarvestMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "donatedHarvestMass",
          label: "Donated Harvest Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalHarvestMass",
          label: "Total Harvest Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = communityHarvestDonationShareTool.execute;
export default communityHarvestDonationShareTool;
