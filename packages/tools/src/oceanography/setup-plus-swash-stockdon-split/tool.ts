import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly deepWaterSignificantHeightM: number;
  readonly deepWaterWaveLengthM: number;
  readonly foreshoreSlope: number;
}>;
export type Output = Readonly<{
  readonly stockdonMeanSetupM: number;
  readonly stockdonIncidentSwashM: number;
  readonly stockdonInfragravitySwashM: number;
  readonly stockdonR2PercentM: number;
}>;
const inputFields = [
  {
    id: "deepWaterSignificantHeightM",
    label: "Deep water significant height m",
    kind: "number",
  },
  {
    id: "deepWaterWaveLengthM",
    label: "Deep water wave length m",
    kind: "number",
  },
  { id: "foreshoreSlope", label: "Foreshore slope", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.deepWaterWaveLengthM, "deepWaterWaveLengthM");
  nonnegative(input.deepWaterSignificantHeightM, "deepWaterSignificantHeightM");
  nonnegative(input.foreshoreSlope, "foreshoreSlope");
  const root = Math.sqrt(
      input.deepWaterSignificantHeightM * input.deepWaterWaveLengthM,
    ),
    setup = 0.35 * input.foreshoreSlope * root,
    incident = 0.75 * input.foreshoreSlope * root,
    infra = Math.sqrt(0.004) * root;
  return {
    stockdonMeanSetupM: setup,
    stockdonIncidentSwashM: incident,
    stockdonInfragravitySwashM: infra,
    stockdonR2PercentM: 1.1 * (setup + 0.5 * Math.hypot(incident, infra)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  deepWaterSignificantHeightM: 1,
  deepWaterWaveLengthM: 100,
  foreshoreSlope: 0.1,
} satisfies Input;
export const exampleOutput = {
  stockdonMeanSetupM: 0.35,
  stockdonIncidentSwashM: 0.75,
  stockdonInfragravitySwashM: 0.6324555320336759,
  stockdonR2PercentM: 0.9245889639345862,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/setup-plus-swash-stockdon-split",
  title: "Setup Plus Swash Stockdon Split Calculator",
  description:
    "Stockdon 2006 setup and incident/infragravity swash components plus R2, explicit deepwater inputs and empirical beach branch; not slope-based generic runup heuristic. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "stockdonMeanSetupM",
      label: "Stockdon mean setup m",
      kind: "number",
    },
    {
      id: "stockdonIncidentSwashM",
      label: "Stockdon incident swash m",
      kind: "number",
    },
    {
      id: "stockdonInfragravitySwashM",
      label: "Stockdon infragravity swash m",
      kind: "number",
    },
    {
      id: "stockdonR2PercentM",
      label: "Stockdon r2 percent m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      deepWaterSignificantHeightM: value.deepWaterSignificantHeightM as number,
      deepWaterWaveLengthM: value.deepWaterWaveLengthM as number,
      foreshoreSlope: value.foreshoreSlope as number,
    }),
});
export const run = tool.execute;
export default tool;
