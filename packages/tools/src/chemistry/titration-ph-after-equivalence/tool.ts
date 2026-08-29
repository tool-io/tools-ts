import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const titrationPhAfterEquivalenceTool = createSimpleTool({
  id: "chemistry/titration-ph-after-equivalence",
  title: "Titration pH After Equivalence Calculator",
  description:
    "Compute the pH after the equivalence point in a strong acid / strong base titration from excess hydroxide.",
  inputs: [
    {
      description: "Excess moles of strong base beyond equivalence.",
      id: "excessMolesOh",
      label: "Excess OH\u207b moles",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      description: "Total solution volume; must be greater than zero.",
      id: "totalVolumeL",
      label: "Total volume",
      kind: "number",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [{ id: "ph", label: "pH", kind: "number" }],
  calculate: (input) => {
    const volume = input.totalVolumeL as number;
    if (volume <= 0)
      simpleError(
        "totalVolumeL",
        "Volume must be greater than zero.",
        "invalid_volume",
      );
    const ohConcentration = (input.excessMolesOh as number) / volume;
    if (!(ohConcentration > 0))
      simpleError(
        "excessMolesOh",
        "Excess hydroxide must be greater than zero after equivalence.",
        "not_after_equivalence",
      );
    return { ph: 14 + Math.log10(ohConcentration) };
  },
});
export const runTitrationPhAfterEquivalence =
  titrationPhAfterEquivalenceTool.execute;
export default titrationPhAfterEquivalenceTool;

export type TitrationPhAfterEquivalenceInput = {
  readonly excessMolesOh: number;
  readonly totalVolumeL: number;
};

export type TitrationPhAfterEquivalenceOutput = {
  readonly ph: number;
};

export const titrationPhAfterEquivalenceExample = {
  input: {
    excessMolesOh: 1,
    totalVolumeL: 1,
  },
  output: {
    ph: 14,
  },
} satisfies ToolExample<
  TitrationPhAfterEquivalenceInput,
  TitrationPhAfterEquivalenceOutput
>;
