import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedAlreadyAddedCoagulantKg: readonly number[];
  readonly observedMatchedTreatedWaterM3: readonly number[];
  readonly callerVerifiedActiveMassFractions: readonly number[];
}>;
export type Output = Readonly<{ readonly observedActiveCoagulantMgL: number }>;
const inputFields = [
  {
    id: "observedAlreadyAddedCoagulantKg",
    label: "Observed already added coagulant kg",
    kind: "numberList",
  },
  {
    id: "observedMatchedTreatedWaterM3",
    label: "Observed matched treated water m3",
    kind: "numberList",
  },
  {
    id: "callerVerifiedActiveMassFractions",
    label: "Caller verified active mass fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedTreatedWaterM3.forEach((v) =>
    positive(v, "observedMatchedTreatedWaterM3"),
  );
  input.observedAlreadyAddedCoagulantKg.forEach((v) =>
    nonnegative(v, "observedAlreadyAddedCoagulantKg"),
  );
  input.callerVerifiedActiveMassFractions.forEach((v) =>
    fraction(v, "callerVerifiedActiveMassFractions"),
  );
  aligned(
    input.observedAlreadyAddedCoagulantKg,
    input.observedMatchedTreatedWaterM3,
    "observedAlreadyAddedCoagulantKg",
  );
  aligned(
    input.observedAlreadyAddedCoagulantKg,
    input.callerVerifiedActiveMassFractions,
    "observedAlreadyAddedCoagulantKg",
  );
  return {
    observedActiveCoagulantMgL:
      (1000 *
        sum(
          input.observedAlreadyAddedCoagulantKg.map(
            (v, i) => v * input.callerVerifiedActiveMassFractions[i],
          ),
        )) /
      sum(input.observedMatchedTreatedWaterM3),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyAddedCoagulantKg: [1, 2],
  observedMatchedTreatedWaterM3: [10, 20],
  callerVerifiedActiveMassFractions: [0.5, 0.5],
} satisfies Input;
export const exampleOutput = {
  observedActiveCoagulantMgL: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/coagulant-dose",
  title: "Coagulant Dose Calculator",
  description:
    "Audit already-added chemical active mass/water throughput only, no recommended dose, mixing or drinking-water efficacy. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedActiveCoagulantMgL",
      label: "Observed active coagulant mg l",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlreadyAddedCoagulantKg:
        value.observedAlreadyAddedCoagulantKg as readonly number[],
      observedMatchedTreatedWaterM3:
        value.observedMatchedTreatedWaterM3 as readonly number[],
      callerVerifiedActiveMassFractions:
        value.callerVerifiedActiveMassFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
