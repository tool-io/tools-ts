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
  readonly observedBoltPulloutForcesN: readonly number[];
  readonly observedBondedDiametersM: readonly number[];
  readonly observedBondedLengthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly apparentObservedBondShearPa: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBoltPulloutForcesN",
    label: "Observed bolt pullout forces n",
    kind: "numberList",
  },
  {
    id: "observedBondedDiametersM",
    label: "Observed bonded diameters m",
    kind: "numberList",
  },
  {
    id: "observedBondedLengthsM",
    label: "Observed bonded lengths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBondedDiametersM.forEach((v) =>
    positive(v, "observedBondedDiametersM"),
  );
  input.observedBondedLengthsM.forEach((v) =>
    positive(v, "observedBondedLengthsM"),
  );
  input.observedBoltPulloutForcesN.forEach((v) =>
    nonnegative(v, "observedBoltPulloutForcesN"),
  );
  aligned(
    input.observedBoltPulloutForcesN,
    input.observedBondedDiametersM,
    "observedBoltPulloutForcesN",
  );
  aligned(
    input.observedBoltPulloutForcesN,
    input.observedBondedLengthsM,
    "observedBoltPulloutForcesN",
  );
  return {
    apparentObservedBondShearPa: input.observedBoltPulloutForcesN.map(
      (v, i) =>
        v /
        (Math.PI *
          input.observedBondedDiametersM[i] *
          input.observedBondedLengthsM[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBoltPulloutForcesN: [100, 200],
  observedBondedDiametersM: [0.1, 0.2],
  observedBondedLengthsM: [1, 2],
} satisfies Input;
export const exampleOutput = {
  apparentObservedBondShearPa: [318.3098861837907, 159.15494309189535],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/rock-bolt-bond-strength",
  title: "Rock Bolt Bond Strength Calculator",
  description:
    "Infer apparent uniform bond shear from already observed pullout data/independent bonded geometry, no pullout testing instructions or bolt support capacity approval. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "apparentObservedBondShearPa",
      label: "Apparent observed bond shear pa",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBoltPulloutForcesN:
        value.observedBoltPulloutForcesN as readonly number[],
      observedBondedDiametersM:
        value.observedBondedDiametersM as readonly number[],
      observedBondedLengthsM: value.observedBondedLengthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
