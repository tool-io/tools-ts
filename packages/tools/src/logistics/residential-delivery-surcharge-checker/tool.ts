import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ResidentialDeliverySurchargeCheckerInput = {
  readonly deliveryLocationType: "residential" | "commercial";
  readonly residentialSurchargeUsd: number;
};

export type ResidentialDeliverySurchargeCheckerOutput = {
  readonly surchargeApplies: boolean;
  readonly estimatedFeeUsd: number;
};

export const calculateResidentialDeliverySurchargeChecker = (
  input: ResidentialDeliverySurchargeCheckerInput,
): ResidentialDeliverySurchargeCheckerOutput => {
  if (
    !Number.isFinite(input.residentialSurchargeUsd) ||
    input.residentialSurchargeUsd < 0
  )
    return simpleError(
      "residentialSurchargeUsd",
      "The surcharge cannot be negative.",
      "invalid_fee",
    );
  if (
    input.deliveryLocationType !== "residential" &&
    input.deliveryLocationType !== "commercial"
  )
    return simpleError(
      "deliveryLocationType",
      "Location type must be residential or commercial.",
      "invalid_location_type",
    );
  const surchargeApplies = input.deliveryLocationType === "residential";
  return {
    surchargeApplies,
    estimatedFeeUsd: surchargeApplies ? input.residentialSurchargeUsd : 0,
  };
};

export const residentialDeliverySurchargeCheckerExample = {
  input: { deliveryLocationType: "residential", residentialSurchargeUsd: 5.75 },
  output: { surchargeApplies: true, estimatedFeeUsd: 5.75 },
} satisfies ToolExample<
  ResidentialDeliverySurchargeCheckerInput,
  ResidentialDeliverySurchargeCheckerOutput
>;

export const residentialDeliverySurchargeCheckerTool = createSimpleTool({
  id: "logistics/residential-delivery-surcharge-checker",
  title: "Residential Delivery Surcharge Checker",
  description:
    "Apply the residential delivery surcharge when the stop is classified as a residence and price it with your tariff fee.",
  inputs: [
    {
      description: "Classification of the delivery stop.",
      enum: ["residential", "commercial"],
      id: "deliveryLocationType",
      kind: "string",
      label: "Location type",
    },
    {
      description: "Residential surcharge in US dollars from your tariff.",
      id: "residentialSurchargeUsd",
      kind: "number",
      label: "Surcharge",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Whether the residential surcharge applies.",
      id: "surchargeApplies",
      kind: "boolean",
      label: "Applies",
    },
    {
      description: "Estimated fee in US dollars (zero for commercial stops).",
      id: "estimatedFeeUsd",
      kind: "number",
      label: "Estimated fee",
    },
  ],
  calculate: (input) =>
    calculateResidentialDeliverySurchargeChecker({
      deliveryLocationType: input.deliveryLocationType as
        "residential" | "commercial",
      residentialSurchargeUsd: input.residentialSurchargeUsd as number,
    }),
});

export const runResidentialDeliverySurchargeChecker =
  residentialDeliverySurchargeCheckerTool.execute;
export default residentialDeliverySurchargeCheckerTool;
