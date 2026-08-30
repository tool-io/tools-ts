import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly measuredClumpedDelta47: number;
  readonly calibrationA: number;
  readonly calibrationB: number;
  readonly calibrationTemperatureBoundsK: readonly number[];
}>;
export type Output = Readonly<{ readonly modelTemperatureKelvin: number }>;
const inputFields = [
  {
    id: "measuredClumpedDelta47",
    label: "Measured clumped delta47",
    kind: "number",
  },
  { id: "calibrationA", label: "Calibration a", kind: "number" },
  { id: "calibrationB", label: "Calibration b", kind: "number" },
  {
    id: "calibrationTemperatureBoundsK",
    label: "Calibration temperature bounds k",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.calibrationA, "calibrationA");
  input.calibrationTemperatureBoundsK.forEach((v) =>
    positive(v, "calibrationTemperatureBoundsK"),
  );
  if (
    input.calibrationTemperatureBoundsK.length !== 2 ||
    input.calibrationTemperatureBoundsK[0] >
      input.calibrationTemperatureBoundsK[1]
  )
    simpleError(
      "bounds",
      "Ordered positive Kelvin calibration bounds required.",
    );
  const modelTemperatureKelvin = Math.sqrt(
    input.calibrationA /
      positive(
        input.measuredClumpedDelta47 - input.calibrationB,
        "measuredClumpedDelta47",
      ),
  );
  if (
    modelTemperatureKelvin < input.calibrationTemperatureBoundsK[0] ||
    modelTemperatureKelvin > input.calibrationTemperatureBoundsK[1]
  )
    simpleError(
      "temperature",
      "Outside supplied clumped-isotope calibration domain.",
    );
  return { modelTemperatureKelvin };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredClumpedDelta47: 0.75,
  calibrationA: 45000,
  calibrationB: 0.25,
  calibrationTemperatureBoundsK: [250, 350],
} satisfies Input;
export const exampleOutput = { modelTemperatureKelvin: 300 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/clumped-isotope-temp",
  title: "Clumped Isotope Temperature",
  description:
    "Invert a supplied Δ47=A/T_K²+B calibration only within caller temperature/reference-frame bounds; no universal isotope coefficients, diagenesis correction or validated paleotemperature.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelTemperatureKelvin",
      label: "Model temperature kelvin",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredClumpedDelta47: value.measuredClumpedDelta47 as number,
      calibrationA: value.calibrationA as number,
      calibrationB: value.calibrationB as number,
      calibrationTemperatureBoundsK:
        value.calibrationTemperatureBoundsK as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
