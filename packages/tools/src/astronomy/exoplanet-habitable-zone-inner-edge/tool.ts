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
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly stellarLuminositySolar: number;
  readonly callerInnerEffectiveFluxSolar: number;
  readonly callerOuterEffectiveFluxSolar: number;
}>;
export type Output = Readonly<{
  readonly conditionalInnerAu: number;
  readonly conditionalOuterAu: number;
}>;
const inputFields = [
  {
    id: "stellarLuminositySolar",
    label: "Stellar luminosity solar",
    kind: "number",
  },
  {
    id: "callerInnerEffectiveFluxSolar",
    label: "Caller inner effective flux solar",
    kind: "number",
  },
  {
    id: "callerOuterEffectiveFluxSolar",
    label: "Caller outer effective flux solar",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerInnerEffectiveFluxSolar,
    "callerInnerEffectiveFluxSolar",
  );
  positive(
    input.callerOuterEffectiveFluxSolar,
    "callerOuterEffectiveFluxSolar",
  );
  nonnegative(input.stellarLuminositySolar, "stellarLuminositySolar");
  if (
    input.callerInnerEffectiveFluxSolar <= input.callerOuterEffectiveFluxSolar
  )
    simpleError("flux", "Inner effective flux strictly above outer.");
  return {
    conditionalInnerAu: Math.sqrt(
      input.stellarLuminositySolar / input.callerInnerEffectiveFluxSolar,
    ),
    conditionalOuterAu: Math.sqrt(
      input.stellarLuminositySolar / input.callerOuterEffectiveFluxSolar,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stellarLuminositySolar: 4,
  callerInnerEffectiveFluxSolar: 1.25,
  callerOuterEffectiveFluxSolar: 0.25,
} satisfies Input;
export const exampleOutput = {
  conditionalInnerAu: 1.7888543819998317,
  conditionalOuterAu: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/exoplanet-habitable-zone-inner-edge",
  title: "Habitable Zone Inner Edge Calculator",
  description:
    "Caller spectrum/model independently verified two effective-flux boundaries; conditional HZ distance interval, not planet habitability or fixed universal solar limits. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "conditionalInnerAu", label: "Conditional inner au", kind: "number" },
    { id: "conditionalOuterAu", label: "Conditional outer au", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      stellarLuminositySolar: value.stellarLuminositySolar as number,
      callerInnerEffectiveFluxSolar:
        value.callerInnerEffectiveFluxSolar as number,
      callerOuterEffectiveFluxSolar:
        value.callerOuterEffectiveFluxSolar as number,
    }),
});
export const run = tool.execute;
export default tool;
