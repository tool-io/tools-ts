import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedClusterVolumeLiters: number;
  readonly callerPackingAvailableFraction: number;
  readonly callerExtraReservedLiters: number;
  readonly observedBoxUsableLiters: number;
}>;
export type Output = Readonly<{
  readonly conditionalRequiredBoxLiters: number;
  readonly signedUsableVolumeReserveLiters: number;
}>;
const inputFields = [
  {
    id: "observedClusterVolumeLiters",
    label: "Observed cluster volume liters",
    kind: "number",
  },
  {
    id: "callerPackingAvailableFraction",
    label: "Caller packing available fraction",
    kind: "number",
  },
  {
    id: "callerExtraReservedLiters",
    label: "Caller extra reserved liters",
    kind: "number",
  },
  {
    id: "observedBoxUsableLiters",
    label: "Observed box usable liters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerPackingAvailableFraction,
    "callerPackingAvailableFraction",
  );
  nonnegative(input.observedClusterVolumeLiters, "observedClusterVolumeLiters");
  nonnegative(input.callerExtraReservedLiters, "callerExtraReservedLiters");
  nonnegative(input.observedBoxUsableLiters, "observedBoxUsableLiters");
  fraction(input.callerPackingAvailableFraction, "packing availability");
  const v =
    input.observedClusterVolumeLiters / input.callerPackingAvailableFraction +
    input.callerExtraReservedLiters;
  return {
    conditionalRequiredBoxLiters: v,
    signedUsableVolumeReserveLiters: input.observedBoxUsableLiters - v,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedClusterVolumeLiters: 10,
  callerPackingAvailableFraction: 0.5,
  callerExtraReservedLiters: 2,
  observedBoxUsableLiters: 25,
} satisfies Input;
export const exampleOutput = {
  conditionalRequiredBoxLiters: 22,
  signedUsableVolumeReserveLiters: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/swarm-capture-box-sizing-cluster-volume",
  title: "Swarm Capture Box Sizing By Cluster Volume Calculator",
  description:
    "Observed independently measured cluster volume/available packing plus explicit reserve box sizing, not cluster bee-count estimate or safe swarm-capture instruction. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalRequiredBoxLiters",
      label: "Conditional required box liters",
      kind: "number",
    },
    {
      id: "signedUsableVolumeReserveLiters",
      label: "Signed usable volume reserve liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedClusterVolumeLiters: value.observedClusterVolumeLiters as number,
      callerPackingAvailableFraction:
        value.callerPackingAvailableFraction as number,
      callerExtraReservedLiters: value.callerExtraReservedLiters as number,
      observedBoxUsableLiters: value.observedBoxUsableLiters as number,
    }),
});
export const run = tool.execute;
export default tool;
