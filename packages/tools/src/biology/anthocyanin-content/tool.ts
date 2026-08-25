import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AnthocyaninContentInput = {
  readonly correctedAbsorbance: number;
  readonly dryMassG: number;
  readonly extinctionScale?: number;
};

export type AnthocyaninContentOutput = {
  readonly anthocyaninUgPerG: number;
};

export const anthocyaninContentExample = {
  input: { correctedAbsorbance: 0.21, dryMassG: 0.03 },
  output: { anthocyaninUgPerG: 700 },
} satisfies ToolExample<AnthocyaninContentInput, AnthocyaninContentOutput>;

export const anthocyaninContentTool = createSimpleTool({
  id: "biology/anthocyanin-content",
  title: "Anthocyanin Content",
  description:
    "Compute anthocyanin content in micrograms per gram of dry mass as the corrected absorbance divided by the dry mass times an extinction scale factor that defaults to one hundred; apply any baseline correction to the absorbance upstream before passing it in.",
  inputs: [
    {
      description:
        "Absorbance at 530 nanometers after subtracting the 650 nanometer correction; must be finite.",
      id: "correctedAbsorbance",
      kind: "number",
      label: "Corrected absorbance",
    },
    {
      description: "Tissue dry mass in grams; must be greater than zero.",
      id: "dryMassG",
      kind: "number",
      label: "Dry mass",
      unit: "g",
    },
    {
      default: 100,
      description:
        "Extinction scale factor converting absorbance per gram to micrograms per gram; between 1 and 1000.",
      id: "extinctionScale",
      kind: "number",
      label: "Extinction scale",
      maximum: 1000,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Anthocyanin content in micrograms per gram of dry mass.",
      id: "anthocyaninUgPerG",
      kind: "number",
      label: "Anthocyanin content",
      unit: "ug/g",
    },
  ],
  calculate: (input) => {
    const correctedAbsorbance = input.correctedAbsorbance as number;
    const dryMassG = input.dryMassG as number;
    if (!(dryMassG > 0))
      simpleError("dryMassG", "The dry mass must be greater than zero.");
    return {
      anthocyaninUgPerG:
        (correctedAbsorbance / dryMassG) * (input.extinctionScale as number),
    };
  },
});
export const runAnthocyaninContent = anthocyaninContentTool.execute;
export default anthocyaninContentTool;
