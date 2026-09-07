import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedTlmContactSeparationsM: readonly number[];
  readonly observedTlmTotalResistanceOhms: readonly number[];
  readonly observedContactWidthM: number;
}>;
export type Output = Readonly<{
  readonly extractedSingleContactResistanceOhms: number;
  readonly extractedSheetResistanceOhms: number;
  readonly tlmFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedTlmContactSeparationsM",
    label: "Observed tlm contact separations m",
    kind: "numberList",
  },
  {
    id: "observedTlmTotalResistanceOhms",
    label: "Observed tlm total resistance ohms",
    kind: "numberList",
  },
  {
    id: "observedContactWidthM",
    label: "Observed contact width m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedContactWidthM, "observedContactWidthM");
  input.observedTlmContactSeparationsM.forEach((v) =>
    nonnegative(v, "observedTlmContactSeparationsM"),
  );
  input.observedTlmTotalResistanceOhms.forEach((v) =>
    nonnegative(v, "observedTlmTotalResistanceOhms"),
  );
  const fit = linearFit(
    input.observedTlmContactSeparationsM,
    input.observedTlmTotalResistanceOhms,
  );
  return {
    extractedSingleContactResistanceOhms: fit.intercept / 2,
    extractedSheetResistanceOhms: fit.slope * input.observedContactWidthM,
    tlmFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTlmContactSeparationsM: [1, 2, 3],
  observedTlmTotalResistanceOhms: [3, 5, 7],
  observedContactWidthM: 2,
} satisfies Input;
export const exampleOutput = {
  extractedSingleContactResistanceOhms: 0.5,
  extractedSheetResistanceOhms: 4,
  tlmFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/algan-gan-hemt-contact-resistance",
  title: "Semiconductor AlGaN Gan Hemt Contact Resistance Calculator",
  description:
    "Extract actual HEMT TLM single-contact intercept/2 and sheet slope×width from independently selected linear trace; signed nonphysical fit evidence retained, not forward transfer-length resistivity.",
  inputs: inputFields,
  outputs: [
    {
      id: "extractedSingleContactResistanceOhms",
      label: "Extracted single contact resistance ohms",
      kind: "number",
    },
    {
      id: "extractedSheetResistanceOhms",
      label: "Extracted sheet resistance ohms",
      kind: "number",
    },
    { id: "tlmFitRSquared", label: "Tlm fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedTlmContactSeparationsM:
        value.observedTlmContactSeparationsM as readonly number[],
      observedTlmTotalResistanceOhms:
        value.observedTlmTotalResistanceOhms as readonly number[],
      observedContactWidthM: value.observedContactWidthM as number,
    }),
});
export const run = tool.execute;
export default tool;
