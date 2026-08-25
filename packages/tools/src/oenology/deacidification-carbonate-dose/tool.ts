import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type DeacidificationCarbonateDoseInput = {
  readonly carbonateNeutralizingFactor: number;
  readonly targetReductionGPerL: number;
  readonly volumeLiters: number;
};

export type DeacidificationCarbonateDoseOutput = {
  readonly carbonateGrams: number;
};

export const deacidificationCarbonateDoseExample = {
  input: {
    carbonateNeutralizingFactor: 0.67,
    targetReductionGPerL: 1,
    volumeLiters: 100,
  },
  output: {
    carbonateGrams: 67,
  },
} satisfies ToolExample<
  DeacidificationCarbonateDoseInput,
  DeacidificationCarbonateDoseOutput
>;

export const calculateDeacidificationCarbonateDose = (
  input: DeacidificationCarbonateDoseInput,
): DeacidificationCarbonateDoseOutput => {
  if (input.carbonateNeutralizingFactor <= 0)
    simpleError(
      "carbonateNeutralizingFactor",
      "The neutralizing factor must be positive.",
      "invalid_value",
    );
  return {
    carbonateGrams: roundStatistic(
      input.targetReductionGPerL *
        input.volumeLiters *
        input.carbonateNeutralizingFactor,
    ),
  };
};

export const deacidificationCarbonateDoseTool = createSimpleTool({
  calculate: (input) =>
    calculateDeacidificationCarbonateDose(
      input as unknown as DeacidificationCarbonateDoseInput,
    ),
  description:
    "Size a carbonate addition for a desired titratable acidity reduction using the carbonate's neutralizing factor.",
  id: "oenology/deacidification-carbonate-dose",
  inputs: [
    {
      description:
        "Grams of carbonate that neutralize one gram per liter of acidity in one liter, for example 0.67 for calcium carbonate.",
      id: "carbonateNeutralizingFactor",
      kind: "number",
      label: "Neutralizing factor",
      minimum: 0,
    },
    {
      description: "Desired TA reduction.",
      id: "targetReductionGPerL",
      kind: "number",
      label: "Target reduction",
      minimum: 0,
      unit: "g/L",
    },
    {
      description: "Volume of wine to treat.",
      id: "volumeLiters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Carbonate to add to the treated volume.",
      id: "carbonateGrams",
      kind: "number",
      label: "Carbonate dose",
      unit: "g",
    },
  ],
  title: "Deacidification Carbonate Dose Calculator",
});
export const runDeacidificationCarbonateDose =
  deacidificationCarbonateDoseTool.execute;
export default deacidificationCarbonateDoseTool;
