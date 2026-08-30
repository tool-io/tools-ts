import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LedLuminousIntensityInput = Readonly<{
  readonly lumens: number;
  readonly solidAngleSteradians: number;
}>;
export type LedLuminousIntensityOutput = Readonly<{
  readonly candela: number;
}>;

export const calculateLedLuminousIntensity = (
  x: LedLuminousIntensityInput,
): LedLuminousIntensityOutput => {
  if (!Number.isFinite(x.lumens) || x.lumens < 0)
    simpleError("lumens", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.solidAngleSteradians) || x.solidAngleSteradians < 0)
    simpleError("solidAngleSteradians", "Provide a finite number at least 0.");
  const candela = x.lumens / x.solidAngleSteradians;
  if (!Number.isFinite(candela))
    simpleError("candela", "Inputs produce an undefined or non-finite result.");
  return { candela: Object.is(candela, -0) ? 0 : candela };
};

export const example = {
  input: { lumens: 10, solidAngleSteradians: 2 },
  output: { candela: 5 },
} satisfies ToolExample<LedLuminousIntensityInput, LedLuminousIntensityOutput>;

export const tool = createSimpleTool({
  id: "electronics/led-luminous-intensity",
  title: "LED Luminous Intensity",
  description:
    "Average luminous intensity in candela from lumens emitted into a known solid angle; assumes uniform angular distribution.",
  inputs: [
    { id: "lumens", kind: "number", label: "Lumens", unit: "lm", minimum: 0 },
    {
      id: "solidAngleSteradians",
      kind: "number",
      label: "Solid Angle Steradians",
      unit: "sr",
      minimum: 0,
    },
  ],
  outputs: [{ id: "candela", kind: "number", label: "Candela", unit: "cd" }],
  calculate: (input) =>
    calculateLedLuminousIntensity({
      lumens: input.lumens as number,
      solidAngleSteradians: input.solidAngleSteradians as number,
    }),
});
export const ledLuminousIntensityTool = tool;
export const runLedLuminousIntensity = tool.execute;
export default tool;
