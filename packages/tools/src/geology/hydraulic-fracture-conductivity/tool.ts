import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly proppantPackPermeabilitiesM2: readonly number[];
  readonly retainedWidthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly proppedConductivitiesM3: readonly number[];
}>;
const inputFields = [
  {
    id: "proppantPackPermeabilitiesM2",
    label: "Proppant pack permeabilities m2",
    kind: "numberList",
  },
  { id: "retainedWidthsM", label: "Retained widths m", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.proppantPackPermeabilitiesM2.forEach((v) =>
    nonnegative(v, "proppantPackPermeabilitiesM2"),
  );
  input.retainedWidthsM.forEach((v) => nonnegative(v, "retainedWidthsM"));
  aligned(
    input.proppantPackPermeabilitiesM2,
    input.retainedWidthsM,
    "proppantPackPermeabilitiesM2",
  );
  return {
    proppedConductivitiesM3: input.proppantPackPermeabilitiesM2.map(
      (v, i) => v * input.retainedWidthsM[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  proppantPackPermeabilitiesM2: [1, 2],
  retainedWidthsM: [0.1, 0.2],
} satisfies Input;
export const exampleOutput = {
  proppedConductivitiesM3: [0.1, 0.4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/hydraulic-fracture-conductivity",
  title: "Geology Hydraulic Fracture Conductivity Calculator",
  description:
    "Measured matched proppant-pack k×retained width conductivities, caller establishes closure stress/fluid basis; not whole-fracture productivity. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "proppedConductivitiesM3",
      label: "Propped conductivities m3",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      proppantPackPermeabilitiesM2:
        value.proppantPackPermeabilitiesM2 as readonly number[],
      retainedWidthsM: value.retainedWidthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
