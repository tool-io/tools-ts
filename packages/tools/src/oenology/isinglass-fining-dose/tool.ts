import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type IsinglassFiningDoseInput = {
  readonly rateGPerHectoliter: number;
  readonly volumeHectoliters: number;
};

export type IsinglassFiningDoseOutput = {
  readonly productGrams: number;
};

export const isinglassFiningDoseExample = {
  input: {
    rateGPerHectoliter: 2,
    volumeHectoliters: 20,
  },
  output: {
    productGrams: 40,
  },
} satisfies ToolExample<IsinglassFiningDoseInput, IsinglassFiningDoseOutput>;

export const calculateIsinglassFiningDose = (
  input: IsinglassFiningDoseInput,
): IsinglassFiningDoseOutput => {
  if (input.rateGPerHectoliter < 0)
    simpleError(
      "rateGPerHectoliter",
      "The fining rate cannot be negative.",
      "invalid_value",
    );
  return {
    productGrams: roundStatistic(
      input.rateGPerHectoliter * input.volumeHectoliters,
    ),
  };
};

export const isinglassFiningDoseTool = createSimpleTool({
  calculate: (input) =>
    calculateIsinglassFiningDose(input as unknown as IsinglassFiningDoseInput),
  description:
    "Convert a bench-trial or supplier-specified isinglass rate into total product mass for the selected wine volume; it does not determine clarification performance.",
  id: "oenology/isinglass-fining-dose",
  inputs: [
    {
      description: "Isinglass rate per hectoliter of wine.",
      id: "rateGPerHectoliter",
      kind: "number",
      label: "Dose rate",
      minimum: 0,
      unit: "g/hL",
    },
    {
      description: "Wine volume to treat.",
      id: "volumeHectoliters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "hL",
    },
  ],
  outputs: [
    {
      description: "Isinglass to prepare and add to the treated volume.",
      id: "productGrams",
      kind: "number",
      label: "Isinglass",
      unit: "g",
    },
  ],
  title: "Isinglass Fining Dose Calculator",
});
export const runIsinglassFiningDose = isinglassFiningDoseTool.execute;
export default isinglassFiningDoseTool;
