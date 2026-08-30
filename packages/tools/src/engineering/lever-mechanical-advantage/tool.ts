import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeverMechanicalAdvantageInput = Readonly<{
  readonly effortArmMeters: number;
  readonly loadArmMeters: number;
}>;
export type LeverMechanicalAdvantageOutput = Readonly<{
  readonly mechanicalAdvantage: number;
}>;

export const calculateLeverMechanicalAdvantage = (
  x: LeverMechanicalAdvantageInput,
): LeverMechanicalAdvantageOutput => {
  if (!Number.isFinite(x.effortArmMeters) || x.effortArmMeters < 0)
    simpleError("effortArmMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.loadArmMeters) || x.loadArmMeters < 0)
    simpleError("loadArmMeters", "Provide a finite number at least 0.");
  const mechanicalAdvantage = x.effortArmMeters / x.loadArmMeters;
  if (!Number.isFinite(mechanicalAdvantage))
    simpleError(
      "mechanicalAdvantage",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    mechanicalAdvantage: Object.is(mechanicalAdvantage, -0)
      ? 0
      : mechanicalAdvantage,
  };
};

export const example = {
  input: { effortArmMeters: 2, loadArmMeters: 0.5 },
  output: { mechanicalAdvantage: 4 },
} satisfies ToolExample<
  LeverMechanicalAdvantageInput,
  LeverMechanicalAdvantageOutput
>;

export const tool = createSimpleTool({
  id: "engineering/lever-mechanical-advantage",
  title: "Lever Mechanical Advantage",
  description:
    "Ideal lever force advantage from effort-arm length divided by load-arm length.",
  inputs: [
    {
      id: "effortArmMeters",
      kind: "number",
      label: "Effort Arm Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "loadArmMeters",
      kind: "number",
      label: "Load Arm Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "mechanicalAdvantage",
      kind: "number",
      label: "Mechanical Advantage",
    },
  ],
  calculate: (input) =>
    calculateLeverMechanicalAdvantage({
      effortArmMeters: input.effortArmMeters as number,
      loadArmMeters: input.loadArmMeters as number,
    }),
});
export const leverMechanicalAdvantageTool = tool;
export const runLeverMechanicalAdvantage = tool.execute;
export default tool;
