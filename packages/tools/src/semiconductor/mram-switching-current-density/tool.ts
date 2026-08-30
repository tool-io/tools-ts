import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MramSwitchingCurrentDensityInput = Readonly<{
  readonly switchingAmperes: number;
  readonly junctionSquareCentimeters: number;
}>;
export type MramSwitchingCurrentDensityOutput = Readonly<{
  readonly amperesPerSquareCentimeter: number;
}>;

export const calculateMramSwitchingCurrentDensity = (
  x: MramSwitchingCurrentDensityInput,
): MramSwitchingCurrentDensityOutput => {
  if (!Number.isFinite(x.switchingAmperes) || x.switchingAmperes < 0)
    simpleError("switchingAmperes", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.junctionSquareCentimeters) ||
    x.junctionSquareCentimeters < 0
  )
    simpleError(
      "junctionSquareCentimeters",
      "Provide a finite number at least 0.",
    );
  const amperesPerSquareCentimeter =
    x.switchingAmperes / x.junctionSquareCentimeters;
  if (!Number.isFinite(amperesPerSquareCentimeter))
    simpleError(
      "amperesPerSquareCentimeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    amperesPerSquareCentimeter: Object.is(amperesPerSquareCentimeter, -0)
      ? 0
      : amperesPerSquareCentimeter,
  };
};

export const example = {
  input: { switchingAmperes: 0.001, junctionSquareCentimeters: 1e-8 },
  output: { amperesPerSquareCentimeter: 100000 },
} satisfies ToolExample<
  MramSwitchingCurrentDensityInput,
  MramSwitchingCurrentDensityOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/mram-switching-current-density",
  title: "MRAM Switching Current Density",
  description:
    "Average MRAM switching-current density from applied switching current and active junction area.",
  inputs: [
    {
      id: "switchingAmperes",
      kind: "number",
      label: "Switching Amperes",
      unit: "A",
      minimum: 0,
    },
    {
      id: "junctionSquareCentimeters",
      kind: "number",
      label: "Junction Square Centimeters",
      unit: "cm²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "amperesPerSquareCentimeter",
      kind: "number",
      label: "Amperes Per Square Centimeter",
      unit: "A/cm²",
    },
  ],
  calculate: (input) =>
    calculateMramSwitchingCurrentDensity({
      switchingAmperes: input.switchingAmperes as number,
      junctionSquareCentimeters: input.junctionSquareCentimeters as number,
    }),
});
export const mramSwitchingCurrentDensityTool = tool;
export const runMramSwitchingCurrentDensity = tool.execute;
export default tool;
