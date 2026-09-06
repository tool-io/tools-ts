import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  binary,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedCellPoreVolumesM3: readonly number[];
  readonly observedContactedVolumeFractions: readonly number[];
  readonly knownContactedCellFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownVolumetricSweepFraction: number;
  readonly wholeVolumeSweepLowerBound: number;
  readonly wholeVolumeSweepUpperBound: number;
}>;
const inputFields = [
  {
    id: "observedCellPoreVolumesM3",
    label: "Observed cell pore volumes m3",
    kind: "numberList",
  },
  {
    id: "observedContactedVolumeFractions",
    label: "Observed contacted volume fractions",
    kind: "numberList",
  },
  {
    id: "knownContactedCellFlags",
    label: "Known contacted cell flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCellPoreVolumesM3.forEach((v) =>
    positive(v, "observedCellPoreVolumesM3"),
  );
  input.observedContactedVolumeFractions.forEach((v) =>
    fraction(v, "observedContactedVolumeFractions"),
  );
  binary(input.knownContactedCellFlags, "knownContactedCellFlags");
  aligned(
    input.observedCellPoreVolumesM3,
    input.observedContactedVolumeFractions,
    "observedCellPoreVolumesM3",
  );
  aligned(
    input.observedCellPoreVolumesM3,
    input.knownContactedCellFlags,
    "observedCellPoreVolumesM3",
  );
  const total = sum(input.observedCellPoreVolumesM3),
    known = sum(
      input.observedCellPoreVolumesM3.filter(
        (_, i) => input.knownContactedCellFlags[i],
      ),
    ),
    contact = sum(
      input.observedCellPoreVolumesM3.map((v, i) =>
        input.knownContactedCellFlags[i]
          ? v * input.observedContactedVolumeFractions[i]
          : 0,
      ),
    );
  positive(known, "known pore volume");
  return {
    knownVolumetricSweepFraction: contact / known,
    wholeVolumeSweepLowerBound: contact / total,
    wholeVolumeSweepUpperBound: (contact + total - known) / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCellPoreVolumesM3: [1, 2, 3],
  observedContactedVolumeFractions: [1, 0.5, 0],
  knownContactedCellFlags: [1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  knownVolumetricSweepFraction: 0.6666666666666666,
  wholeVolumeSweepLowerBound: 0.3333333333333333,
  wholeVolumeSweepUpperBound: 0.8333333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/volumetric-sweep-efficiency",
  title: "Petroleum Volumetric Sweep Efficiency Calculator",
  description:
    "Integrate actually assessed3D pore-cell contacted fractions with unknown volume bounds, not product of marginal areal/vertical efficiencies or assumed spatial independence. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownVolumetricSweepFraction",
      label: "Known volumetric sweep fraction",
      kind: "number",
    },
    {
      id: "wholeVolumeSweepLowerBound",
      label: "Whole volume sweep lower bound",
      kind: "number",
    },
    {
      id: "wholeVolumeSweepUpperBound",
      label: "Whole volume sweep upper bound",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCellPoreVolumesM3:
        value.observedCellPoreVolumesM3 as readonly number[],
      observedContactedVolumeFractions:
        value.observedContactedVolumeFractions as readonly number[],
      knownContactedCellFlags:
        value.knownContactedCellFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
