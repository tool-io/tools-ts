import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CableSizingCurrentCapacityInput = Readonly<{
  readonly baseAmpacityAmperes: number;
  readonly installationFactor: number;
  readonly temperatureFactor: number;
}>;
export type CableSizingCurrentCapacityOutput = Readonly<{
  readonly adjustedAmpacityAmperes: number;
}>;

export const calculateCableSizingCurrentCapacity = (
  x: CableSizingCurrentCapacityInput,
): CableSizingCurrentCapacityOutput => {
  if (!Number.isFinite(x.baseAmpacityAmperes) || x.baseAmpacityAmperes < 0)
    simpleError("baseAmpacityAmperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.installationFactor) || x.installationFactor < 0)
    simpleError("installationFactor", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.temperatureFactor) || x.temperatureFactor < 0)
    simpleError("temperatureFactor", "Provide a finite number at least 0.");
  if (x.installationFactor > 1 || x.temperatureFactor > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const adjustedAmpacityAmperes =
    x.baseAmpacityAmperes * x.installationFactor * x.temperatureFactor;
  if (!Number.isFinite(adjustedAmpacityAmperes))
    simpleError(
      "adjustedAmpacityAmperes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    adjustedAmpacityAmperes: Object.is(adjustedAmpacityAmperes, -0)
      ? 0
      : adjustedAmpacityAmperes,
  };
};

export const example = {
  input: {
    baseAmpacityAmperes: 100,
    installationFactor: 0.8,
    temperatureFactor: 0.9,
  },
  output: { adjustedAmpacityAmperes: 72 },
} satisfies ToolExample<
  CableSizingCurrentCapacityInput,
  CableSizingCurrentCapacityOutput
>;

export const tool = createSimpleTool({
  id: "engineering/cable-sizing-current-capacity",
  title: "Cable Sizing Current Capacity",
  description:
    "Usable conductor current rating from a supplied base ampacity times installation and temperature derating factors; not a code sizing determination.",
  inputs: [
    {
      id: "baseAmpacityAmperes",
      kind: "number",
      label: "Base Ampacity Amperes",
      unit: "A",
      minimum: 0,
    },
    {
      id: "installationFactor",
      kind: "number",
      label: "Installation Factor",
      minimum: 0,
    },
    {
      id: "temperatureFactor",
      kind: "number",
      label: "Temperature Factor",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "adjustedAmpacityAmperes",
      kind: "number",
      label: "Adjusted Ampacity Amperes",
      unit: "A",
    },
  ],
  calculate: (input) =>
    calculateCableSizingCurrentCapacity({
      baseAmpacityAmperes: input.baseAmpacityAmperes as number,
      installationFactor: input.installationFactor as number,
      temperatureFactor: input.temperatureFactor as number,
    }),
});
export const cableSizingCurrentCapacityTool = tool;
export const runCableSizingCurrentCapacity = tool.execute;
export default tool;
