import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MatthiessenMobilityInput = {
  readonly mobilityComponents: readonly number[];
};

export type MatthiessenMobilityOutput = {
  readonly mobilityCm2PerVs: number;
};

export const matthiessenMobilityExample = {
  input: { mobilityComponents: [100, 200] },
  output: { mobilityCm2PerVs: 66.66666666666667 },
} satisfies ToolExample<MatthiessenMobilityInput, MatthiessenMobilityOutput>;

export const matthiessenMobilityTool = createSimpleTool({
  calculate: (input) => {
    const mobilityComponents = input.mobilityComponents as number[];
    if (mobilityComponents.length === 0)
      simpleError(
        "mobilityComponents",
        "Provide at least one mobility component.",
        "empty_mobilities",
      );
    let minimumMobility = Number.POSITIVE_INFINITY;
    for (const component of mobilityComponents) {
      if (!Number.isFinite(component) || !(component > 0))
        simpleError(
          "mobilityComponents",
          "Every mobility component must be positive.",
          "invalid_mobility",
        );
      minimumMobility = Math.min(minimumMobility, component);
    }
    let scaledInverseSum = 0;
    for (const component of mobilityComponents)
      scaledInverseSum += minimumMobility / component;
    const mobilityCm2PerVs = minimumMobility / scaledInverseSum;
    if (!Number.isFinite(mobilityCm2PerVs) || mobilityCm2PerVs <= 0)
      simpleError(
        "mobilityComponents",
        "The combined mobility is outside the representable range.",
        "numeric_range",
      );
    return { mobilityCm2PerVs };
  },
  description:
    "Combine parallel scattering-limited mobility components into a single mobility using the Matthiessen rule.",
  id: "semiconductor/matthiessen-mobility",
  inputs: [
    {
      description: "Component mobilities limited by each scattering mechanism.",
      format: "mobility",
      id: "mobilityComponents",
      kind: "numberList",
      label: "Mobility components",
      unit: "cm^2/Vs",
    },
  ],
  outputs: [
    {
      description: "Combined Matthiessen mobility.",
      format: "mobility",
      id: "mobilityCm2PerVs",
      kind: "number",
      label: "Mobility",
      unit: "cm^2/Vs",
    },
  ],
  title: "Matthiessen Rule Mobility Calculator",
});
export const runMatthiessenMobility = matthiessenMobilityTool.execute;
export default matthiessenMobilityTool;
