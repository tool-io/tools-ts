import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedAlreadyMixedPozzolanKg: readonly number[];
  readonly observedAlreadyMixedClinkerKg: readonly number[];
  readonly observedOtherBinderKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly pozzolanPercentOfDeclaredBinder: number;
  readonly pozzolanPercentOfPozzolanClinker: number;
}>;
const inputFields = [
  {
    id: "observedAlreadyMixedPozzolanKg",
    label: "Observed already mixed pozzolan kg",
    kind: "numberList",
  },
  {
    id: "observedAlreadyMixedClinkerKg",
    label: "Observed already mixed clinker kg",
    kind: "numberList",
  },
  {
    id: "observedOtherBinderKg",
    label: "Observed other binder kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAlreadyMixedPozzolanKg.forEach((v) =>
    nonnegative(v, "observedAlreadyMixedPozzolanKg"),
  );
  input.observedAlreadyMixedClinkerKg.forEach((v) =>
    nonnegative(v, "observedAlreadyMixedClinkerKg"),
  );
  input.observedOtherBinderKg.forEach((v) =>
    nonnegative(v, "observedOtherBinderKg"),
  );
  aligned(
    input.observedAlreadyMixedPozzolanKg,
    input.observedAlreadyMixedClinkerKg,
    "observedAlreadyMixedPozzolanKg",
  );
  aligned(
    input.observedAlreadyMixedPozzolanKg,
    input.observedOtherBinderKg,
    "observedAlreadyMixedPozzolanKg",
  );
  const pozz = sum(input.observedAlreadyMixedPozzolanKg),
    pc = pozz + sum(input.observedAlreadyMixedClinkerKg),
    total = pc + sum(input.observedOtherBinderKg);
  positive(pc, "declared clinker/pozzolan");
  return {
    pozzolanPercentOfDeclaredBinder: (100 * pozz) / total,
    pozzolanPercentOfPozzolanClinker: (100 * pozz) / pc,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyMixedPozzolanKg: [10, 20],
  observedAlreadyMixedClinkerKg: [20, 30],
  observedOtherBinderKg: [5, 5],
} satisfies Input;
export const exampleOutput = {
  pozzolanPercentOfDeclaredBinder: 33.333333333333336,
  pozzolanPercentOfPozzolanClinker: 37.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/pozzolan-clinker-substitution-percent",
  title: "Pozzolan Clinker Substitution Percent Calculator",
  description:
    "Audit already mixed binder mass on explicitly separate total-binder versus pozzolan+clinker denominators, no recommended replacement or chemical efficacy. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "pozzolanPercentOfDeclaredBinder",
      label: "Pozzolan percent of declared binder",
      kind: "number",
    },
    {
      id: "pozzolanPercentOfPozzolanClinker",
      label: "Pozzolan percent of pozzolan clinker",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlreadyMixedPozzolanKg:
        value.observedAlreadyMixedPozzolanKg as readonly number[],
      observedAlreadyMixedClinkerKg:
        value.observedAlreadyMixedClinkerKg as readonly number[],
      observedOtherBinderKg: value.observedOtherBinderKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
