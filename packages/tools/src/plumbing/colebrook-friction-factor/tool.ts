import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedTurbulentReynolds: readonly number[];
  readonly callerRelativeRoughness: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledDarcyFrictionFactors: readonly number[];
}>;
const inputFields = [
  {
    id: "observedTurbulentReynolds",
    label: "Observed turbulent reynolds",
    kind: "numberList",
  },
  {
    id: "callerRelativeRoughness",
    label: "Caller relative roughness",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedTurbulentReynolds,
    input.callerRelativeRoughness,
    "observedTurbulentReynolds",
  );
  input.observedTurbulentReynolds.forEach((v) => {
    if (v < 4000 || v > 1e8)
      simpleError("Re", "Named turbulent branch Re 4000–1e8 required.");
  });
  input.callerRelativeRoughness.forEach((v) => {
    if (v < 0 || v > 0.05)
      simpleError("roughness", "Relative roughness [0,.05] required.");
  });
  return {
    modeledDarcyFrictionFactors: input.observedTurbulentReynolds.map(
      (re, i) => {
        const r = input.callerRelativeRoughness[i];
        return (() => {
          let lo = 1,
            hi = 20;
          for (let k = 0; k < 80; k++) {
            const x = (lo + hi) / 2,
              res = x + 2 * Math.log10(r / 3.7 + (2.51 * x) / re);
            if (res > 0) hi = x;
            else lo = x;
          }
          const x = (lo + hi) / 2;
          return 1 / (x * x);
        })();
      },
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTurbulentReynolds: [10000, 100000],
  callerRelativeRoughness: [0, 0.001],
} satisfies Input;
export const exampleOutput = {
  modeledDarcyFrictionFactors: [0.030882950353487683, 0.022174535944515076],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/colebrook-friction-factor",
  title: "Plumbing Colebrook Friction Factor Calculator",
  description:
    "Named Colebrook Darcy—not Fanning—friction on explicit bounded turbulent Re/roughness branch; 80 bisections for implicit Colebrook, no transition/laminar substitution or hydraulic code rating.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledDarcyFrictionFactors",
      label: "Modeled darcy friction factors",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTurbulentReynolds:
        value.observedTurbulentReynolds as readonly number[],
      callerRelativeRoughness:
        value.callerRelativeRoughness as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
