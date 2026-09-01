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
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerFreeAirDemandM3Minute: number;
  readonly observedCompressorFreeAirM3Minute: number;
  readonly callerDemandBurstMinutes: number;
  readonly callerAtmosphericAbsoluteKpa: number;
  readonly callerReceiverUpperAbsoluteKpa: number;
  readonly callerReceiverLowerAbsoluteKpa: number;
}>;
export type Output = Readonly<{
  readonly requiredIdealReceiverM3: number;
  readonly modeledFreeAirDeficitM3: number;
}>;
const inputFields = [
  {
    id: "callerFreeAirDemandM3Minute",
    label: "Caller free air demand m3 minute",
    kind: "number",
  },
  {
    id: "observedCompressorFreeAirM3Minute",
    label: "Observed compressor free air m3 minute",
    kind: "number",
  },
  {
    id: "callerDemandBurstMinutes",
    label: "Caller demand burst minutes",
    kind: "number",
  },
  {
    id: "callerAtmosphericAbsoluteKpa",
    label: "Caller atmospheric absolute kpa",
    kind: "number",
  },
  {
    id: "callerReceiverUpperAbsoluteKpa",
    label: "Caller receiver upper absolute kpa",
    kind: "number",
  },
  {
    id: "callerReceiverLowerAbsoluteKpa",
    label: "Caller receiver lower absolute kpa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerAtmosphericAbsoluteKpa, "callerAtmosphericAbsoluteKpa");
  positive(
    input.callerReceiverUpperAbsoluteKpa,
    "callerReceiverUpperAbsoluteKpa",
  );
  positive(
    input.callerReceiverLowerAbsoluteKpa,
    "callerReceiverLowerAbsoluteKpa",
  );
  nonnegative(input.callerFreeAirDemandM3Minute, "callerFreeAirDemandM3Minute");
  nonnegative(
    input.observedCompressorFreeAirM3Minute,
    "observedCompressorFreeAirM3Minute",
  );
  nonnegative(input.callerDemandBurstMinutes, "callerDemandBurstMinutes");
  if (
    input.callerReceiverUpperAbsoluteKpa <=
      input.callerReceiverLowerAbsoluteKpa ||
    input.callerReceiverLowerAbsoluteKpa < input.callerAtmosphericAbsoluteKpa
  )
    simpleError(
      "pressures",
      "Ordered absolute receiver envelope above atmosphere required.",
    );
  const deficit =
    Math.max(
      0,
      input.callerFreeAirDemandM3Minute -
        input.observedCompressorFreeAirM3Minute,
    ) * input.callerDemandBurstMinutes;
  return {
    requiredIdealReceiverM3:
      (deficit * input.callerAtmosphericAbsoluteKpa) /
      (input.callerReceiverUpperAbsoluteKpa -
        input.callerReceiverLowerAbsoluteKpa),
    modeledFreeAirDeficitM3: deficit,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFreeAirDemandM3Minute: 2,
  observedCompressorFreeAirM3Minute: 1,
  callerDemandBurstMinutes: 2,
  callerAtmosphericAbsoluteKpa: 100,
  callerReceiverUpperAbsoluteKpa: 300,
  callerReceiverLowerAbsoluteKpa: 200,
} satisfies Input;
export const exampleOutput = {
  requiredIdealReceiverM3: 2,
  modeledFreeAirDeficitM3: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/compressed-air-receiver-size",
  title: "Plumbing Compressed Air Receiver Size Calculator",
  description:
    "Budget actual free-air demand burst/compressor deficit through ideal isothermal absolute receiver envelope; no compressed-volume conflation, vessel design or operating pressure approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredIdealReceiverM3",
      label: "Required ideal receiver m3",
      kind: "number",
    },
    {
      id: "modeledFreeAirDeficitM3",
      label: "Modeled free air deficit m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerFreeAirDemandM3Minute: value.callerFreeAirDemandM3Minute as number,
      observedCompressorFreeAirM3Minute:
        value.observedCompressorFreeAirM3Minute as number,
      callerDemandBurstMinutes: value.callerDemandBurstMinutes as number,
      callerAtmosphericAbsoluteKpa:
        value.callerAtmosphericAbsoluteKpa as number,
      callerReceiverUpperAbsoluteKpa:
        value.callerReceiverUpperAbsoluteKpa as number,
      callerReceiverLowerAbsoluteKpa:
        value.callerReceiverLowerAbsoluteKpa as number,
    }),
});
export const run = tool.execute;
export default tool;
