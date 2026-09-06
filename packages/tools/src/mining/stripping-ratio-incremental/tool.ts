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
  readonly observedIncrementalShellWasteTonnes: readonly number[];
  readonly observedIncrementalShellOreTonnes: readonly number[];
  readonly callerPreviousIncrementalShellWasteTonnes: readonly number[];
  readonly callerPreviousIncrementalShellOreTonnes: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedIncrementalWasteOreRatios: readonly number[];
}>;
const inputFields = [
  {
    id: "observedIncrementalShellWasteTonnes",
    label: "Observed incremental shell waste tonnes",
    kind: "numberList",
  },
  {
    id: "observedIncrementalShellOreTonnes",
    label: "Observed incremental shell ore tonnes",
    kind: "numberList",
  },
  {
    id: "callerPreviousIncrementalShellWasteTonnes",
    label: "Caller previous incremental shell waste tonnes",
    kind: "numberList",
  },
  {
    id: "callerPreviousIncrementalShellOreTonnes",
    label: "Caller previous incremental shell ore tonnes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedIncrementalShellWasteTonnes.forEach((v) =>
    nonnegative(v, "observedIncrementalShellWasteTonnes"),
  );
  input.observedIncrementalShellOreTonnes.forEach((v) =>
    nonnegative(v, "observedIncrementalShellOreTonnes"),
  );
  input.callerPreviousIncrementalShellWasteTonnes.forEach((v) =>
    nonnegative(v, "callerPreviousIncrementalShellWasteTonnes"),
  );
  input.callerPreviousIncrementalShellOreTonnes.forEach((v) =>
    nonnegative(v, "callerPreviousIncrementalShellOreTonnes"),
  );
  aligned(
    input.observedIncrementalShellWasteTonnes,
    input.observedIncrementalShellOreTonnes,
    "observedIncrementalShellWasteTonnes",
  );
  aligned(
    input.observedIncrementalShellWasteTonnes,
    input.callerPreviousIncrementalShellWasteTonnes,
    "observedIncrementalShellWasteTonnes",
  );
  aligned(
    input.observedIncrementalShellWasteTonnes,
    input.callerPreviousIncrementalShellOreTonnes,
    "observedIncrementalShellWasteTonnes",
  );
  return {
    observedIncrementalWasteOreRatios:
      input.observedIncrementalShellWasteTonnes.map((v, i) => {
        const waste = v - input.callerPreviousIncrementalShellWasteTonnes[i],
          ore =
            input.observedIncrementalShellOreTonnes[i] -
            input.callerPreviousIncrementalShellOreTonnes[i];
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
  observedIncrementalShellWasteTonnes: [10, 30],
  observedIncrementalShellOreTonnes: [5, 10],
  callerPreviousIncrementalShellWasteTonnes: [0, 10],
  callerPreviousIncrementalShellOreTonnes: [0, 5],
} satisfies Input;
export const exampleOutput = {
  observedIncrementalWasteOreRatios: [2, 4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/stripping-ratio-incremental",
  title: "Incremental Stripping Ratio Calculator",
  description:
    "Audit actual independently matched IncrementalShell inventory deltas, not forecast nested-shell stripping or a bank-volume density converter; previous figures explicitly identify scenario baseline. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedIncrementalShellWasteTonnes:
        value.observedIncrementalShellWasteTonnes as readonly number[],
      observedIncrementalShellOreTonnes:
        value.observedIncrementalShellOreTonnes as readonly number[],
      callerPreviousIncrementalShellWasteTonnes:
        value.callerPreviousIncrementalShellWasteTonnes as readonly number[],
      callerPreviousIncrementalShellOreTonnes:
        value.callerPreviousIncrementalShellOreTonnes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
