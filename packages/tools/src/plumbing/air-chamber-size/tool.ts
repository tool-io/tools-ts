import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedAirChamberInitialGasLiters: number;
  readonly observedInitialAbsoluteKpa: number;
  readonly callerMaximumAbsoluteKpa: number;
  readonly callerPolytropicExponent: number;
}>;
export type Output = Readonly<{
  readonly modeledCompressedGasLiters: number;
  readonly modeledWaterAcceptanceLiters: number;
}>;
const inputFields = [
  {
    id: "observedAirChamberInitialGasLiters",
    label: "Observed air chamber initial gas liters",
    kind: "number",
  },
  {
    id: "observedInitialAbsoluteKpa",
    label: "Observed initial absolute kpa",
    kind: "number",
  },
  {
    id: "callerMaximumAbsoluteKpa",
    label: "Caller maximum absolute kpa",
    kind: "number",
  },
  {
    id: "callerPolytropicExponent",
    label: "Caller polytropic exponent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedAirChamberInitialGasLiters,
    "observedAirChamberInitialGasLiters",
  );
  positive(input.observedInitialAbsoluteKpa, "observedInitialAbsoluteKpa");
  positive(input.callerMaximumAbsoluteKpa, "callerMaximumAbsoluteKpa");
  positive(input.callerPolytropicExponent, "callerPolytropicExponent");
  if (
    input.callerMaximumAbsoluteKpa < input.observedInitialAbsoluteKpa ||
    input.callerPolytropicExponent > 2
  )
    simpleError(
      "gas",
      "Ordered absolute pressures and polytropic exponent (0,2] required.",
    );
  const compressed =
    input.observedAirChamberInitialGasLiters *
    (input.observedInitialAbsoluteKpa / input.callerMaximumAbsoluteKpa) **
      (1 / input.callerPolytropicExponent);
  return {
    modeledCompressedGasLiters: compressed,
    modeledWaterAcceptanceLiters:
      input.observedAirChamberInitialGasLiters - compressed,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAirChamberInitialGasLiters: 10,
  observedInitialAbsoluteKpa: 100,
  callerMaximumAbsoluteKpa: 200,
  callerPolytropicExponent: 1,
} satisfies Input;
export const exampleOutput = {
  modeledCompressedGasLiters: 5,
  modeledWaterAcceptanceLiters: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/air-chamber-size",
  title: "Plumbing Air Chamber Size Calculator",
  description:
    "Evaluate actual air-chamber polytropic compression volume with caller exponent/absolute pressures; differs from inverse ideal expansion tank sizing, no gas dissolution/transient or surge safety guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledCompressedGasLiters",
      label: "Modeled compressed gas liters",
      kind: "number",
    },
    {
      id: "modeledWaterAcceptanceLiters",
      label: "Modeled water acceptance liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAirChamberInitialGasLiters:
        value.observedAirChamberInitialGasLiters as number,
      observedInitialAbsoluteKpa: value.observedInitialAbsoluteKpa as number,
      callerMaximumAbsoluteKpa: value.callerMaximumAbsoluteKpa as number,
      callerPolytropicExponent: value.callerPolytropicExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
