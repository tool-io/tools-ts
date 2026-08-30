import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch-shared.js";
export type Input = Readonly<{
  readonly catenaryScale: number;
  readonly startX: number;
  readonly endX: number;
}>;
export type Output = Readonly<{ readonly catenarySegmentLength: number }>;
const inputFields = [
  { id: "catenaryScale", label: "Catenary scale", kind: "number" },
  { id: "startX", label: "Start x", kind: "number" },
  { id: "endX", label: "End x", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.catenaryScale, "catenaryScale");
  if (
    input.endX < input.startX ||
    Math.max(
      Math.abs(input.startX / input.catenaryScale),
      Math.abs(input.endX / input.catenaryScale),
    ) > 100
  )
    simpleError("bounds", "Ordered x bounds with |x/a|≤100 required.");
  return {
    catenarySegmentLength:
      2 *
      input.catenaryScale *
      Math.cosh((input.endX / 2 + input.startX / 2) / input.catenaryScale) *
      Math.sinh((input.endX - input.startX) / (2 * input.catenaryScale)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  catenaryScale: 2,
  startX: -2,
  endX: 2,
} satisfies Input;
export const exampleOutput = {
  catenarySegmentLength: 4.7008047745752055,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/catenary-length",
  title: "Catenary Length Calculator",
  description:
    "Exact catenary y=a cosh(x/a) arc length between supplied horizontal coordinates; not sailing chain sag under force or its parabolic approximation.",
  inputs: inputFields,
  outputs: [
    {
      id: "catenarySegmentLength",
      label: "Catenary segment length",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      catenaryScale: value.catenaryScale as number,
      startX: value.startX as number,
      endX: value.endX as number,
    }),
});
export const run = tool.execute;
export default tool;
