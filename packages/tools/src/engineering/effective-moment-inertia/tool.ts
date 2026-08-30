import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EffectiveMomentInertiaInput = Readonly<{
  readonly grossMomentMeters4: number;
  readonly crackedMomentMeters4: number;
  readonly crackingMomentNewtonMeters: number;
  readonly appliedMomentNewtonMeters: number;
}>;
export type EffectiveMomentInertiaOutput = Readonly<{
  readonly effectiveMomentMeters4: number;
}>;

export const calculateEffectiveMomentInertia = (
  x: EffectiveMomentInertiaInput,
): EffectiveMomentInertiaOutput => {
  if (!Number.isFinite(x.grossMomentMeters4) || x.grossMomentMeters4 < 0)
    simpleError("grossMomentMeters4", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.crackedMomentMeters4) || x.crackedMomentMeters4 < 0)
    simpleError("crackedMomentMeters4", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.crackingMomentNewtonMeters) ||
    x.crackingMomentNewtonMeters < 0
  )
    simpleError(
      "crackingMomentNewtonMeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.appliedMomentNewtonMeters) ||
    x.appliedMomentNewtonMeters < 0
  )
    simpleError(
      "appliedMomentNewtonMeters",
      "Provide a finite number at least 0.",
    );
  if (x.crackedMomentMeters4 > x.grossMomentMeters4)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const effectiveMomentMeters4 =
    x.appliedMomentNewtonMeters <= x.crackingMomentNewtonMeters
      ? x.grossMomentMeters4
      : (x.crackingMomentNewtonMeters / x.appliedMomentNewtonMeters) ** 3 *
          x.grossMomentMeters4 +
        (1 -
          (x.crackingMomentNewtonMeters / x.appliedMomentNewtonMeters) ** 3) *
          x.crackedMomentMeters4;
  if (!Number.isFinite(effectiveMomentMeters4))
    simpleError(
      "effectiveMomentMeters4",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    effectiveMomentMeters4: Object.is(effectiveMomentMeters4, -0)
      ? 0
      : effectiveMomentMeters4,
  };
};

export const example = {
  input: {
    grossMomentMeters4: 0.0001,
    crackedMomentMeters4: 0.00005,
    crackingMomentNewtonMeters: 10000,
    appliedMomentNewtonMeters: 20000,
  },
  output: { effectiveMomentMeters4: 0.00005625 },
} satisfies ToolExample<
  EffectiveMomentInertiaInput,
  EffectiveMomentInertiaOutput
>;

export const tool = createSimpleTool({
  id: "engineering/effective-moment-inertia",
  title: "Effective Moment Inertia",
  description:
    "Branson interpolation for reinforced-concrete effective second moment: Ig before cracking, then (Mcr/Ma)^3Ig+[1−(Mcr/Ma)^3]Icr.",
  inputs: [
    {
      id: "grossMomentMeters4",
      kind: "number",
      label: "Gross Moment Meters4",
      unit: "m⁴",
      minimum: 0,
    },
    {
      id: "crackedMomentMeters4",
      kind: "number",
      label: "Cracked Moment Meters4",
      unit: "m⁴",
      minimum: 0,
    },
    {
      id: "crackingMomentNewtonMeters",
      kind: "number",
      label: "Cracking Moment Newton Meters",
      unit: "N·m",
      minimum: 0,
    },
    {
      id: "appliedMomentNewtonMeters",
      kind: "number",
      label: "Applied Moment Newton Meters",
      unit: "N·m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "effectiveMomentMeters4",
      kind: "number",
      label: "Effective Moment Meters4",
      unit: "m⁴",
    },
  ],
  calculate: (input) =>
    calculateEffectiveMomentInertia({
      grossMomentMeters4: input.grossMomentMeters4 as number,
      crackedMomentMeters4: input.crackedMomentMeters4 as number,
      crackingMomentNewtonMeters: input.crackingMomentNewtonMeters as number,
      appliedMomentNewtonMeters: input.appliedMomentNewtonMeters as number,
    }),
});
export const effectiveMomentInertiaTool = tool;
export const runEffectiveMomentInertia = tool.execute;
export default tool;
