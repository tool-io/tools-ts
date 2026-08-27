import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EsrFromQInput = {
  readonly qFactor: number;
  readonly reactanceOhms: number;
};

export type EsrFromQOutput = {
  readonly esrOhms: number;
};

export const esrFromQExample = {
  input: { qFactor: 50, reactanceOhms: 100 },
  output: { esrOhms: 2 },
} satisfies ToolExample<EsrFromQInput, EsrFromQOutput>;

export const calculateEsrFromQ = (input: EsrFromQInput): EsrFromQOutput => {
  if (!(input.qFactor > 0))
    simpleError("qFactor", "Quality factor must be positive.", "invalid_q");
  if (!(input.reactanceOhms >= 0))
    simpleError(
      "reactanceOhms",
      "Reactance must not be negative.",
      "invalid_reactance",
    );
  return { esrOhms: input.reactanceOhms / input.qFactor };
};

export const esrFromQTool = createSimpleTool({
  calculate: (input) => calculateEsrFromQ(input as unknown as EsrFromQInput),
  description:
    "Derive the equivalent series resistance of a component from its reactance and quality factor.",
  id: "electronics/esr-from-q",
  inputs: [
    {
      description: "Reactance magnitude at the operating frequency.",
      format: "resistance",
      id: "reactanceOhms",
      kind: "number",
      label: "Reactance",
      unit: "Ω",
    },
    {
      description: "Quality factor of the component.",
      format: "factor",
      id: "qFactor",
      kind: "number",
      label: "Quality factor",
    },
  ],
  outputs: [
    {
      description: "Series resistance modeling the losses.",
      format: "resistance",
      id: "esrOhms",
      kind: "number",
      label: "ESR",
      unit: "Ω",
    },
  ],
  title: "ESR From Q",
});
export const runEsrFromQ = esrFromQTool.execute;
export default esrFromQTool;
