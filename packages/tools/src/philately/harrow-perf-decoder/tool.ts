import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch42-shared.js";
export type Input = Readonly<{ readonly notation: string }>;
export type Output = Readonly<{
  readonly horizontalGauge: number;
  readonly verticalGauge: number;
}>;
const inputFields = [
  { id: "notation", label: "Notation", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const m = /^([0-9]+(?:\.[0-9]+)?)x([0-9]+(?:\.[0-9]+)?)$/.exec(
    input.notation,
  );
  if (!m)
    return simpleError(
      "notation",
      "Strict positive horizontalxvertical gauge notation, no implicit harrow identification.",
    );
  const h = positive(Number(m[1]), "horizontal"),
    v = positive(Number(m[2]), "vertical");
  return { horizontalGauge: h, verticalGauge: v };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { notation: "11x12.5" } satisfies Input;
export const exampleOutput = {
  horizontalGauge: 11,
  verticalGauge: 12.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/harrow-perf-decoder",
  title: "Harrow Perf Notation Decoder",
  description:
    "Decode a supplied harrow horizontalxvertical gauge notation without identifying perforator manufacture. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "horizontalGauge", label: "Horizontal gauge", kind: "number" },
    { id: "verticalGauge", label: "Vertical gauge", kind: "number" },
  ],
  calculate: (value) => calculate({ notation: value.notation as string }),
});
export const run = tool.execute;
export default tool;
