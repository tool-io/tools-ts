import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BearingLifeL10Input = Readonly<{
  readonly dynamicLoadRatingNewtons: number;
  readonly equivalentLoadNewtons: number;
  readonly lifeExponent: number;
}>;
export type BearingLifeL10Output = Readonly<{
  readonly l10Revolutions: number;
}>;

export const calculateBearingLifeL10 = (
  x: BearingLifeL10Input,
): BearingLifeL10Output => {
  if (
    !Number.isFinite(x.dynamicLoadRatingNewtons) ||
    x.dynamicLoadRatingNewtons < 0
  )
    simpleError(
      "dynamicLoadRatingNewtons",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.equivalentLoadNewtons) || x.equivalentLoadNewtons < 0)
    simpleError("equivalentLoadNewtons", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lifeExponent) || x.lifeExponent < 0)
    simpleError("lifeExponent", "Provide a finite number at least 0.");
  const l10Revolutions =
    1000000 *
    (x.dynamicLoadRatingNewtons / x.equivalentLoadNewtons) ** x.lifeExponent;
  if (!Number.isFinite(l10Revolutions))
    simpleError(
      "l10Revolutions",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { l10Revolutions: Object.is(l10Revolutions, -0) ? 0 : l10Revolutions };
};

export const example = {
  input: {
    dynamicLoadRatingNewtons: 10000,
    equivalentLoadNewtons: 5000,
    lifeExponent: 3,
  },
  output: { l10Revolutions: 8000000 },
} satisfies ToolExample<BearingLifeL10Input, BearingLifeL10Output>;

export const tool = createSimpleTool({
  id: "engineering/bearing-life-l10",
  title: "Bearing Life L10",
  description:
    "Basic bearing L10 rating life in revolutions: 10⁶(C/P)^p from dynamic load rating, equivalent load and chosen bearing exponent.",
  inputs: [
    {
      id: "dynamicLoadRatingNewtons",
      kind: "number",
      label: "Dynamic Load Rating Newtons",
      unit: "N",
      minimum: 0,
    },
    {
      id: "equivalentLoadNewtons",
      kind: "number",
      label: "Equivalent Load Newtons",
      unit: "N",
      minimum: 0,
    },
    { id: "lifeExponent", kind: "number", label: "Life Exponent", minimum: 0 },
  ],
  outputs: [
    {
      id: "l10Revolutions",
      kind: "number",
      label: "L10 Revolutions",
      unit: "rev",
    },
  ],
  calculate: (input) =>
    calculateBearingLifeL10({
      dynamicLoadRatingNewtons: input.dynamicLoadRatingNewtons as number,
      equivalentLoadNewtons: input.equivalentLoadNewtons as number,
      lifeExponent: input.lifeExponent as number,
    }),
});
export const bearingLifeL10Tool = tool;
export const runBearingLifeL10 = tool.execute;
export default tool;
