import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly photicDepthM: number;
  readonly lakeMaximumDepthM: number;
}>;
export type Output = Readonly<{
  readonly unclippedPhoticToMaximumDepthPercent: number;
  readonly physicallyCappedLitDepthPercent: number;
}>;
const inputFields = [
  { id: "photicDepthM", label: "Photic depth m", kind: "number" },
  { id: "lakeMaximumDepthM", label: "Lake maximum depth m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.lakeMaximumDepthM, "lakeMaximumDepthM");
  nonnegative(input.photicDepthM, "photicDepthM");
  const share = 100 * (input.photicDepthM / input.lakeMaximumDepthM);
  return {
    unclippedPhoticToMaximumDepthPercent: share,
    physicallyCappedLitDepthPercent: Math.min(100, share),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  photicDepthM: 20,
  lakeMaximumDepthM: 10,
} satisfies Input;
export const exampleOutput = {
  unclippedPhoticToMaximumDepthPercent: 200,
  physicallyCappedLitDepthPercent: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/photic-zone-percent-depth",
  title: "Photic Zone Percent Depth Calculator",
  description:
    "Distinguish modeled photic-depth/maximum-depth ratio from physically capped depth fraction; not illuminated lake volume/area or an ecological euphotic-zone judgement.",
  inputs: inputFields,
  outputs: [
    {
      id: "unclippedPhoticToMaximumDepthPercent",
      label: "Unclipped photic to maximum depth percent",
      kind: "number",
    },
    {
      id: "physicallyCappedLitDepthPercent",
      label: "Physically capped lit depth percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      photicDepthM: value.photicDepthM as number,
      lakeMaximumDepthM: value.lakeMaximumDepthM as number,
    }),
});
export const run = tool.execute;
export default tool;
