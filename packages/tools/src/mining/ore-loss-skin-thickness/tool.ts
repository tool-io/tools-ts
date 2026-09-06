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
  readonly observedUnrecoveredSkinVolumesM3: readonly number[];
  readonly observedIndependentlyExposedOreFaceAreasM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedEquivalentOreLossSkinThicknessM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedUnrecoveredSkinVolumesM3",
    label: "Observed unrecovered skin volumes m3",
    kind: "numberList",
  },
  {
    id: "observedIndependentlyExposedOreFaceAreasM2",
    label: "Observed independently exposed ore face areas m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedIndependentlyExposedOreFaceAreasM2.forEach((v) =>
    positive(v, "observedIndependentlyExposedOreFaceAreasM2"),
  );
  input.observedUnrecoveredSkinVolumesM3.forEach((v) =>
    nonnegative(v, "observedUnrecoveredSkinVolumesM3"),
  );
  aligned(
    input.observedUnrecoveredSkinVolumesM3,
    input.observedIndependentlyExposedOreFaceAreasM2,
    "observedUnrecoveredSkinVolumesM3",
  );
  return {
    observedEquivalentOreLossSkinThicknessM:
      input.observedUnrecoveredSkinVolumesM3.map(
        (v, i) => v / input.observedIndependentlyExposedOreFaceAreasM2[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUnrecoveredSkinVolumesM3: [2, 4],
  observedIndependentlyExposedOreFaceAreasM2: [10, 20],
} satisfies Input;
export const exampleOutput = {
  observedEquivalentOreLossSkinThicknessM: [0.2, 0.2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ore-loss-skin-thickness",
  title: "Ore Loss Skin Thickness Calculator",
  description:
    "Infer equivalent unrecovered ore skin from independently surveyed loss volume/face area, not diluent skin inferred from ore/diluent density and mixed grade. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedEquivalentOreLossSkinThicknessM",
      label: "Observed equivalent ore loss skin thickness m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedUnrecoveredSkinVolumesM3:
        value.observedUnrecoveredSkinVolumesM3 as readonly number[],
      observedIndependentlyExposedOreFaceAreasM2:
        value.observedIndependentlyExposedOreFaceAreasM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
