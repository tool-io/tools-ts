import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LuminousEfficacyInput = Readonly<{
  readonly luminousFluxLumens: number;
  readonly inputPowerWatts: number;
}>;
export type LuminousEfficacyOutput = Readonly<{
  readonly efficacyLumensPerWatt: number;
}>;

export const calculateLuminousEfficacy = (
  x: LuminousEfficacyInput,
): LuminousEfficacyOutput => {
  if (!Number.isFinite(x.luminousFluxLumens) || x.luminousFluxLumens < 0)
    simpleError("luminousFluxLumens", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.inputPowerWatts) || x.inputPowerWatts < 0)
    simpleError("inputPowerWatts", "Provide a finite number at least 0.");
  const efficacyLumensPerWatt = x.luminousFluxLumens / x.inputPowerWatts;
  if (!Number.isFinite(efficacyLumensPerWatt))
    simpleError(
      "efficacyLumensPerWatt",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    efficacyLumensPerWatt: Object.is(efficacyLumensPerWatt, -0)
      ? 0
      : efficacyLumensPerWatt,
  };
};

export const example = {
  input: { luminousFluxLumens: 800, inputPowerWatts: 10 },
  output: { efficacyLumensPerWatt: 80 },
} satisfies ToolExample<LuminousEfficacyInput, LuminousEfficacyOutput>;

export const tool = createSimpleTool({
  id: "engineering/luminous-efficacy",
  title: "Luminous Efficacy",
  description:
    "Luminous efficacy of a source in lumens per watt of electrical input power.",
  inputs: [
    {
      id: "luminousFluxLumens",
      kind: "number",
      label: "Luminous Flux Lumens",
      unit: "lm",
      minimum: 0,
    },
    {
      id: "inputPowerWatts",
      kind: "number",
      label: "Input Power Watts",
      unit: "W",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "efficacyLumensPerWatt",
      kind: "number",
      label: "Efficacy Lumens Per Watt",
      unit: "lm/W",
    },
  ],
  calculate: (input) =>
    calculateLuminousEfficacy({
      luminousFluxLumens: input.luminousFluxLumens as number,
      inputPowerWatts: input.inputPowerWatts as number,
    }),
});
export const luminousEfficacyTool = tool;
export const runLuminousEfficacy = tool.execute;
export default tool;
