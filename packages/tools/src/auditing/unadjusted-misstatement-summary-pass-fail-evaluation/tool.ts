import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnadjustedMisstatementInput = {
  readonly materiality: number;
  readonly misstatements: ReadonlyArray<number>;
  readonly safetyMarginPercent: number;
};

export type UnadjustedMisstatementOutput = {
  readonly effectiveMateriality: number;
  readonly netMisstatement: number;
  readonly remainingMateriality: number;
  readonly exceedsMateriality: boolean;
};

export const evaluateUnadjustedMisstatements = (
  input: UnadjustedMisstatementInput,
): UnadjustedMisstatementOutput => {
  if (!Number.isFinite(input.materiality) || input.materiality <= 0)
    simpleError(
      "materiality",
      "Materiality must be finite and greater than zero.",
      "invalid_materiality",
    );
  if (
    !Number.isFinite(input.safetyMarginPercent) ||
    input.safetyMarginPercent < 0 ||
    input.safetyMarginPercent >= 100
  )
    simpleError(
      "safetyMarginPercent",
      "Safety margin must be from 0 up to but not including 100 percent.",
      "invalid_safety_margin",
    );
  if (!Array.isArray(input.misstatements))
    simpleError(
      "misstatements",
      "Misstatements must be an array.",
      "misstatements_required",
    );
  let netMisstatement = 0;
  for (const [index, misstatement] of input.misstatements.entries()) {
    if (!Number.isFinite(misstatement))
      simpleError(
        `misstatements.${index}`,
        "Misstatements must be finite.",
        "invalid_misstatement",
      );
    const nextTotal = netMisstatement + misstatement;
    if (!Number.isFinite(nextTotal))
      simpleError(
        `misstatements.${index}`,
        "The net misstatement is outside the representable numeric range.",
        "result_not_finite",
      );
    netMisstatement = nextTotal;
  }
  const effectiveMateriality =
    input.materiality * (1 - input.safetyMarginPercent / 100);
  return {
    effectiveMateriality,
    netMisstatement: netMisstatement === 0 ? 0 : netMisstatement,
    remainingMateriality: effectiveMateriality - Math.abs(netMisstatement),
    exceedsMateriality: Math.abs(netMisstatement) > effectiveMateriality,
  };
};

export const unadjustedMisstatementExample = {
  input: {
    materiality: 100_000,
    misstatements: [60_000, -20_000, 15_000],
    safetyMarginPercent: 10,
  },
  output: {
    effectiveMateriality: 90_000,
    netMisstatement: 55_000,
    remainingMateriality: 35_000,
    exceedsMateriality: false,
  },
} satisfies ToolExample<
  UnadjustedMisstatementInput,
  UnadjustedMisstatementOutput
>;

export const unadjustedMisstatementTool = createSimpleTool({
  calculate: (input) =>
    evaluateUnadjustedMisstatements({
      materiality: input.materiality as number,
      misstatements: input.misstatements as number[],
      safetyMarginPercent: input.safetyMarginPercent as number,
    }),
  description:
    "Net signed unadjusted misstatements and compare their absolute total with caller-supplied materiality after a selected safety margin.",
  id: "auditing/unadjusted-misstatement-summary-pass-fail-evaluation",
  inputs: [
    {
      description: "Overall financial-statement materiality.",
      id: "materiality",
      kind: "number",
      label: "Materiality",
      minimum: 0,
    },
    {
      description: "Signed known and uncorrected misstatements.",
      id: "misstatements",
      kind: "numberList",
      label: "Unadjusted misstatements",
    },
    {
      description: "Percentage of materiality reserved as a safety margin.",
      id: "safetyMarginPercent",
      kind: "number",
      label: "Safety margin percent",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "effectiveMateriality",
      kind: "number",
      label: "Effective materiality",
      minimum: 0,
    },
    { id: "netMisstatement", kind: "number", label: "Net misstatement" },
    {
      id: "remainingMateriality",
      kind: "number",
      label: "Remaining effective materiality",
    },
    {
      id: "exceedsMateriality",
      kind: "boolean",
      label: "Exceeds effective materiality",
    },
  ],
  title: "Unadjusted Misstatement Summary Pass-Fail Evaluation",
});

export const runUnadjustedMisstatement = unadjustedMisstatementTool.execute;
export default unadjustedMisstatementTool;
