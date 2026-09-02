import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, demand } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedShelfHardwareLoadsN: readonly number[];
  readonly callerIndependentlyVerifiedInstallationCapacitiesN: readonly number[];
  readonly knownInstallationCapacityFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedMargins: readonly number[];
  readonly knownDeficitIndices: readonly number[];
  readonly unknownCapacityIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedShelfHardwareLoadsN",
    label: "Observed shelf hardware loads n",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyVerifiedInstallationCapacitiesN",
    label: "Caller independently verified installation capacities n",
    kind: "numberList",
  },
  {
    id: "knownInstallationCapacityFlags",
    label: "Known installation capacity flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return demand(
    input.observedShelfHardwareLoadsN,
    input.callerIndependentlyVerifiedInstallationCapacitiesN,
    input.knownInstallationCapacityFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedShelfHardwareLoadsN: [10, 20],
  callerIndependentlyVerifiedInstallationCapacitiesN: [15, 15],
  knownInstallationCapacityFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedMargins: [5, 0],
  knownDeficitIndices: [],
  unknownCapacityIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/beschlag-tragkraft-boden",
  title: "Beschlag Tragkraft Boden Calculator",
  description:
    "Audit measured floor/shelf hardware loads against independently certified exact-installation capacities with unknown evidence separate, no guessed fixing pullout ratings or furniture safety. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    { id: "signedMargins", label: "Signed margins", kind: "numberList" },
    {
      id: "knownDeficitIndices",
      label: "Known deficit indices",
      kind: "numberList",
    },
    {
      id: "unknownCapacityIndices",
      label: "Unknown capacity indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedShelfHardwareLoadsN:
        value.observedShelfHardwareLoadsN as readonly number[],
      callerIndependentlyVerifiedInstallationCapacitiesN:
        value.callerIndependentlyVerifiedInstallationCapacitiesN as readonly number[],
      knownInstallationCapacityFlags:
        value.knownInstallationCapacityFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
