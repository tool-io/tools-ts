import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedSourceClimateC: number;
  readonly observedTargetClimateC: number;
  readonly callerLocalTemperatureGradientCPerLatitudeDegree: number;
}>;
export type Output = Readonly<{
  readonly climateEquivalentSignedLatitudeDegrees: number;
}>;
const inputFields = [
  {
    id: "observedSourceClimateC",
    label: "Observed source climate c",
    kind: "number",
  },
  {
    id: "observedTargetClimateC",
    label: "Observed target climate c",
    kind: "number",
  },
  {
    id: "callerLocalTemperatureGradientCPerLatitudeDegree",
    label: "Caller local temperature gradient c per latitude degree",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.callerLocalTemperatureGradientCPerLatitudeDegree === 0)
    simpleError(
      "gradient",
      "Nonzero independently measured climate gradient required.",
    );
  return {
    climateEquivalentSignedLatitudeDegrees:
      (input.observedTargetClimateC - input.observedSourceClimateC) /
      input.callerLocalTemperatureGradientCPerLatitudeDegree,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSourceClimateC: 10,
  observedTargetClimateC: 8,
  callerLocalTemperatureGradientCPerLatitudeDegree: -0.5,
} satisfies Input;
export const exampleOutput = {
  climateEquivalentSignedLatitudeDegrees: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/provenance-transfer-latitude-equivalent",
  title: "Provenance Transfer Latitude Equivalent Calculator",
  description:
    "Translate matched climate difference through caller local temperature/latitude gradient only, no coordinates, geodesy, actual geographic transfer or seed adaptation conclusion. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "climateEquivalentSignedLatitudeDegrees",
      label: "Climate equivalent signed latitude degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSourceClimateC: value.observedSourceClimateC as number,
      observedTargetClimateC: value.observedTargetClimateC as number,
      callerLocalTemperatureGradientCPerLatitudeDegree:
        value.callerLocalTemperatureGradientCPerLatitudeDegree as number,
    }),
});
export const run = tool.execute;
export default tool;
