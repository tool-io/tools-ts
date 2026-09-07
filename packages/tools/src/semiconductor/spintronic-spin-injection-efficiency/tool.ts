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
  readonly observedInjectedSpinUpAmps: readonly number[];
  readonly observedInjectedSpinDownAmps: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedSpinInjectionPolarizations: readonly number[];
}>;
const inputFields = [
  {
    id: "observedInjectedSpinUpAmps",
    label: "Observed injected spin up amps",
    kind: "numberList",
  },
  {
    id: "observedInjectedSpinDownAmps",
    label: "Observed injected spin down amps",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedInjectedSpinUpAmps.forEach((v) =>
    nonnegative(v, "observedInjectedSpinUpAmps"),
  );
  input.observedInjectedSpinDownAmps.forEach((v) =>
    nonnegative(v, "observedInjectedSpinDownAmps"),
  );
  aligned(
    input.observedInjectedSpinUpAmps,
    input.observedInjectedSpinDownAmps,
    "observedInjectedSpinUpAmps",
  );
  return {
    signedSpinInjectionPolarizations: input.observedInjectedSpinUpAmps.map(
      (v, i) => {
        const total = v + input.observedInjectedSpinDownAmps[i];
        positive(total, "injectedCurrent");
        return (v - input.observedInjectedSpinDownAmps[i]) / total;
      },
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedInjectedSpinUpAmps: [3, 1],
  observedInjectedSpinDownAmps: [1, 3],
} satisfies Input;
export const exampleOutput = {
  signedSpinInjectionPolarizations: [0.5, -0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/spintronic-spin-injection-efficiency",
  title: "Semiconductor Spintronic Spin Injection Efficiency Calculator",
  description:
    "Audit actual independently spin-resolved injected current polarization, preserve sign; not generic spin-valve magnetoresistance or assumed interface injection efficiency.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedSpinInjectionPolarizations",
      label: "Signed spin injection polarizations",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedInjectedSpinUpAmps:
        value.observedInjectedSpinUpAmps as readonly number[],
      observedInjectedSpinDownAmps:
        value.observedInjectedSpinDownAmps as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
