import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  shape,
  finite,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedGreenDimensionsMm: readonly (readonly number[])[];
  readonly observedDryDimensionsMm: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly observedVolumetricShrinkageFractions: readonly number[];
}>;
const inputFields = [
  {
    id: "observedGreenDimensionsMm",
    label: "Observed green dimensions mm",
    kind: "matrix",
  },
  {
    id: "observedDryDimensionsMm",
    label: "Observed dry dimensions mm",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedGreenDimensionsMm,
    input.observedDryDimensionsMm,
    "specimens",
  );
  if (
    shape(input.observedGreenDimensionsMm, "green") !== 3 ||
    shape(input.observedDryDimensionsMm, "dry") !== 3
  )
    simpleError(
      "dimensions",
      "Explicit three-axis paired dimensions required.",
    );
  const volumes = (m: readonly (readonly number[])[]) =>
    m.map((r) => {
      r.forEach((v) => positive(v, "dimension"));
      return finite(r[0] * r[1] * r[2]);
    });
  const a = volumes(input.observedGreenDimensionsMm),
    b = volumes(input.observedDryDimensionsMm);
  return {
    observedVolumetricShrinkageFractions: b.map((v, i) => 1 - v / a[i]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGreenDimensionsMm: [
    [10, 20, 30],
    [20, 20, 20],
  ],
  observedDryDimensionsMm: [
    [9, 18, 27],
    [20, 20, 20],
  ],
} satisfies Input;
export const exampleOutput = {
  observedVolumetricShrinkageFractions: [0.271, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/shrinkage-volumetric",
  title: "Volumetric Shrinkage Calculator",
  description:
    "Extract actual three-axis volume shrinkage, not sum of radial/tangential strains or assumed isotropic coefficient. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedVolumetricShrinkageFractions",
      label: "Observed volumetric shrinkage fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGreenDimensionsMm:
        value.observedGreenDimensionsMm as readonly (readonly number[])[],
      observedDryDimensionsMm:
        value.observedDryDimensionsMm as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
