import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapacitorRippleCurrentRatingCheckInput = {
  readonly appliedRippleAmps: number;
  readonly ratedRippleAmps: number;
};

export type CapacitorRippleCurrentRatingCheckOutput = {
  readonly rippleMarginPercent: number;
};

export const capacitorRippleCurrentRatingCheckExample = {
  input: { appliedRippleAmps: 0.25, ratedRippleAmps: 0.5 },
  output: { rippleMarginPercent: 100 },
} satisfies ToolExample<
  CapacitorRippleCurrentRatingCheckInput,
  CapacitorRippleCurrentRatingCheckOutput
>;

export const calculateCapacitorRippleCurrentRatingCheck = (
  input: CapacitorRippleCurrentRatingCheckInput,
): CapacitorRippleCurrentRatingCheckOutput => {
  if (!(input.ratedRippleAmps > 0))
    simpleError(
      "ratedRippleAmps",
      "Rated ripple current must be positive.",
      "invalid_current",
    );
  if (!(input.appliedRippleAmps > 0))
    simpleError(
      "appliedRippleAmps",
      "Applied ripple current must be positive.",
      "invalid_current",
    );
  return {
    rippleMarginPercent:
      (input.ratedRippleAmps / input.appliedRippleAmps - 1) * 100,
  };
};

export const capacitorRippleCurrentRatingCheckTool = createSimpleTool({
  calculate: (input) =>
    calculateCapacitorRippleCurrentRatingCheck(
      input as unknown as CapacitorRippleCurrentRatingCheckInput,
    ),
  description:
    "Compare the ripple current applied to a capacitor against its rated ripple current and report the signed margin percent; negative values mean the rating is exceeded.",
  id: "electronics/capacitor-ripple-current-rating-check",
  inputs: [
    {
      description: "Ripple current the capacitor is rated for.",
      id: "ratedRippleAmps",
      kind: "number",
      label: "Rated ripple current",
      unit: "A",
    },
    {
      description: "Ripple current applied to the capacitor.",
      id: "appliedRippleAmps",
      kind: "number",
      label: "Applied ripple current",
      unit: "A",
    },
  ],
  outputs: [
    {
      description:
        "Signed headroom over the rating in percent, negative when exceeded.",
      id: "rippleMarginPercent",
      kind: "number",
      label: "Ripple margin",
      unit: "%",
    },
  ],
  title: "Ripple Rating Check",
});
export const runCapacitorRippleCurrentRatingCheck =
  capacitorRippleCurrentRatingCheckTool.execute;
export default capacitorRippleCurrentRatingCheckTool;
