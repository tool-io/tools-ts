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
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly rainfallDepthMm: number;
  readonly callerCurveNumber: number;
  readonly callerInitialAbstractionFraction: number;
}>;
export type Output = Readonly<{
  readonly scsStorageMm: number;
  readonly scsRunoffMm: number;
}>;
const inputFields = [
  { id: "rainfallDepthMm", label: "Rainfall depth mm", kind: "number" },
  { id: "callerCurveNumber", label: "Caller curve number", kind: "number" },
  {
    id: "callerInitialAbstractionFraction",
    label: "Caller initial abstraction fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.rainfallDepthMm, "rainfallDepthMm");
  fraction(
    input.callerInitialAbstractionFraction,
    "callerInitialAbstractionFraction",
  );
  if (input.callerCurveNumber <= 0 || input.callerCurveNumber > 100)
    simpleError(
      "CN",
      "0<CN≤100 independently selected matching event/antecedent method.",
    );
  const s = 25400 / input.callerCurveNumber - 254,
    excess = input.rainfallDepthMm - input.callerInitialAbstractionFraction * s;
  return {
    scsStorageMm: s,
    scsRunoffMm:
      excess <= 0
        ? 0
        : s === 0
          ? input.rainfallDepthMm
          : excess * (excess / (excess + s)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rainfallDepthMm: 100,
  callerCurveNumber: 80,
  callerInitialAbstractionFraction: 0.2,
} satisfies Input;
export const exampleOutput = {
  scsStorageMm: 63.5,
  scsRunoffMm: 50.53905835543765,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/scs-curve-number-runoff",
  title: "SCS Curve Number Runoff Calculator",
  description:
    "SCS/NRCS event runoff with explicit abstraction fraction and mm storage25400/CN−254, no assumedCN from land class. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    { id: "scsStorageMm", label: "Scs storage mm", kind: "number" },
    { id: "scsRunoffMm", label: "Scs runoff mm", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      rainfallDepthMm: value.rainfallDepthMm as number,
      callerCurveNumber: value.callerCurveNumber as number,
      callerInitialAbstractionFraction:
        value.callerInitialAbstractionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
