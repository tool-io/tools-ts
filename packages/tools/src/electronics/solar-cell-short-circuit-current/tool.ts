import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SolarCellShortCircuitCurrentInput = Readonly<{
  readonly currentDensityMaPerCm2: number;
  readonly activeAreaCm2: number;
}>;
export type SolarCellShortCircuitCurrentOutput = Readonly<{
  readonly shortCircuitCurrentA: number;
}>;

export const calculateSolarCellShortCircuitCurrent = (
  input: SolarCellShortCircuitCurrentInput,
): SolarCellShortCircuitCurrentOutput => {
  if (!(
    Number.isFinite(input.currentDensityMaPerCm2) &&
    input.currentDensityMaPerCm2 >= 0
  ))
    simpleError(
      "currentDensityMaPerCm2",
      "Current density must be finite and nonnegative.",
    );
  if (!(Number.isFinite(input.activeAreaCm2) && input.activeAreaCm2 >= 0))
    simpleError("activeAreaCm2", "Active area must be finite and nonnegative.");
  const shortCircuitCurrentA =
    (input.currentDensityMaPerCm2 * input.activeAreaCm2) / 1000;
  if (!Number.isFinite(shortCircuitCurrentA))
    simpleError(
      "shortCircuitCurrentA",
      "The inputs produce a non-finite current.",
    );
  return { shortCircuitCurrentA };
};

export const example = {
  input: { currentDensityMaPerCm2: 30, activeAreaCm2: 100 },
  output: { shortCircuitCurrentA: 3 },
} satisfies ToolExample<
  SolarCellShortCircuitCurrentInput,
  SolarCellShortCircuitCurrentOutput
>;

export const tool = createSimpleTool({
  id: "electronics/solar-cell-short-circuit-current",
  title: "Solar Cell Short-Circuit Current",
  description:
    "Convert a solar cell's measured short-circuit current density and illuminated active area into total short-circuit current.",
  inputs: [
    {
      id: "currentDensityMaPerCm2",
      kind: "number",
      label: "Short-circuit current density",
      unit: "mA/cm²",
      minimum: 0,
    },
    {
      id: "activeAreaCm2",
      kind: "number",
      label: "Illuminated active area",
      unit: "cm²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "shortCircuitCurrentA",
      kind: "number",
      label: "Short-circuit current",
      unit: "A",
    },
  ],
  calculate: (input) =>
    calculateSolarCellShortCircuitCurrent({
      currentDensityMaPerCm2: input.currentDensityMaPerCm2 as number,
      activeAreaCm2: input.activeAreaCm2 as number,
    }),
});
export const solarCellShortCircuitCurrentTool = tool;
export const runSolarCellShortCircuitCurrent = tool.execute;
export default tool;
