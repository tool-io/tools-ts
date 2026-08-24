import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UstavPoluustavDaterInput = {
  readonly century: number;
  readonly hand: "ustav" | "poluustav";
};

export type UstavPoluustavDaterOutput = {
  readonly plausibility: "attested" | "rare" | "anachronistic";
  readonly attestedBand: string;
};

export const calculateUstavPoluustavDater = (
  input: UstavPoluustavDaterInput,
): UstavPoluustavDaterOutput => {
  if (
    !Number.isSafeInteger(input.century) ||
    input.century < 1 ||
    input.century > 21
  )
    return simpleError(
      "century",
      "Century must be an integer from 1 to 21.",
      "invalid_century",
    );
  const century = input.century;
  if (input.hand !== "ustav" && input.hand !== "poluustav")
    return simpleError("hand", "Choose ustav or poluustav.", "invalid_hand");
  if (input.hand === "ustav") {
    const plausibility =
      century < 10 ? "anachronistic" : century <= 14 ? "attested" : "rare";
    return { plausibility, attestedBand: "10th-14th centuries" };
  }
  const plausibility =
    century < 12
      ? "anachronistic"
      : century <= 13 || century >= 19
        ? "rare"
        : "attested";
  return { plausibility, attestedBand: "14th-18th centuries" };
};

export const ustavPoluustavDaterExample = {
  input: { century: 11, hand: "ustav" },
  output: { plausibility: "attested", attestedBand: "10th-14th centuries" },
} satisfies ToolExample<UstavPoluustavDaterInput, UstavPoluustavDaterOutput>;

export const ustavPoluustavDaterTool = createSimpleTool({
  id: "paleography/ustav-poluustav-dater",
  title: "Ustav / Poluustav Dater",
  description:
    "Rate the plausibility of a Cyrillic hand for a century against documented bands stated plainly: ustav attested in the 10th-14th centuries and rare later (liturgical headings and revivals), poluustav attested from the 14th to the 18th with rare earlier (12th-13th) and revival use (19th onward).",
  inputs: [
    {
      description: "Century number of the witness.",
      id: "century",
      kind: "integer",
      label: "Century",
      maximum: 21,
      minimum: 1,
    },
    {
      description: "Cyrillic book hand under assessment.",
      enum: ["ustav", "poluustav"],
      id: "hand",
      kind: "string",
      label: "Hand",
    },
  ],
  outputs: [
    {
      description: "Plausibility of the hand in the given century.",
      id: "plausibility",
      enum: ["attested", "rare", "anachronistic"],
      kind: "string",
      label: "Plausibility",
    },
    {
      description: "Documented attestation band as stated in the description.",
      id: "attestedBand",
      kind: "string",
      label: "Attested band",
    },
  ],
  calculate: (input) =>
    calculateUstavPoluustavDater({
      century: input.century as number,
      hand: input.hand as UstavPoluustavDaterInput["hand"],
    }),
});

export const runUstavPoluustavDater = ustavPoluustavDaterTool.execute;
export default ustavPoluustavDaterTool;
