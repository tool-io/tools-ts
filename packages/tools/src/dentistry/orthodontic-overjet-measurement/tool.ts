import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredUpperIncisorCoordinateMm: number;
  readonly independentlyMeasuredLowerIncisorCoordinateMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredUpperIncisorCoordinateMm",
    label: "Independently measured upper incisor coordinate mm",
    kind: "number",
  },
  {
    id: "independentlyMeasuredLowerIncisorCoordinateMm",
    label: "Independently measured lower incisor coordinate mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    Math.abs(input.independentlyMeasuredUpperIncisorCoordinateMm) > 1000 ||
    Math.abs(input.independentlyMeasuredLowerIncisorCoordinateMm) > 1000
  )
    simpleError(
      "coordinates",
      "Bounded independently aligned same-unit incisal coordinates.",
    );
  return {
    signedObservedOverjetMm:
      input.independentlyMeasuredUpperIncisorCoordinateMm -
      input.independentlyMeasuredLowerIncisorCoordinateMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredUpperIncisorCoordinateMm: 5,
    independentlyMeasuredLowerIncisorCoordinateMm: 2,
  },
  output: { result: { signedObservedOverjetMm: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/orthodontic-overjet-measurement",
  title: "Overjet Measurement Tool",
  description:
    "Actual upper-minus-lower incisal horizontal coordinate in independently aligned anterior-positive plane. Reverse overjet negative; not diagnose malocclusion, select treatment or infer three-dimensional position.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
