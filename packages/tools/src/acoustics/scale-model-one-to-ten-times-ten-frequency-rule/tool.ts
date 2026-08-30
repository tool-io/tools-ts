import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScaleModelOneToTenTimesTenFrequencyRuleInput = Readonly<{
  readonly fullScaleHertz: number;
  readonly linearScaleDenominator: number;
}>;
export type ScaleModelOneToTenTimesTenFrequencyRuleOutput = Readonly<{
  readonly modelHertz: number;
}>;

export const calculateScaleModelOneToTenTimesTenFrequencyRule = (
  x: ScaleModelOneToTenTimesTenFrequencyRuleInput,
): ScaleModelOneToTenTimesTenFrequencyRuleOutput => {
  if (!Number.isFinite(x.fullScaleHertz) || x.fullScaleHertz <= 0)
    simpleError("fullScaleHertz", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.linearScaleDenominator) ||
    x.linearScaleDenominator <= 0
  )
    simpleError("linearScaleDenominator", "Provide a finite positive number.");
  const modelHertz = x.fullScaleHertz * x.linearScaleDenominator;
  if (!Number.isFinite(modelHertz))
    simpleError(
      "modelHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { modelHertz: Object.is(modelHertz, -0) ? 0 : modelHertz };
};

export const example = {
  input: {
    fullScaleHertz: 100,
    linearScaleDenominator: 10,
  },
  output: { modelHertz: 1000 },
} satisfies ToolExample<
  ScaleModelOneToTenTimesTenFrequencyRuleInput,
  ScaleModelOneToTenTimesTenFrequencyRuleOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/scale-model-one-to-ten-times-ten-frequency-rule",
  title: "Scale Model One To Ten Times Ten Frequency Rule",
  description:
    "Frequency required in a geometrically reduced 1:N acoustic scale model to represent a full-scale frequency.",
  inputs: [
    {
      id: "fullScaleHertz",
      kind: "number",
      label: "Full Scale Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "linearScaleDenominator",
      kind: "number",
      label: "Linear Scale Denominator",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "modelHertz", kind: "number", label: "Model Hertz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateScaleModelOneToTenTimesTenFrequencyRule({
      fullScaleHertz: input.fullScaleHertz as number,
      linearScaleDenominator: input.linearScaleDenominator as number,
    }),
});
export const scaleModelOneToTenTimesTenFrequencyRuleTool = tool;
export const runScaleModelOneToTenTimesTenFrequencyRule = tool.execute;
export default tool;
