import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedSecchiDepthM: number;
  readonly callerEuphoticSecchiMultiplier: number;
  readonly lakeBottomDepthM: number;
}>;
export type Output = Readonly<{
  readonly unclippedSecchiEstimatedEuphoticDepthM: number;
  readonly estimatedEuphoticZoneReachesBottom: boolean;
}>;
const inputFields = [
  {
    id: "observedSecchiDepthM",
    label: "Observed secchi depth m",
    kind: "number",
  },
  {
    id: "callerEuphoticSecchiMultiplier",
    label: "Caller euphotic secchi multiplier",
    kind: "number",
  },
  { id: "lakeBottomDepthM", label: "Lake bottom depth m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedSecchiDepthM, "observedSecchiDepthM");
  positive(
    input.callerEuphoticSecchiMultiplier,
    "callerEuphoticSecchiMultiplier",
  );
  positive(input.lakeBottomDepthM, "lakeBottomDepthM");
  const z = input.observedSecchiDepthM * input.callerEuphoticSecchiMultiplier;
  return {
    unclippedSecchiEstimatedEuphoticDepthM: z,
    estimatedEuphoticZoneReachesBottom: z >= input.lakeBottomDepthM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSecchiDepthM: 2,
  callerEuphoticSecchiMultiplier: 2.5,
  lakeBottomDepthM: 4,
} satisfies Input;
export const exampleOutput = {
  unclippedSecchiEstimatedEuphoticDepthM: 5,
  estimatedEuphoticZoneReachesBottom: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/euphotic-zone-depth-from-secchi",
  title: "Euphotic Zone Depth From Secchi Calculator",
  description:
    "Estimate euphotic depth from actual Secchi and explicit locally calibrated multiplier, retaining beyond-bottom model value; not Beer–Lambert threshold inversion or a universal biological light depth.",
  inputs: inputFields,
  outputs: [
    {
      id: "unclippedSecchiEstimatedEuphoticDepthM",
      label: "Unclipped secchi estimated euphotic depth m",
      kind: "number",
    },
    {
      id: "estimatedEuphoticZoneReachesBottom",
      label: "Estimated euphotic zone reaches bottom",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSecchiDepthM: value.observedSecchiDepthM as number,
      callerEuphoticSecchiMultiplier:
        value.callerEuphoticSecchiMultiplier as number,
      lakeBottomDepthM: value.lakeBottomDepthM as number,
    }),
});
export const run = tool.execute;
export default tool;
