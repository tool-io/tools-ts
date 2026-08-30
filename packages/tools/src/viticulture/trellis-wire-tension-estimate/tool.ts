import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly wireSpanM: number;
  readonly declaredDistributedGravityLoadNPerM: number;
  readonly measuredMidspanSagM: number;
  readonly callerWireTensionLimitN: number;
}>;
export type Output = Readonly<{
  readonly parabolicHorizontalWireTensionN: number;
  readonly parabolicEndpointWireTensionN: number;
  readonly aboveCallerWireTensionLimit: boolean;
}>;
const inputFields = [
  { id: "wireSpanM", label: "Wire span m", kind: "number" },
  {
    id: "declaredDistributedGravityLoadNPerM",
    label: "Declared distributed gravity load n per m",
    kind: "number",
  },
  {
    id: "measuredMidspanSagM",
    label: "Measured midspan sag m",
    kind: "number",
  },
  {
    id: "callerWireTensionLimitN",
    label: "Caller wire tension limit n",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.wireSpanM, "wireSpanM");
  positive(input.measuredMidspanSagM, "measuredMidspanSagM");
  positive(input.callerWireTensionLimitN, "callerWireTensionLimitN");
  nonnegative(
    input.declaredDistributedGravityLoadNPerM,
    "declaredDistributedGravityLoadNPerM",
  );
  if (input.measuredMidspanSagM > input.wireSpanM / 5)
    simpleError(
      "sag",
      "Small-sag parabolic screen restricted to sag/span≤0.2.",
    );
  const h =
      (input.declaredDistributedGravityLoadNPerM * input.wireSpanM ** 2) /
      (8 * input.measuredMidspanSagM),
    t = Math.hypot(
      h,
      (input.declaredDistributedGravityLoadNPerM * input.wireSpanM) / 2,
    );
  return {
    parabolicHorizontalWireTensionN: h,
    parabolicEndpointWireTensionN: t,
    aboveCallerWireTensionLimit: t > input.callerWireTensionLimitN,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  wireSpanM: 10,
  declaredDistributedGravityLoadNPerM: 2,
  measuredMidspanSagM: 1,
  callerWireTensionLimitN: 30,
} satisfies Input;
export const exampleOutput = {
  parabolicHorizontalWireTensionN: 25,
  parabolicEndpointWireTensionN: 26.92582403567252,
  aboveCallerWireTensionLimit: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/trellis-wire-tension-estimate",
  title: "Trellis Wire Tension Estimate",
  description:
    "Infer ideal parabolic span tension from declared uniform gravity line load and measured small sag, retaining horizontal/endpoint forces; not generic stress or real catenary/temperature/anchor capacity certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "parabolicHorizontalWireTensionN",
      label: "Parabolic horizontal wire tension n",
      kind: "number",
    },
    {
      id: "parabolicEndpointWireTensionN",
      label: "Parabolic endpoint wire tension n",
      kind: "number",
    },
    {
      id: "aboveCallerWireTensionLimit",
      label: "Above caller wire tension limit",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      wireSpanM: value.wireSpanM as number,
      declaredDistributedGravityLoadNPerM:
        value.declaredDistributedGravityLoadNPerM as number,
      measuredMidspanSagM: value.measuredMidspanSagM as number,
      callerWireTensionLimitN: value.callerWireTensionLimitN as number,
    }),
});
export const run = tool.execute;
export default tool;
