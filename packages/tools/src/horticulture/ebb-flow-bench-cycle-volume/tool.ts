import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly benchAreaM2: number;
  readonly floodDepthCm: number;
  readonly submergedSolidDisplacementLiters: number;
  readonly mediaAbsorptionLiters: number;
  readonly plumbingHoldUpLiters: number;
  readonly drainRecoveryFraction: number;
}>;
export type Output = Readonly<{
  readonly floodCycleDeliveredLiters: number;
  readonly recoverableDrainLiters: number;
  readonly netMakeupLitersPerCycle: number;
}>;
const inputFields = [
  { id: "benchAreaM2", label: "Bench area m2", kind: "number" },
  { id: "floodDepthCm", label: "Flood depth cm", kind: "number" },
  {
    id: "submergedSolidDisplacementLiters",
    label: "Submerged solid displacement liters",
    kind: "number",
  },
  {
    id: "mediaAbsorptionLiters",
    label: "Media absorption liters",
    kind: "number",
  },
  {
    id: "plumbingHoldUpLiters",
    label: "Plumbing hold up liters",
    kind: "number",
  },
  {
    id: "drainRecoveryFraction",
    label: "Drain recovery fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.benchAreaM2, "benchAreaM2");
  nonnegative(input.floodDepthCm, "floodDepthCm");
  nonnegative(
    input.submergedSolidDisplacementLiters,
    "submergedSolidDisplacementLiters",
  );
  nonnegative(input.mediaAbsorptionLiters, "mediaAbsorptionLiters");
  nonnegative(input.plumbingHoldUpLiters, "plumbingHoldUpLiters");
  fraction(input.drainRecoveryFraction, "drainRecoveryFraction");
  const free = nonnegative(
      input.benchAreaM2 * input.floodDepthCm * 10 -
        input.submergedSolidDisplacementLiters,
      "submergedSolidDisplacementLiters",
    ),
    floodCycleDeliveredLiters =
      free + input.mediaAbsorptionLiters + input.plumbingHoldUpLiters,
    recoverableDrainLiters =
      (free + input.plumbingHoldUpLiters) * input.drainRecoveryFraction;
  return {
    floodCycleDeliveredLiters,
    recoverableDrainLiters,
    netMakeupLitersPerCycle: floodCycleDeliveredLiters - recoverableDrainLiters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  benchAreaM2: 10,
  floodDepthCm: 2,
  submergedSolidDisplacementLiters: 20,
  mediaAbsorptionLiters: 30,
  plumbingHoldUpLiters: 10,
  drainRecoveryFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  floodCycleDeliveredLiters: 220,
  recoverableDrainLiters: 152,
  netMakeupLitersPerCycle: 68,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/ebb-flow-bench-cycle-volume",
  title: "Ebb Flow Bench Cycle Volume",
  description:
    "Balance ebb/flow flooded free volume, solid displacement, additional media absorption and plumbing with caller drain recovery; solid displacement excludes open pores already represented in absorption.",
  inputs: inputFields,
  outputs: [
    {
      id: "floodCycleDeliveredLiters",
      label: "Flood cycle delivered liters",
      kind: "number",
    },
    {
      id: "recoverableDrainLiters",
      label: "Recoverable drain liters",
      kind: "number",
    },
    {
      id: "netMakeupLitersPerCycle",
      label: "Net makeup liters per cycle",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      benchAreaM2: value.benchAreaM2 as number,
      floodDepthCm: value.floodDepthCm as number,
      submergedSolidDisplacementLiters:
        value.submergedSolidDisplacementLiters as number,
      mediaAbsorptionLiters: value.mediaAbsorptionLiters as number,
      plumbingHoldUpLiters: value.plumbingHoldUpLiters as number,
      drainRecoveryFraction: value.drainRecoveryFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
