import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HbtEmitterInjectionEfficiencyInput = {
  readonly electronInjectionCurrentDensityAPerCm2: number;
  readonly holeBackInjectionCurrentDensityAPerCm2: number;
};

export type HbtEmitterInjectionEfficiencyOutput = {
  readonly injectionEfficiency: number;
};

export const hbtEmitterInjectionEfficiencyExample = {
  input: {
    electronInjectionCurrentDensityAPerCm2: 999,
    holeBackInjectionCurrentDensityAPerCm2: 1,
  },
  output: { injectionEfficiency: 0.9989999999999999 },
} satisfies ToolExample<
  HbtEmitterInjectionEfficiencyInput,
  HbtEmitterInjectionEfficiencyOutput
>;

export const calculateHbtEmitterInjectionEfficiency = (
  input: HbtEmitterInjectionEfficiencyInput,
): HbtEmitterInjectionEfficiencyOutput => {
  const electron = input.electronInjectionCurrentDensityAPerCm2;
  const hole = input.holeBackInjectionCurrentDensityAPerCm2;
  if (!Number.isFinite(electron) || electron < 0)
    simpleError(
      "electronInjectionCurrentDensityAPerCm2",
      "Electron injection current density must be finite and non-negative.",
    );
  if (!Number.isFinite(hole) || hole < 0)
    simpleError(
      "holeBackInjectionCurrentDensityAPerCm2",
      "Hole back-injection current density must be finite and non-negative.",
    );
  if (electron === 0 && hole === 0)
    simpleError(
      "electronInjectionCurrentDensityAPerCm2",
      "At least one emitter current component must be positive.",
      "zero_total_current",
    );
  if (electron === 0) return { injectionEfficiency: 0 };
  if (hole === 0) return { injectionEfficiency: 1 };
  const injectionEfficiency =
    electron >= hole
      ? 1 / (1 + hole / electron)
      : electron / hole / (1 + electron / hole);
  if (injectionEfficiency === 0)
    simpleError(
      "electronInjectionCurrentDensityAPerCm2",
      "The injection efficiency is below the representable range.",
      "numeric_underflow",
    );
  return { injectionEfficiency };
};

export const hbtEmitterInjectionEfficiencyTool = createSimpleTool({
  calculate: (input) =>
    calculateHbtEmitterInjectionEfficiency({
      electronInjectionCurrentDensityAPerCm2:
        input.electronInjectionCurrentDensityAPerCm2 as number,
      holeBackInjectionCurrentDensityAPerCm2:
        input.holeBackInjectionCurrentDensityAPerCm2 as number,
    }),
  description:
    "Calculate HBT emitter injection efficiency from forward electron injection and opposing hole back-injection current densities.",
  id: "semiconductor/hbt-emitter-injection-efficiency",
  inputs: [
    {
      description: "Electron current density injected from emitter into base.",
      id: "electronInjectionCurrentDensityAPerCm2",
      kind: "number",
      label: "Electron injection current density",
      minimum: 0,
      unit: "A/cm^2",
    },
    {
      description: "Hole current density back-injected from base into emitter.",
      id: "holeBackInjectionCurrentDensityAPerCm2",
      kind: "number",
      label: "Hole back-injection current density",
      minimum: 0,
      unit: "A/cm^2",
    },
  ],
  outputs: [
    {
      description: "Fraction of emitter current carried by injected carriers.",
      id: "injectionEfficiency",
      kind: "number",
      label: "Injection efficiency",
      maximum: 1,
      minimum: 0,
      unit: "ratio",
    },
  ],
  title: "Emitter Injection Efficiency Calculator",
});
export const runHbtEmitterInjectionEfficiency =
  hbtEmitterInjectionEfficiencyTool.execute;
export default hbtEmitterInjectionEfficiencyTool;
