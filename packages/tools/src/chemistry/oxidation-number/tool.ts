import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const oxidationNumberTool = createSimpleTool({
  id: "chemistry/oxidation-number",
  title: "Oxidation Number Calculator",
  description:
    "Solve the average oxidation state of one element in an ion or compound from a known element's state and the total charge.",
  inputs: [
    {
      description: "Oxidation state of the element that is already known.",
      id: "knownOxidationState",
      label: "Known state",
      kind: "number",
    },
    {
      description: "Number of atoms of the known element.",
      id: "knownElementCount",
      label: "Known atom count",
      kind: "integer",
      minimum: 0,
    },
    {
      description: "Number of atoms of the element to solve for.",
      id: "unknownElementCount",
      label: "Unknown atom count",
      kind: "integer",
      minimum: 1,
    },
    {
      description: "Total charge of the species; zero for neutral compounds.",
      id: "compoundCharge",
      label: "Compound charge",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Average oxidation state of each unknown-element atom.",
      id: "unknownOxidationState",
      label: "Unknown oxidation state",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const unknownCount = input.unknownElementCount as number;
    if (!(unknownCount > 0))
      simpleError(
        "unknownElementCount",
        "The unknown element count must be nonzero.",
        "invalid_unknown_count",
      );
    return {
      unknownOxidationState:
        ((input.compoundCharge as number) -
          (input.knownOxidationState as number) *
            (input.knownElementCount as number)) /
        unknownCount,
    };
  },
});
export const runOxidationNumber = oxidationNumberTool.execute;
export default oxidationNumberTool;

export type OxidationNumberInput = {
  readonly knownOxidationState: number;
  readonly knownElementCount: number;
  readonly unknownElementCount: number;
  readonly compoundCharge: number;
};

export type OxidationNumberOutput = {
  readonly unknownOxidationState: number;
};

export const oxidationNumberExample = {
  input: {
    knownOxidationState: 1,
    knownElementCount: 1,
    unknownElementCount: 1,
    compoundCharge: 1,
  },
  output: {
    unknownOxidationState: 0,
  },
} satisfies ToolExample<OxidationNumberInput, OxidationNumberOutput>;
