import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedBondDelaminationWorkJ: readonly number[];
  readonly observedNewlyDelaminatedAreasM2: readonly number[];
  readonly observedIndependentFixtureWorkJ: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredBondInterfaceEnergyJM2: readonly number[];
}>;
const inputFields = [
  {
    id: "observedBondDelaminationWorkJ",
    label: "Observed bond delamination work j",
    kind: "numberList",
  },
  {
    id: "observedNewlyDelaminatedAreasM2",
    label: "Observed newly delaminated areas m2",
    kind: "numberList",
  },
  {
    id: "observedIndependentFixtureWorkJ",
    label: "Observed independent fixture work j",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedNewlyDelaminatedAreasM2.forEach((v) =>
    positive(v, "observedNewlyDelaminatedAreasM2"),
  );
  input.observedBondDelaminationWorkJ.forEach((v) =>
    nonnegative(v, "observedBondDelaminationWorkJ"),
  );
  input.observedIndependentFixtureWorkJ.forEach((v) =>
    nonnegative(v, "observedIndependentFixtureWorkJ"),
  );
  aligned(
    input.observedBondDelaminationWorkJ,
    input.observedNewlyDelaminatedAreasM2,
    "observedBondDelaminationWorkJ",
  );
  aligned(
    input.observedBondDelaminationWorkJ,
    input.observedIndependentFixtureWorkJ,
    "observedBondDelaminationWorkJ",
  );
  return {
    inferredBondInterfaceEnergyJM2: input.observedBondDelaminationWorkJ.map(
      (v, i) =>
        (v - input.observedIndependentFixtureWorkJ[i]) /
        input.observedNewlyDelaminatedAreasM2[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBondDelaminationWorkJ: [2, 3],
  observedNewlyDelaminatedAreasM2: [1, 2],
  observedIndependentFixtureWorkJ: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  inferredBondInterfaceEnergyJM2: [1.5, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/wafer-bonding-interface-energy",
  title: "Semiconductor Wafer Bonding Interface Energy Calculator",
  description:
    "Audit measured wafer interface energy per new crack area after independently measured fixture work, signed mismatch retained; no bonding recipe or material-specific fracture assumption.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredBondInterfaceEnergyJM2",
      label: "Inferred bond interface energy j m2",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBondDelaminationWorkJ:
        value.observedBondDelaminationWorkJ as readonly number[],
      observedNewlyDelaminatedAreasM2:
        value.observedNewlyDelaminatedAreasM2 as readonly number[],
      observedIndependentFixtureWorkJ:
        value.observedIndependentFixtureWorkJ as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
