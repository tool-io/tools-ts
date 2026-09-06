import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly spotCount: number;
  readonly inspectedAreaCm2: number;
}>;
export type Output = Readonly<{ readonly spotsPerCm2: number }>;
const inputFields = [
  { id: "spotCount", label: "Spot count", kind: "number" },
  { id: "inspectedAreaCm2", label: "Inspected area cm2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.inspectedAreaCm2, "inspectedAreaCm2");
  nonnegative(input.spotCount, "spotCount");
  integer(input.spotCount, "spots");
  return { spotsPerCm2: input.spotCount / input.inspectedAreaCm2 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  spotCount: 6,
  inspectedAreaCm2: 2,
} satisfies Input;
export const exampleOutput = { spotsPerCm2: 3 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/foxing-spot-density-grader",
  title: "Foxing Spot Count Density Grader",
  description:
    "Report actual foxing spot density on an explicit inspected area, not a universal quality grade. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [{ id: "spotsPerCm2", label: "Spots per cm2", kind: "number" }],
  calculate: (value) =>
    calculate({
      spotCount: value.spotCount as number,
      inspectedAreaCm2: value.inspectedAreaCm2 as number,
    }),
});
export const run = tool.execute;
export default tool;
