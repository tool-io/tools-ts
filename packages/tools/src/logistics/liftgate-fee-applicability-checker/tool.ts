import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LiftgateFeeApplicabilityCheckerInput = {
  readonly destinationHasLoadingDock: boolean;
  readonly liftgateFeeUsd: number;
};

export type LiftgateFeeApplicabilityCheckerOutput = {
  readonly liftgateRequired: boolean;
  readonly estimatedFeeUsd: number;
};

export const calculateLiftgateFeeApplicabilityChecker = (
  input: LiftgateFeeApplicabilityCheckerInput,
): LiftgateFeeApplicabilityCheckerOutput => {
  if (typeof input.destinationHasLoadingDock !== "boolean")
    return simpleError(
      "destinationHasLoadingDock",
      "Loading-dock availability must be true or false.",
      "invalid_boolean",
    );
  if (!Number.isFinite(input.liftgateFeeUsd) || input.liftgateFeeUsd < 0)
    return simpleError(
      "liftgateFeeUsd",
      "The liftgate fee must be finite and non-negative.",
      "invalid_fee",
    );
  const liftgateRequired = !input.destinationHasLoadingDock;
  return {
    liftgateRequired,
    estimatedFeeUsd: liftgateRequired ? input.liftgateFeeUsd : 0,
  };
};

export const liftgateFeeApplicabilityCheckerExample = {
  input: { destinationHasLoadingDock: false, liftgateFeeUsd: 89 },
  output: { liftgateRequired: true, estimatedFeeUsd: 89 },
} satisfies ToolExample<
  LiftgateFeeApplicabilityCheckerInput,
  LiftgateFeeApplicabilityCheckerOutput
>;

export const liftgateFeeApplicabilityCheckerTool = createSimpleTool({
  id: "logistics/liftgate-fee-applicability-checker",
  title: "Liftgate Fee Applicability Checker",
  description:
    "Flag the liftgate accessorial when the delivery stop has no loading dock and price it with your tariff fee.",
  inputs: [
    {
      description:
        "Whether the delivery destination has a loading dock or forklift.",
      id: "destinationHasLoadingDock",
      kind: "boolean",
      label: "Has dock",
    },
    {
      description: "Liftgate fee in US dollars from your tariff.",
      id: "liftgateFeeUsd",
      kind: "number",
      label: "Fee",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Whether liftgate service is required at the stop.",
      id: "liftgateRequired",
      kind: "boolean",
      label: "Required",
    },
    {
      description: "Estimated fee in US dollars (zero when not required).",
      id: "estimatedFeeUsd",
      kind: "number",
      label: "Estimated fee",
    },
  ],
  calculate: (input) =>
    calculateLiftgateFeeApplicabilityChecker({
      destinationHasLoadingDock: input.destinationHasLoadingDock as boolean,
      liftgateFeeUsd: input.liftgateFeeUsd as number,
    }),
});

export const runLiftgateFeeApplicabilityChecker =
  liftgateFeeApplicabilityCheckerTool.execute;
export default liftgateFeeApplicabilityCheckerTool;
