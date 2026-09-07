import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyAnnotatedToneDirection: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedToneDirection",
    label: "Independently annotated tone direction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    callerToneLabel: pick(
      String(input.independentlyAnnotatedToneDirection),
      {
        "-1": "euphemistic-direction",
        "0": "unchanged-direction",
        "1": "dysphemistic-direction",
      },
      "tone",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyAnnotatedToneDirection: -1 },
  output: { result: { callerToneLabel: "euphemistic-direction" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/euphemism-dysphemism-tone-direction-selector",
  title: "Euphemism Dysphemism Tone Direction Selector",
  description:
    "Map independently assessed tone direction under one explicitly stated caller axis, not automatic sentiment or intent.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
