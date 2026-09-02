import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
  finite,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedSeparationArcsec: number;
  readonly callerMasDecimalPlaces: number;
}>;
export type Output = Readonly<{
  readonly separationMas: number;
  readonly formattedSeparationMas: string;
}>;
const inputFields = [
  {
    id: "observedSeparationArcsec",
    label: "Observed separation arcsec",
    kind: "number",
  },
  {
    id: "callerMasDecimalPlaces",
    label: "Caller mas decimal places",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedSeparationArcsec, "observedSeparationArcsec");
  bounded(input.callerMasDecimalPlaces, "precision", 0, 12);
  const m = finite(1000 * input.observedSeparationArcsec);
  if (m >= 1e21)
    simpleError("separation", "Fixed formatter magnitude<1e21mas.");
  return {
    separationMas: m,
    formattedSeparationMas: m.toFixed(input.callerMasDecimalPlaces),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSeparationArcsec: 1.2345,
  callerMasDecimalPlaces: 2,
} satisfies Input;
export const exampleOutput = {
  separationMas: 1234.5,
  formattedSeparationMas: "1234.50",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/pair-separation-mas-formatter",
  title: "Pair Separation Arcseconds Decimal to mas Precision Formatter",
  description:
    "Convert observed arcseconds to mas and explicitly requested fixed-decimal representation; no claim measurement precision increased by formatting. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    { id: "separationMas", label: "Separation mas", kind: "number" },
    {
      id: "formattedSeparationMas",
      label: "Formatted separation mas",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSeparationArcsec: value.observedSeparationArcsec as number,
      callerMasDecimalPlaces: value.callerMasDecimalPlaces as number,
    }),
});
export const run = tool.execute;
export default tool;
