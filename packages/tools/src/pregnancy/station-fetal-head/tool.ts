import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyReportedSignedStationCm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyReportedSignedStationCm",
    label: "Independently reported signed station cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.independentlyReportedSignedStationCm < -5 ||
    input.independentlyReportedSignedStationCm > 5
  )
    simpleError("station", "Declared bounded−5to5cmstation convention.");
  return {
    recordedSignedStationCm: input.independentlyReportedSignedStationCm,
    referencePlaneRelationship:
      input.independentlyReportedSignedStationCm < 0
        ? "above-stated-ischial-spine-plane"
        : input.independentlyReportedSignedStationCm > 0
          ? "below-stated-ischial-spine-plane"
          : "at-stated-ischial-spine-plane",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyReportedSignedStationCm: -2 },
  output: {
    result: {
      recordedSignedStationCm: -2,
      referencePlaneRelationship: "above-stated-ischial-spine-plane",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/station-fetal-head",
  title: "Fetal Head Station Calculator",
  description:
    "Format an independently clinically reported signed fetal-head station relative to the stated ischial-spine plane, negative above/positive below. Not identify anatomy or infer delivery readiness from displacement.",
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
