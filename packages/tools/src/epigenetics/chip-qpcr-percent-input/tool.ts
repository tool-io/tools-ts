import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly inputCt: number;
  readonly ipCt: number;
  readonly inputDilutionFactor: number;
}>;
export type Output = Readonly<{
  readonly adjustedInputCt: number;
  readonly percentInput: number;
  readonly enrichmentFoldOverInput: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.inputDilutionFactor <= 0)
    simpleError(
      "inputDilutionFactor",
      "Input dilution factor must be positive.",
      "invalid_dilution",
    );
  const adjustedInputCt = input.inputCt - Math.log2(input.inputDilutionFactor),
    enrichmentFoldOverInput = 2 ** (adjustedInputCt - input.ipCt);
  return {
    adjustedInputCt,
    percentInput: 100 * enrichmentFoldOverInput,
    enrichmentFoldOverInput,
  };
};

export const exampleInput = {
  inputCt: 20,
  ipCt: 18,
  inputDilutionFactor: 4,
} satisfies Input;
export const exampleOutput = {
  adjustedInputCt: 18,
  percentInput: 100,
  enrichmentFoldOverInput: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      inputCt: input.inputCt as number,
      ipCt: input.ipCt as number,
      inputDilutionFactor: input.inputDilutionFactor as number,
    }),
  description:
    "Back-calculate ChIP-qPCR percent input from Ct values and dilution.",
  id: "epigenetics/chip-qpcr-percent-input",
  inputs: [
    { id: "inputCt", label: "Input sample Ct", kind: "number", minimum: 0 },
    { id: "ipCt", label: "Immunoprecipitate Ct", kind: "number", minimum: 0 },
    {
      id: "inputDilutionFactor",
      label: "Input dilution factor",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "adjustedInputCt",
      label: "Dilution-adjusted input Ct",
      kind: "number",
    },
    {
      id: "percentInput",
      label: "ChIP-qPCR percent input",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "enrichmentFoldOverInput",
      label: "IP enrichment fold",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "ChIP-qPCR Percent Input",
});

export const run = tool.execute;
export default tool;
