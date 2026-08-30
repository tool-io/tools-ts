import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScrewJackMechanicalAdvantageInput = Readonly<{
  readonly handleRadiusMeters: number;
  readonly leadMetersPerRevolution: number;
}>;
export type ScrewJackMechanicalAdvantageOutput = Readonly<{
  readonly mechanicalAdvantage: number;
}>;

export const calculateScrewJackMechanicalAdvantage = (
  x: ScrewJackMechanicalAdvantageInput,
): ScrewJackMechanicalAdvantageOutput => {
  if (!Number.isFinite(x.handleRadiusMeters) || x.handleRadiusMeters < 0)
    simpleError("handleRadiusMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.leadMetersPerRevolution) ||
    x.leadMetersPerRevolution < 0
  )
    simpleError(
      "leadMetersPerRevolution",
      "Provide a finite number at least 0.",
    );
  const mechanicalAdvantage =
    (2 * Math.PI * x.handleRadiusMeters) / x.leadMetersPerRevolution;
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
  input: { handleRadiusMeters: 0.2, leadMetersPerRevolution: 0.005 },
  output: { mechanicalAdvantage: 251.32741228718345 },
} satisfies ToolExample<
  ScrewJackMechanicalAdvantageInput,
  ScrewJackMechanicalAdvantageOutput
>;

export const tool = createSimpleTool({
  id: "engineering/screw-jack-mechanical-advantage",
  title: "Screw Jack Mechanical Advantage",
  description:
    "Ideal frictionless screw-jack force advantage 2πr/p from handle radius r and axial thread lead p per revolution.",
  inputs: [
    {
      id: "handleRadiusMeters",
      kind: "number",
      label: "Handle Radius Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "leadMetersPerRevolution",
      kind: "number",
      label: "Lead Meters Per Revolution",
      unit: "m/rev",
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
    calculateScrewJackMechanicalAdvantage({
      handleRadiusMeters: input.handleRadiusMeters as number,
      leadMetersPerRevolution: input.leadMetersPerRevolution as number,
    }),
});
export const screwJackMechanicalAdvantageTool = tool;
export const runScrewJackMechanicalAdvantage = tool.execute;
export default tool;
