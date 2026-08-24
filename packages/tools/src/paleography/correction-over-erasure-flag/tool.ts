import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CorrectionOverErasureFlagInput = {
  readonly erasureCount: number;
  readonly correctionsOverErasure: number;
};

export type CorrectionOverErasureFlagOutput = {
  readonly overErasureProportionPercent: number;
  readonly correctionOverErasureFlag: boolean;
  readonly practiceBand: "none" | "incidental" | "recurrent" | "systematic";
};

export const calculateCorrectionOverErasureFlag = (
  input: CorrectionOverErasureFlagInput,
): CorrectionOverErasureFlagOutput => {
  if (!(Number.isSafeInteger(input.erasureCount) && input.erasureCount >= 1))
    return simpleError(
      "erasureCount",
      "Record at least one erasure.",
      "invalid_count",
    );
  if (!(
    Number.isSafeInteger(input.correctionsOverErasure) &&
    input.correctionsOverErasure >= 0 &&
    input.correctionsOverErasure <= input.erasureCount
  ))
    return simpleError(
      "correctionsOverErasure",
      "Corrections over erasures must be integers between 0 and the erasure count.",
      "invalid_count",
    );
  const overErasureProportionPercent =
    (input.correctionsOverErasure / input.erasureCount) * 100;
  return {
    overErasureProportionPercent,
    correctionOverErasureFlag: input.correctionsOverErasure >= 1,
    practiceBand:
      overErasureProportionPercent === 0
        ? "none"
        : overErasureProportionPercent < 25
          ? "incidental"
          : overErasureProportionPercent <= 60
            ? "recurrent"
            : "systematic",
  };
};

export const correctionOverErasureFlagExample = {
  input: { erasureCount: 12, correctionsOverErasure: 5 },
  output: {
    overErasureProportionPercent: 41.66666666666667,
    correctionOverErasureFlag: true,
    practiceBand: "recurrent",
  },
} satisfies ToolExample<
  CorrectionOverErasureFlagInput,
  CorrectionOverErasureFlagOutput
>;

export const correctionOverErasureFlagTool = createSimpleTool({
  id: "paleography/correction-over-erasure-flag",
  title: "Correction Over Erasure Flag",
  description:
    "Flag corrections written over erased text and band the practice under the stated rule: none at 0%, incidental below 25%, recurrent 25-60%, systematic above 60% of erasures receiving a written-over correction.",
  inputs: [
    {
      description: "Erased passages identified in the witness.",
      id: "erasureCount",
      kind: "integer",
      label: "Erasures",
      minimum: 1,
    },
    {
      description: "Corrections written directly over an erasure.",
      id: "correctionsOverErasure",
      kind: "integer",
      label: "Corrections over erasure",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Corrections over erasures as a percentage of all erasures.",
      id: "overErasureProportionPercent",
      kind: "number",
      label: "Share %",
    },
    {
      description: "True when any correction sits over an erasure.",
      id: "correctionOverErasureFlag",
      kind: "boolean",
      label: "Flag",
    },
    {
      description: "Practice band from the stated thresholds.",
      id: "practiceBand",
      enum: ["none", "incidental", "recurrent", "systematic"],
      kind: "string",
      label: "Practice band",
    },
  ],
  calculate: (input) =>
    calculateCorrectionOverErasureFlag({
      correctionsOverErasure: input.correctionsOverErasure as number,
      erasureCount: input.erasureCount as number,
    }),
});

export const runCorrectionOverErasureFlag =
  correctionOverErasureFlagTool.execute;
export default correctionOverErasureFlagTool;
