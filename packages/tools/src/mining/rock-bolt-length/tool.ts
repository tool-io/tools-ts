import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly loosenedZoneDepthNormalM: number;
  readonly boltAngleFromNormalDegrees: number;
  readonly anchorageBeyondZoneM: number;
  readonly exposedAllowanceM: number;
}>;
export type Output = Readonly<{
  readonly lengthThroughLoosenedZoneM: number;
  readonly totalBoltLengthM: number;
}>;
const inputFields = [
  {
    id: "loosenedZoneDepthNormalM",
    label: "Loosened zone depth normal m",
    kind: "number",
  },
  {
    id: "boltAngleFromNormalDegrees",
    label: "Bolt angle from normal degrees",
    kind: "number",
  },
  {
    id: "anchorageBeyondZoneM",
    label: "Anchorage beyond zone m",
    kind: "number",
  },
  { id: "exposedAllowanceM", label: "Exposed allowance m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.anchorageBeyondZoneM, "anchorageBeyondZoneM");
  nonnegative(input.loosenedZoneDepthNormalM, "loosenedZoneDepthNormalM");
  nonnegative(input.exposedAllowanceM, "exposedAllowanceM");
  if (
    input.boltAngleFromNormalDegrees < 0 ||
    input.boltAngleFromNormalDegrees >= 90
  )
    simpleError("boltAngleFromNormalDegrees", "Angle in [0,90) required.");
  const lengthThroughLoosenedZoneM =
    input.loosenedZoneDepthNormalM /
    Math.cos((input.boltAngleFromNormalDegrees * Math.PI) / 180);
  return {
    lengthThroughLoosenedZoneM,
    totalBoltLengthM:
      lengthThroughLoosenedZoneM +
      input.anchorageBeyondZoneM +
      input.exposedAllowanceM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  loosenedZoneDepthNormalM: 2,
  boltAngleFromNormalDegrees: 60,
  anchorageBeyondZoneM: 1,
  exposedAllowanceM: 0.2,
} satisfies Input;
export const exampleOutput = {
  lengthThroughLoosenedZoneM: 4,
  totalBoltLengthM: 5.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/rock-bolt-length",
  title: "Rock Bolt Length",
  description:
    "Convert normal loosened-zone depth to bolt path and add caller anchorage/exposed allowances; no anchorage strength or support certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "lengthThroughLoosenedZoneM",
      label: "Length through loosened zone m",
      kind: "number",
    },
    { id: "totalBoltLengthM", label: "Total bolt length m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      loosenedZoneDepthNormalM: value.loosenedZoneDepthNormalM as number,
      boltAngleFromNormalDegrees: value.boltAngleFromNormalDegrees as number,
      anchorageBeyondZoneM: value.anchorageBeyondZoneM as number,
      exposedAllowanceM: value.exposedAllowanceM as number,
    }),
});
export const run = tool.execute;
export default tool;
