import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedQuantumWellInPlaneLattice: readonly number[];
  readonly callerMatchedRelaxedWellLattice: readonly number[];
  readonly observedOutOfPlaneWellLattice: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedMeasuredInPlaneWellStrains: readonly number[];
  readonly signedMeasuredOutOfPlaneWellStrains: readonly number[];
}>;
const inputFields = [
  {
    id: "observedQuantumWellInPlaneLattice",
    label: "Observed quantum well in plane lattice",
    kind: "numberList",
  },
  {
    id: "callerMatchedRelaxedWellLattice",
    label: "Caller matched relaxed well lattice",
    kind: "numberList",
  },
  {
    id: "observedOutOfPlaneWellLattice",
    label: "Observed out of plane well lattice",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedQuantumWellInPlaneLattice.forEach((v) =>
    positive(v, "observedQuantumWellInPlaneLattice"),
  );
  input.callerMatchedRelaxedWellLattice.forEach((v) =>
    positive(v, "callerMatchedRelaxedWellLattice"),
  );
  input.observedOutOfPlaneWellLattice.forEach((v) =>
    positive(v, "observedOutOfPlaneWellLattice"),
  );
  aligned(
    input.observedQuantumWellInPlaneLattice,
    input.callerMatchedRelaxedWellLattice,
    "observedQuantumWellInPlaneLattice",
  );
  aligned(
    input.observedQuantumWellInPlaneLattice,
    input.observedOutOfPlaneWellLattice,
    "observedQuantumWellInPlaneLattice",
  );
  return {
    signedMeasuredInPlaneWellStrains:
      input.observedQuantumWellInPlaneLattice.map(
        (v, i) => v / input.callerMatchedRelaxedWellLattice[i] - 1,
      ),
    signedMeasuredOutOfPlaneWellStrains:
      input.observedOutOfPlaneWellLattice.map(
        (v, i) => v / input.callerMatchedRelaxedWellLattice[i] - 1,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedQuantumWellInPlaneLattice: [5.4, 5.5],
  callerMatchedRelaxedWellLattice: [5.5, 5.5],
  observedOutOfPlaneWellLattice: [5.6, 5.5],
} satisfies Input;
export const exampleOutput = {
  signedMeasuredInPlaneWellStrains: [-0.018181818181818184, 0],
  signedMeasuredOutOfPlaneWellStrains: [0.018181818181818184, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/sige-quantum-well-strain",
  title: "Semiconductor SiGe Quantum Well Strain Calculator",
  description:
    "Audit independently measured in/out-of-plane SiGe well lattice strain against matched relaxed reference, not existing assumed fully pseudomorphic Vegard model.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedMeasuredInPlaneWellStrains",
      label: "Signed measured in plane well strains",
      kind: "numberList",
    },
    {
      id: "signedMeasuredOutOfPlaneWellStrains",
      label: "Signed measured out of plane well strains",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedQuantumWellInPlaneLattice:
        value.observedQuantumWellInPlaneLattice as readonly number[],
      callerMatchedRelaxedWellLattice:
        value.callerMatchedRelaxedWellLattice as readonly number[],
      observedOutOfPlaneWellLattice:
        value.observedOutOfPlaneWellLattice as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
