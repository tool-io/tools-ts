import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  safeCeil,
} from "../shared.js";
export type Input = Readonly<{
  readonly deliveredGrapeMassKg: number;
  readonly nominalLugPayloadKg: number;
  readonly callerUsablePayloadFraction: number;
}>;
export type Output = Readonly<{
  readonly effectiveLugPayloadKg: number;
  readonly wholeLugsRequired: number;
  readonly unusedLastLugCapacityKg: number;
}>;
const inputFields = [
  {
    id: "deliveredGrapeMassKg",
    label: "Delivered grape mass kg",
    kind: "number",
  },
  {
    id: "nominalLugPayloadKg",
    label: "Nominal lug payload kg",
    kind: "number",
  },
  {
    id: "callerUsablePayloadFraction",
    label: "Caller usable payload fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.nominalLugPayloadKg, "nominalLugPayloadKg");
  positive(input.callerUsablePayloadFraction, "callerUsablePayloadFraction");
  nonnegative(input.deliveredGrapeMassKg, "deliveredGrapeMassKg");
  fraction(input.callerUsablePayloadFraction, "callerUsablePayloadFraction");
  const effectiveLugPayloadKg =
      input.nominalLugPayloadKg * input.callerUsablePayloadFraction,
    wholeLugsRequired = safeCeil(
      input.deliveredGrapeMassKg / effectiveLugPayloadKg,
      "wholeLugs",
    );
  return {
    effectiveLugPayloadKg,
    wholeLugsRequired,
    unusedLastLugCapacityKg:
      wholeLugsRequired * effectiveLugPayloadKg - input.deliveredGrapeMassKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  deliveredGrapeMassKg: 1000,
  nominalLugPayloadKg: 20,
  callerUsablePayloadFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  effectiveLugPayloadKg: 16,
  wholeLugsRequired: 63,
  unusedLastLugCapacityKg: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/picking-lugs-per-ton",
  title: "Picking Lugs Per Ton",
  description:
    "Budget whole picking lugs from actual required mass and caller usable payload, retaining final capacity remainder; no bin-density estimate or load/handling safety certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "effectiveLugPayloadKg",
      label: "Effective lug payload kg",
      kind: "number",
    },
    { id: "wholeLugsRequired", label: "Whole lugs required", kind: "number" },
    {
      id: "unusedLastLugCapacityKg",
      label: "Unused last lug capacity kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      deliveredGrapeMassKg: value.deliveredGrapeMassKg as number,
      nominalLugPayloadKg: value.nominalLugPayloadKg as number,
      callerUsablePayloadFraction: value.callerUsablePayloadFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
