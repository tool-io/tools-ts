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
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly referenceConductivityMicroS: readonly number[];
  readonly callerTdsMgLiterPerMicroS: number;
  readonly callerCalibrationOffsetMgLiter: number;
}>;
export type Output = Readonly<{
  readonly calibratedTdsMgLiter: readonly number[];
}>;
const inputFields = [
  {
    id: "referenceConductivityMicroS",
    label: "Reference conductivity micro s",
    kind: "numberList",
  },
  {
    id: "callerTdsMgLiterPerMicroS",
    label: "Caller tds mg liter per micro s",
    kind: "number",
  },
  {
    id: "callerCalibrationOffsetMgLiter",
    label: "Caller calibration offset mg liter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerTdsMgLiterPerMicroS, "callerTdsMgLiterPerMicroS");
  input.referenceConductivityMicroS.forEach((v) =>
    nonnegative(v, "referenceConductivityMicroS"),
  );
  const estimates = input.referenceConductivityMicroS.map(
    (v) =>
      v * input.callerTdsMgLiterPerMicroS +
      input.callerCalibrationOffsetMgLiter,
  );
  if (estimates.some((v) => v < 0))
    simpleError(
      "calibration",
      "Supplied local calibration returns nonphysical TDS.",
    );
  return { calibratedTdsMgLiter: estimates };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceConductivityMicroS: [100, 200],
  callerTdsMgLiterPerMicroS: 0.5,
  callerCalibrationOffsetMgLiter: 10,
} satisfies Input;
export const exampleOutput = {
  calibratedTdsMgLiter: [60, 110],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/tds-from-conductivity",
  title: "TDS From Conductivity Calculator",
  description:
    "Apply explicit caller local reference-temperature conductivity/TDS linear calibration including intercept; not direct gravimetric measurement or universal 0.5/0.7 factor.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedTdsMgLiter",
      label: "Calibrated tds mg liter",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceConductivityMicroS:
        value.referenceConductivityMicroS as readonly number[],
      callerTdsMgLiterPerMicroS: value.callerTdsMgLiterPerMicroS as number,
      callerCalibrationOffsetMgLiter:
        value.callerCalibrationOffsetMgLiter as number,
    }),
});
export const run = tool.execute;
export default tool;
