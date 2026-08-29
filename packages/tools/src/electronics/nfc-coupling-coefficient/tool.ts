import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NfcCouplingCoefficientInput = Readonly<{
  readonly mutualInductanceHenries: number;
  readonly primaryInductanceHenries: number;
  readonly secondaryInductanceHenries: number;
}>;
export type NfcCouplingCoefficientOutput = Readonly<{
  couplingCoefficient: number;
}>;

export const calculateNfcCouplingCoefficient = (
  i: NfcCouplingCoefficientInput,
): NfcCouplingCoefficientOutput => {
  const selfInductanceScale =
    Math.sqrt(i.primaryInductanceHenries) *
    Math.sqrt(i.secondaryInductanceHenries);
  if (i.mutualInductanceHenries > selfInductanceScale)
    simpleError(
      "mutualInductanceHenries",
      "Mutual inductance exceeds the passive coupling limit.",
    );
  const value = i.mutualInductanceHenries / selfInductanceScale;
  if (!Number.isFinite(value))
    simpleError(
      "couplingCoefficient",
      "The inputs produce a non-finite result.",
    );
  return { couplingCoefficient: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    mutualInductanceHenries: 0.000002,
    primaryInductanceHenries: 0.00001,
    secondaryInductanceHenries: 0.00001,
  },
  output: { couplingCoefficient: 0.19999999999999998 },
} satisfies ToolExample<
  NfcCouplingCoefficientInput,
  NfcCouplingCoefficientOutput
>;

export const tool = createSimpleTool({
  id: "electronics/nfc-coupling-coefficient",
  title: "NFC Coupling Coefficient",
  description:
    "Calculate dimensionless NFC coil coupling coefficient k=M/√(L1L2) from mutual and self-inductances measured under the same conditions.",
  inputs: [
    {
      id: "mutualInductanceHenries",
      kind: "number",
      label: "Mutual Inductance (H)",
      unit: "H",
      minimum: 0,
    },
    {
      id: "primaryInductanceHenries",
      kind: "number",
      label: "Primary Inductance (H)",
      unit: "H",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "secondaryInductanceHenries",
      kind: "number",
      label: "Secondary Inductance (H)",
      unit: "H",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "couplingCoefficient",
      kind: "number",
      label: "Coupling Coefficient",
    },
  ],
  calculate: (input) =>
    calculateNfcCouplingCoefficient({
      mutualInductanceHenries: input.mutualInductanceHenries as number,
      primaryInductanceHenries: input.primaryInductanceHenries as number,
      secondaryInductanceHenries: input.secondaryInductanceHenries as number,
    }),
});
export const nfcCouplingCoefficientTool = tool;
export const runNfcCouplingCoefficient = tool.execute;
export default tool;
