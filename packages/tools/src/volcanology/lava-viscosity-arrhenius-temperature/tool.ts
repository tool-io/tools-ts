import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  strictlyIncreasing,
  linearFit,
} from "../batch38-shared.js";
export type Input = Readonly<{
  observedTemperaturesKelvin: readonly number[];
  observedViscositiesPaSecond: readonly number[];
  queryTemperatureK: number;
  callerGasConstantJMolK: number;
}>;
export type Output = Readonly<{
  inferredActivationEnergyJMol: number;
  fittedViscosityPaSecond: number;
  logViscosityFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedTemperaturesKelvin",
    label: "Observed temperatures kelvin",
    kind: "numberList",
  },
  {
    id: "observedViscositiesPaSecond",
    label: "Observed viscosities pa second",
    kind: "numberList",
  },
  { id: "queryTemperatureK", label: "Query temperature k", kind: "number" },
  {
    id: "callerGasConstantJMolK",
    label: "Caller gas constant j mol k",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  input.observedTemperaturesKelvin.forEach((v) => positive(v, "temperature"));
  input.observedViscositiesPaSecond.forEach((v) => positive(v, "viscosity"));
  positive(input.queryTemperatureK, "query");
  positive(input.callerGasConstantJMolK, "gas constant");
  aligned(
    input.observedTemperaturesKelvin,
    input.observedViscositiesPaSecond,
    "matched controlled specimens",
  );
  strictlyIncreasing(input.observedTemperaturesKelvin, "temperature");
  if (
    input.queryTemperatureK < input.observedTemperaturesKelvin[0] ||
    input.queryTemperatureK > input.observedTemperaturesKelvin.at(-1)!
  )
    simpleError(
      "query",
      "No extrapolation beyond actual temperature evidence.",
    );
  const f = linearFit(
    input.observedTemperaturesKelvin.map((t) => 1 / t),
    input.observedViscositiesPaSecond.map(Math.log),
  );
  return finish({
    inferredActivationEnergyJMol: f.slope * input.callerGasConstantJMolK,
    fittedViscosityPaSecond: Math.exp(
      f.intercept + f.slope / input.queryTemperatureK,
    ),
    logViscosityFitRSquared: f.rSquared,
  });
};
export const exampleInput = {
  observedTemperaturesKelvin: [500, 1000, 2000],
  observedViscositiesPaSecond: [
    12.214027581601698, 11.051709180756477, 10.51271096376024,
  ],
  queryTemperatureK: 1000,
  callerGasConstantJMolK: 10,
} satisfies Input;
export const exampleOutput = {
  inferredActivationEnergyJMol: 1000,
  fittedViscosityPaSecond: 11.051709180756477,
  logViscosityFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/lava-viscosity-arrhenius-temperature",
  title: "Lava Viscosity Arrhenius Temperature Calculator",
  description:
    "Infer signed apparent Arrhenius activation energy and query viscosity from independently measured paired controlled temperature/viscosity specimens by OLS logη versus inverse Kelvin; report fit quality, refuse temperature extrapolation. Unlike geology/lava-viscosity this FITS evidence rather than applying supplied pre-exponential/activation-energy constants. Caller independently establishes fixed composition/crystal/water state, units and applicability; not mineral identity, operation safety or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredActivationEnergyJMol",
      label: "Inferred activation energy j mol",
      kind: "number",
    },
    {
      id: "fittedViscosityPaSecond",
      label: "Fitted viscosity pa second",
      kind: "number",
    },
    {
      id: "logViscosityFitRSquared",
      label: "Log viscosity fit r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTemperaturesKelvin:
        value.observedTemperaturesKelvin as readonly number[],
      observedViscositiesPaSecond:
        value.observedViscositiesPaSecond as readonly number[],
      queryTemperatureK: value.queryTemperatureK as number,
      callerGasConstantJMolK: value.callerGasConstantJMolK as number,
    }),
});
export const run = tool.execute;
export default tool;
