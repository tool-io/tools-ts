import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualOutputAsePowerWatts: number;
  readonly callerPhotonEnergyJoules: number;
  readonly actualOpticalNoiseBandwidthHz: number;
  readonly actualLinearOpticalGain: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualOutputAsePowerWatts",
    label: "Actual output ase power watts",
    kind: "number",
  },
  {
    id: "callerPhotonEnergyJoules",
    label: "Caller photon energy joules",
    kind: "number",
  },
  {
    id: "actualOpticalNoiseBandwidthHz",
    label: "Actual optical noise bandwidth hz",
    kind: "number",
  },
  {
    id: "actualLinearOpticalGain",
    label: "Actual linear optical gain",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.actualOutputAsePowerWatts, "ASE");
  positive(input.callerPhotonEnergyJoules, "photonenergy");
  positive(input.actualOpticalNoiseBandwidthHz, "bandwidth");
  if (input.actualLinearOpticalGain < 1)
    simpleError("gain", "Actual amplifying EDFA gain≥1.");
  const f =
    (input.actualOutputAsePowerWatts /
      (input.callerPhotonEnergyJoules * input.actualOpticalNoiseBandwidthHz) +
      1) /
    input.actualLinearOpticalGain;
  if (f < 1)
    simpleError(
      "ASE",
      "Declared both-polarization convention requires noise factor≥1.",
    );
  return { noiseFactor: f, noiseFigureDb: 10 * Math.log10(f) };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualOutputAsePowerWatts: 7,
    callerPhotonEnergyJoules: 1,
    actualOpticalNoiseBandwidthHz: 1,
    actualLinearOpticalGain: 4,
  },
  output: { result: { noiseFactor: 2, noiseFigureDb: 3.010299956639812 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/edfa-noise-figure",
  title: "Edfa Noise Figure Calculator",
  description:
    "Declared EDFA F=[Pase/(h\u03bdB)+1]/G and noise figure10log10(F) dB for output ASE BOTH polarizations, actual linear gain\u22651 and complete matched bandwidth. Require consistent F\u22651; not generic dB converter, one-polarization ASE or infer noise spectrum. Parameters independently calibrated; not manufacturer performance or safe design approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          noiseFactor: { type: "number" },
          noiseFigureDb: { type: "number" },
        },
        required: ["noiseFactor", "noiseFigureDb"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
