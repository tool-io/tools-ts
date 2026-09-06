import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedMarginalStageWasteTonnes: readonly number[];
  readonly observedMarginalStageOreTonnes: readonly number[];
  readonly callerPreviousMarginalStageWasteTonnes: readonly number[];
  readonly callerPreviousMarginalStageOreTonnes: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedIncrementalWasteOreRatios: readonly number[];
}>;
const inputFields = [
  {
    id: "observedMarginalStageWasteTonnes",
    label: "Observed marginal stage waste tonnes",
    kind: "numberList",
  },
  {
    id: "observedMarginalStageOreTonnes",
    label: "Observed marginal stage ore tonnes",
    kind: "numberList",
  },
  {
    id: "callerPreviousMarginalStageWasteTonnes",
    label: "Caller previous marginal stage waste tonnes",
    kind: "numberList",
  },
  {
    id: "callerPreviousMarginalStageOreTonnes",
    label: "Caller previous marginal stage ore tonnes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMarginalStageWasteTonnes.forEach((v) =>
    nonnegative(v, "observedMarginalStageWasteTonnes"),
  );
  input.observedMarginalStageOreTonnes.forEach((v) =>
    nonnegative(v, "observedMarginalStageOreTonnes"),
  );
  input.callerPreviousMarginalStageWasteTonnes.forEach((v) =>
    nonnegative(v, "callerPreviousMarginalStageWasteTonnes"),
  );
  input.callerPreviousMarginalStageOreTonnes.forEach((v) =>
    nonnegative(v, "callerPreviousMarginalStageOreTonnes"),
  );
  aligned(
    input.observedMarginalStageWasteTonnes,
    input.observedMarginalStageOreTonnes,
    "observedMarginalStageWasteTonnes",
  );
  aligned(
    input.observedMarginalStageWasteTonnes,
    input.callerPreviousMarginalStageWasteTonnes,
    "observedMarginalStageWasteTonnes",
  );
  aligned(
    input.observedMarginalStageWasteTonnes,
    input.callerPreviousMarginalStageOreTonnes,
    "observedMarginalStageWasteTonnes",
  );
  return {
    observedIncrementalWasteOreRatios:
      input.observedMarginalStageWasteTonnes.map((v, i) => {
        const waste = v - input.callerPreviousMarginalStageWasteTonnes[i],
          ore =
            input.observedMarginalStageOreTonnes[i] -
            input.callerPreviousMarginalStageOreTonnes[i];
        nonnegative(waste, "incremental waste");
        positive(ore, "incremental ore");
        return waste / ore;
      }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMarginalStageWasteTonnes: [10, 30],
  observedMarginalStageOreTonnes: [5, 10],
  callerPreviousMarginalStageWasteTonnes: [0, 10],
  callerPreviousMarginalStageOreTonnes: [0, 5],
} satisfies Input;
export const exampleOutput = {
  observedIncrementalWasteOreRatios: [2, 4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/stripping-ratio-marginal",
  title: "Marginal Stripping Ratio Calculator",
  description:
    "Audit actual independently matched MarginalStage inventory deltas, not forecast nested-shell stripping or a bank-volume density converter; previous figures explicitly identify scenario baseline. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedIncrementalWasteOreRatios",
      label: "Observed incremental waste ore ratios",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMarginalStageWasteTonnes:
        value.observedMarginalStageWasteTonnes as readonly number[],
      observedMarginalStageOreTonnes:
        value.observedMarginalStageOreTonnes as readonly number[],
      callerPreviousMarginalStageWasteTonnes:
        value.callerPreviousMarginalStageWasteTonnes as readonly number[],
      callerPreviousMarginalStageOreTonnes:
        value.callerPreviousMarginalStageOreTonnes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
