import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FactorOfSafetyInput = Readonly<{
  readonly strength: number;
  readonly appliedDemand: number;
}>;
export type FactorOfSafetyOutput = Readonly<{
  readonly factorOfSafety: number;
}>;

export const calculateFactorOfSafety = (
  x: FactorOfSafetyInput,
): FactorOfSafetyOutput => {
  if (!Number.isFinite(x.strength) || x.strength < 0)
    simpleError("strength", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.appliedDemand) || x.appliedDemand < 0)
    simpleError("appliedDemand", "Provide a finite number at least 0.");
  const factorOfSafety = x.strength / x.appliedDemand;
  if (!Number.isFinite(factorOfSafety))
    simpleError(
      "factorOfSafety",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { factorOfSafety: Object.is(factorOfSafety, -0) ? 0 : factorOfSafety };
};

export const example = {
  input: { strength: 100, appliedDemand: 50 },
  output: { factorOfSafety: 2 },
} satisfies ToolExample<FactorOfSafetyInput, FactorOfSafetyOutput>;

export const tool = createSimpleTool({
  id: "engineering/factor-of-safety",
  title: "Factor Of Safety",
  description:
    "Nominal strength-to-applied-demand ratio for quantities expressed in the same units; does not select an acceptable design margin.",
  inputs: [
    {
      id: "strength",
      kind: "number",
      label: "Strength",
      unit: "unit",
      minimum: 0,
    },
    {
      id: "appliedDemand",
      kind: "number",
      label: "Applied Demand",
      unit: "unit",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "factorOfSafety", kind: "number", label: "Factor Of Safety" },
  ],
  calculate: (input) =>
    calculateFactorOfSafety({
      strength: input.strength as number,
      appliedDemand: input.appliedDemand as number,
    }),
});
export const factorOfSafetyTool = tool;
export const runFactorOfSafety = tool.execute;
export default tool;
