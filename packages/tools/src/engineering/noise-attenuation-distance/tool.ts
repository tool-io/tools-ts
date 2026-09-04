import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedReferenceLevelDb: number;
  readonly referenceDistanceM: number;
  readonly queryDistanceM: number;
  readonly callerAtmosphericLossDbPerM: number;
  readonly callerAdditionalScreeningLossDb: number;
}>;
export type Output = Readonly<{ readonly modeledPointSourceLevelDb: number }>;
const inputFields = [
  {
    id: "observedReferenceLevelDb",
    label: "Observed reference level db",
    kind: "number",
  },
  { id: "referenceDistanceM", label: "Reference distance m", kind: "number" },
  { id: "queryDistanceM", label: "Query distance m", kind: "number" },
  {
    id: "callerAtmosphericLossDbPerM",
    label: "Caller atmospheric loss db per m",
    kind: "number",
  },
  {
    id: "callerAdditionalScreeningLossDb",
    label: "Caller additional screening loss db",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceDistanceM, "referenceDistanceM");
  positive(input.queryDistanceM, "queryDistanceM");
  nonnegative(input.callerAtmosphericLossDbPerM, "callerAtmosphericLossDbPerM");
  nonnegative(
    input.callerAdditionalScreeningLossDb,
    "callerAdditionalScreeningLossDb",
  );
  return {
    modeledPointSourceLevelDb:
      input.observedReferenceLevelDb -
      20 * Math.log10(input.queryDistanceM / input.referenceDistanceM) -
      input.callerAtmosphericLossDbPerM *
        (input.queryDistanceM - input.referenceDistanceM) -
      input.callerAdditionalScreeningLossDb,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedReferenceLevelDb: 80,
  referenceDistanceM: 10,
  queryDistanceM: 20,
  callerAtmosphericLossDbPerM: 0.1,
  callerAdditionalScreeningLossDb: 2,
} satisfies Input;
export const exampleOutput = {
  modeledPointSourceLevelDb: 70.97940008672037,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/noise-attenuation-distance",
  title: "Noise Attenuation Distance Calculator",
  description:
    "Point-source geometric distance attenuation plus independent atmospheric/path screen loss, no diffuse/line-source substitution or human exposure standard. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledPointSourceLevelDb",
      label: "Modeled point source level db",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedReferenceLevelDb: value.observedReferenceLevelDb as number,
      referenceDistanceM: value.referenceDistanceM as number,
      queryDistanceM: value.queryDistanceM as number,
      callerAtmosphericLossDbPerM: value.callerAtmosphericLossDbPerM as number,
      callerAdditionalScreeningLossDb:
        value.callerAdditionalScreeningLossDb as number,
    }),
});
export const run = tool.execute;
export default tool;
