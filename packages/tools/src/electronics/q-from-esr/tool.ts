import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QFromEsrInput = {
  readonly esrOhms: number;
  readonly reactanceOhms: number;
};

export type QFromEsrOutput = {
  readonly qFactor: number;
};

export const qFromEsrExample = {
  input: { esrOhms: 4, reactanceOhms: 100 },
  output: { qFactor: 25 },
} satisfies ToolExample<QFromEsrInput, QFromEsrOutput>;

export const calculateQFromEsr = (input: QFromEsrInput): QFromEsrOutput => {
  if (!(input.esrOhms > 0))
    simpleError("esrOhms", "ESR must be positive.", "invalid_esr");
  if (!(input.reactanceOhms >= 0))
    simpleError(
      "reactanceOhms",
      "Reactance must not be negative.",
      "invalid_reactance",
    );
  return { qFactor: input.reactanceOhms / input.esrOhms };
};

export const qFromEsrTool = createSimpleTool({
  calculate: (input) => calculateQFromEsr(input as unknown as QFromEsrInput),
  description:
    "Derive the quality factor of a component from its reactance and equivalent series resistance.",
  id: "electronics/q-from-esr",
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
      description: "Series resistance modeling the losses.",
      format: "resistance",
      id: "esrOhms",
      kind: "number",
      label: "ESR",
      unit: "Ω",
    },
  ],
  outputs: [
    {
      description: "Dimensionless quality factor.",
      format: "factor",
      id: "qFactor",
      kind: "number",
      label: "Quality factor",
    },
  ],
  title: "Q From ESR",
});
export const runQFromEsr = qFromEsrTool.execute;
export default qFromEsrTool;
