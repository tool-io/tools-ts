import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedIngaasHallCoefficientM2C: readonly number[];
  readonly observedIngaasSheetConductanceSiemens: readonly number[];
  readonly callerMatchedHallFactors: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredIngaasDriftMobilityM2VoltSecond: readonly number[];
}>;
const inputFields = [
  {
    id: "observedIngaasHallCoefficientM2C",
    label: "Observed ingaas hall coefficient m2 c",
    kind: "numberList",
  },
  {
    id: "observedIngaasSheetConductanceSiemens",
    label: "Observed ingaas sheet conductance siemens",
    kind: "numberList",
  },
  {
    id: "callerMatchedHallFactors",
    label: "Caller matched hall factors",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedIngaasHallCoefficientM2C.forEach((v) =>
    positive(v, "observedIngaasHallCoefficientM2C"),
  );
  input.observedIngaasSheetConductanceSiemens.forEach((v) =>
    positive(v, "observedIngaasSheetConductanceSiemens"),
  );
  input.callerMatchedHallFactors.forEach((v) =>
    positive(v, "callerMatchedHallFactors"),
  );
  aligned(
    input.observedIngaasHallCoefficientM2C,
    input.observedIngaasSheetConductanceSiemens,
    "observedIngaasHallCoefficientM2C",
  );
  aligned(
    input.observedIngaasHallCoefficientM2C,
    input.callerMatchedHallFactors,
    "observedIngaasHallCoefficientM2C",
  );
  return {
    inferredIngaasDriftMobilityM2VoltSecond:
      input.observedIngaasHallCoefficientM2C.map(
        (v, i) =>
          (Math.abs(v) * input.observedIngaasSheetConductanceSiemens[i]) /
          input.callerMatchedHallFactors[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIngaasHallCoefficientM2C: [1, 2],
  observedIngaasSheetConductanceSiemens: [2, 3],
  callerMatchedHallFactors: [2, 3],
} satisfies Input;
export const exampleOutput = {
  inferredIngaasDriftMobilityM2VoltSecond: [1, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/ingaas-quantum-well-electron-mobility",
  title: "Semiconductor InGaAs Quantum Well Electron Mobility Calculator",
  description:
    "Extract independently Hall-factor-corrected InGaAs drift mobility from Hall coefficient/sheet conductance, not existing GaN electron density/resistance mobility or Ge hole direct Hall assumption.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredIngaasDriftMobilityM2VoltSecond",
      label: "Inferred ingaas drift mobility m2 volt second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIngaasHallCoefficientM2C:
        value.observedIngaasHallCoefficientM2C as readonly number[],
      observedIngaasSheetConductanceSiemens:
        value.observedIngaasSheetConductanceSiemens as readonly number[],
      callerMatchedHallFactors:
        value.callerMatchedHallFactors as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
