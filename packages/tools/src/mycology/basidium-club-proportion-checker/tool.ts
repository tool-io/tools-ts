import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BasidiumClubProportionCheckerInput = {
  readonly basidiumLengthUm: number;
  readonly basidiumWidthUm: number;
  readonly maximumReferenceRatio?: number;
  readonly minimumReferenceRatio?: number;
};

export type BasidiumClubProportionCheckerOutput = {
  readonly lengthToWidthRatio: number;
  readonly withinReferenceRatioRange: boolean;
};

export const basidiumClubProportionCheckerExample = {
  input: { basidiumLengthUm: 20, basidiumWidthUm: 5 },
  output: { lengthToWidthRatio: 4, withinReferenceRatioRange: true },
} satisfies ToolExample<
  BasidiumClubProportionCheckerInput,
  BasidiumClubProportionCheckerOutput
>;

export const calculateBasidiumClubProportionChecker = (
  input: BasidiumClubProportionCheckerInput,
): BasidiumClubProportionCheckerOutput => {
  const minimumReferenceRatio = input.minimumReferenceRatio ?? 2;
  const maximumReferenceRatio = input.maximumReferenceRatio ?? 5;
  if (!Number.isFinite(input.basidiumLengthUm) || input.basidiumLengthUm <= 0)
    return simpleError("basidiumLengthUm", "Basidium length must be positive.");
  if (!Number.isFinite(input.basidiumWidthUm) || input.basidiumWidthUm <= 0)
    return simpleError("basidiumWidthUm", "Basidium width must be positive.");
  if (
    !Number.isFinite(minimumReferenceRatio) ||
    !Number.isFinite(maximumReferenceRatio) ||
    minimumReferenceRatio < 0 ||
    maximumReferenceRatio <= minimumReferenceRatio
  )
    return simpleError(
      "maximumReferenceRatio",
      "The maximum reference ratio must be greater than a non-negative minimum.",
    );
  const lengthToWidthRatio = input.basidiumLengthUm / input.basidiumWidthUm;
  if (!Number.isFinite(lengthToWidthRatio))
    return simpleError(
      "basidiumLengthUm",
      "The length-to-width ratio is outside the representable range.",
    );
  return {
    lengthToWidthRatio,
    withinReferenceRatioRange:
      lengthToWidthRatio >= minimumReferenceRatio &&
      lengthToWidthRatio <= maximumReferenceRatio,
  };
};

export const basidiumClubProportionCheckerTool = createSimpleTool({
  id: "mycology/basidium-club-proportion-checker",
  title: "Basidium Proportion Reference Check",
  description:
    "Calculate a basidium length-to-width ratio and compare it with a caller-adjustable reference range. Ratio alone does not establish club-shaped morphology, which also depends on the outline and apical widening.",
  inputs: [
    {
      id: "basidiumLengthUm",
      kind: "number",
      label: "Basidium length",
      minimum: Number.MIN_VALUE,
      unit: "um",
    },
    {
      id: "basidiumWidthUm",
      kind: "number",
      label: "Basidium width",
      minimum: Number.MIN_VALUE,
      unit: "um",
    },
    {
      default: 2,
      id: "minimumReferenceRatio",
      kind: "number",
      label: "Minimum reference ratio",
      minimum: 0,
    },
    {
      default: 5,
      id: "maximumReferenceRatio",
      kind: "number",
      label: "Maximum reference ratio",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "withinReferenceRatioRange",
      label: "Within reference range",
      kind: "boolean",
    },
    { id: "lengthToWidthRatio", label: "Length/width ratio", kind: "number" },
  ],
  calculate: (input) =>
    calculateBasidiumClubProportionChecker({
      basidiumLengthUm: input.basidiumLengthUm as number,
      basidiumWidthUm: input.basidiumWidthUm as number,
      maximumReferenceRatio: input.maximumReferenceRatio as number | undefined,
      minimumReferenceRatio: input.minimumReferenceRatio as number | undefined,
    }),
});
export const runBasidiumClubProportionChecker =
  basidiumClubProportionCheckerTool.execute;
export default basidiumClubProportionCheckerTool;
