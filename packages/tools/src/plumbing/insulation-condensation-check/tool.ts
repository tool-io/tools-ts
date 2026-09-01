import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedInsulationSurfaceC: readonly number[];
  readonly independentlyEstablishedAmbientDewpointC: readonly number[];
  readonly callerRequiredDewpointClearanceC: number;
}>;
export type Output = Readonly<{
  readonly signedInsulationDewpointMarginsC: readonly number[];
  readonly surfaceStationsBelowCallerClearance: readonly number[];
}>;
const inputFields = [
  {
    id: "observedInsulationSurfaceC",
    label: "Observed insulation surface c",
    kind: "numberList",
  },
  {
    id: "independentlyEstablishedAmbientDewpointC",
    label: "Independently established ambient dewpoint c",
    kind: "numberList",
  },
  {
    id: "callerRequiredDewpointClearanceC",
    label: "Caller required dewpoint clearance c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerRequiredDewpointClearanceC,
    "callerRequiredDewpointClearanceC",
  );
  aligned(
    input.observedInsulationSurfaceC,
    input.independentlyEstablishedAmbientDewpointC,
    "observedInsulationSurfaceC",
  );
  const margins = input.observedInsulationSurfaceC.map(
    (v, i) => v - input.independentlyEstablishedAmbientDewpointC[i],
  );
  return {
    signedInsulationDewpointMarginsC: margins,
    surfaceStationsBelowCallerClearance: margins.flatMap((v, i) =>
      v < input.callerRequiredDewpointClearanceC ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedInsulationSurfaceC: [12, 15, 20],
  independentlyEstablishedAmbientDewpointC: [14, 14, 18],
  callerRequiredDewpointClearanceC: 1,
} satisfies Input;
export const exampleOutput = {
  signedInsulationDewpointMarginsC: [-2, 1, 2],
  surfaceStationsBelowCallerClearance: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/insulation-condensation-check",
  title: "Plumbing Insulation Condensation Check Calculator",
  description:
    "Audit actual insulated surface/dewpoint observations and caller margin; no dewpoint psychrometric reimplementation, moisture history, vapor-seal integrity or condensation guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedInsulationDewpointMarginsC",
      label: "Signed insulation dewpoint margins c",
      kind: "numberList",
    },
    {
      id: "surfaceStationsBelowCallerClearance",
      label: "Surface stations below caller clearance",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedInsulationSurfaceC:
        value.observedInsulationSurfaceC as readonly number[],
      independentlyEstablishedAmbientDewpointC:
        value.independentlyEstablishedAmbientDewpointC as readonly number[],
      callerRequiredDewpointClearanceC:
        value.callerRequiredDewpointClearanceC as number,
    }),
});
export const run = tool.execute;
export default tool;
