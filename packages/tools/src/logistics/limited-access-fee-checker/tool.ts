import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LimitedAccessFeeCheckerInput = {
  readonly siteType:
    | "commercial"
    | "farm"
    | "constructionSite"
    | "schoolOrChurch"
    | "militaryBase"
    | "selfStorage";
  readonly limitedAccessFeeUsd: number;
};

export type LimitedAccessFeeCheckerOutput = {
  readonly limitedAccessApplies: boolean;
  readonly estimatedFeeUsd: number;
};

const COMMERCIAL_SITE = "commercial";
const SITE_TYPES = new Set([
  "commercial",
  "farm",
  "constructionSite",
  "schoolOrChurch",
  "militaryBase",
  "selfStorage",
]);

export const calculateLimitedAccessFeeChecker = (
  input: LimitedAccessFeeCheckerInput,
): LimitedAccessFeeCheckerOutput => {
  if (!SITE_TYPES.has(input.siteType))
    return simpleError(
      "siteType",
      "The site type is not supported.",
      "invalid_site_type",
    );
  if (
    !Number.isFinite(input.limitedAccessFeeUsd) ||
    input.limitedAccessFeeUsd < 0
  )
    return simpleError(
      "limitedAccessFeeUsd",
      "The fee must be finite and non-negative.",
      "invalid_fee",
    );
  const limitedAccessApplies = input.siteType !== COMMERCIAL_SITE;
  return {
    limitedAccessApplies,
    estimatedFeeUsd: limitedAccessApplies ? input.limitedAccessFeeUsd : 0,
  };
};

export const limitedAccessFeeCheckerExample = {
  input: { siteType: "constructionSite", limitedAccessFeeUsd: 121.5 },
  output: { limitedAccessApplies: true, estimatedFeeUsd: 121.5 },
} satisfies ToolExample<
  LimitedAccessFeeCheckerInput,
  LimitedAccessFeeCheckerOutput
>;

export const limitedAccessFeeCheckerTool = createSimpleTool({
  id: "logistics/limited-access-fee-checker",
  title: "Limited Access Fee Checker",
  description:
    "Flag the limited-access accessorial for non-commercial stop types (farm, construction site, school or church, military base, self-storage) and price it with your tariff fee.",
  inputs: [
    {
      description: "Kind of delivery or pickup location.",
      enum: [
        "commercial",
        "farm",
        "constructionSite",
        "schoolOrChurch",
        "militaryBase",
        "selfStorage",
      ],
      id: "siteType",
      kind: "string",
      label: "Site type",
    },
    {
      description: "Limited-access fee in US dollars from your tariff.",
      id: "limitedAccessFeeUsd",
      kind: "number",
      label: "Fee",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Whether the limited-access fee applies.",
      id: "limitedAccessApplies",
      kind: "boolean",
      label: "Applies",
    },
    {
      description: "Estimated fee in US dollars (zero for commercial sites).",
      id: "estimatedFeeUsd",
      kind: "number",
      label: "Estimated fee",
    },
  ],
  calculate: (input) =>
    calculateLimitedAccessFeeChecker({
      limitedAccessFeeUsd: input.limitedAccessFeeUsd as number,
      siteType: input.siteType as LimitedAccessFeeCheckerInput["siteType"],
    }),
});

export const runLimitedAccessFeeChecker = limitedAccessFeeCheckerTool.execute;
export default limitedAccessFeeCheckerTool;
