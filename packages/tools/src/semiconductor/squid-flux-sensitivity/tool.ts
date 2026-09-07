import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedSquidFluxUnits: readonly number[];
  readonly observedSquidOutputVolts: readonly number[];
  readonly observedOutputNoiseVoltsPerSqrtHz: number;
}>;
export type Output = Readonly<{
  readonly measuredSquidTransferVoltsPerFluxUnit: number;
  readonly inputReferredFluxNoiseUnitsPerSqrtHz: number;
}>;
const inputFields = [
  {
    id: "observedSquidFluxUnits",
    label: "Observed squid flux units",
    kind: "numberList",
  },
  {
    id: "observedSquidOutputVolts",
    label: "Observed squid output volts",
    kind: "numberList",
  },
  {
    id: "observedOutputNoiseVoltsPerSqrtHz",
    label: "Observed output noise volts per sqrt hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.observedOutputNoiseVoltsPerSqrtHz,
    "observedOutputNoiseVoltsPerSqrtHz",
  );
  const fit = linearFit(
    input.observedSquidFluxUnits,
    input.observedSquidOutputVolts,
  );
  if (fit.slope === 0)
    simpleError(
      "slope",
      "Nonzero independently selected SQUID flux-transfer branch required.",
    );
  return {
    measuredSquidTransferVoltsPerFluxUnit: fit.slope,
    inputReferredFluxNoiseUnitsPerSqrtHz:
      input.observedOutputNoiseVoltsPerSqrtHz / Math.abs(fit.slope),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSquidFluxUnits: [0, 1, 2],
  observedSquidOutputVolts: [0, 2, 4],
  observedOutputNoiseVoltsPerSqrtHz: 0.1,
} satisfies Input;
export const exampleOutput = {
  measuredSquidTransferVoltsPerFluxUnit: 2,
  inputReferredFluxNoiseUnitsPerSqrtHz: 0.05,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/squid-flux-sensitivity",
  title: "Semiconductor Squid Flux Sensitivity Calculator",
  description:
    "Extract actual local SQUID flux responsivity and independent noise referred through fitted slope; not arbitrary voltage ratio or flux quantum inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredSquidTransferVoltsPerFluxUnit",
      label: "Measured squid transfer volts per flux unit",
      kind: "number",
    },
    {
      id: "inputReferredFluxNoiseUnitsPerSqrtHz",
      label: "Input referred flux noise units per sqrt hz",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSquidFluxUnits: value.observedSquidFluxUnits as readonly number[],
      observedSquidOutputVolts:
        value.observedSquidOutputVolts as readonly number[],
      observedOutputNoiseVoltsPerSqrtHz:
        value.observedOutputNoiseVoltsPerSqrtHz as number,
    }),
});
export const run = tool.execute;
export default tool;
