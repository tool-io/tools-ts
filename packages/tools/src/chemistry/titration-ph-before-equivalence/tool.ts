import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const titrationPhBeforeEquivalenceTool = createSimpleTool({
  id: "chemistry/titration-ph-before-equivalence",
  title: "Titration pH Before Equivalence Calculator",
  description:
    "Compute the pH of a weak acid / strong base titration before the equivalence point using Henderson-Hasselbalch.",
  inputs: [
    {
      description: "pKa of the weak acid.",
      id: "pka",
      label: "pKa",
      kind: "number",
    },
    {
      description: "Moles of strong base added so far.",
      id: "molesBaseAdded",
      label: "Moles base added",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      description: "Initial moles of weak acid present.",
      id: "molesAcidInitial",
      label: "Moles acid initial",
      kind: "number",
    },
  ],
  outputs: [{ id: "ph", label: "pH", kind: "number" }],
  calculate: (input) => {
    const molesBase = input.molesBaseAdded as number;
    const molesAcid = input.molesAcidInitial as number;
    if (!(molesAcid > 0))
      simpleError(
        "molesAcidInitial",
        "Initial acid amount must be greater than zero.",
        "invalid_acid_amount",
      );
    if (!(molesBase > 0))
      simpleError(
        "molesBaseAdded",
        "Base added must be greater than zero for the buffer-region equation.",
        "outside_buffer_region",
      );
    const remaining = molesAcid - molesBase;
    if (remaining <= 0)
      simpleError(
        "molesBaseAdded",
        "The base added must be less than the initial acid for pre-equivalence.",
        "invalid_mole_ratio",
      );
    return { ph: (input.pka as number) + Math.log10(molesBase / remaining) };
  },
});
export const runTitrationPhBeforeEquivalence =
  titrationPhBeforeEquivalenceTool.execute;
export default titrationPhBeforeEquivalenceTool;

export type TitrationPhBeforeEquivalenceInput = {
  readonly pka: number;
  readonly molesBaseAdded: number;
  readonly molesAcidInitial: number;
};

export type TitrationPhBeforeEquivalenceOutput = {
  readonly ph: number;
};

export const titrationPhBeforeEquivalenceExample = {
  input: {
    pka: 1,
    molesBaseAdded: 0.5,
    molesAcidInitial: 1,
  },
  output: {
    ph: 1,
  },
} satisfies ToolExample<
  TitrationPhBeforeEquivalenceInput,
  TitrationPhBeforeEquivalenceOutput
>;
