import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch47-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["0", "1", "1+", "2", "3", "4"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        "0": "No increase in muscle tone.",
        "1": "Slight increase with catch/release or minimal resistance at end of range.",
        "1+": "Catch followed by minimal resistance through less than half the remaining range.",
        "2": "More marked increase through most range, but part easily moved.",
        "3": "Considerable increase; passive movement difficult.",
        "4": "Part rigid in flexion or extension.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "0" },
  output: { result: { text: "No increase in muscle tone." } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/ashworth-spasticity-scale",
  title: "Ashworth Spasticity Scale Calculator",
  description:
    "Bounded offline reference: ModifiedAshworthgrading includes a distinct1+category and is an ordinal description of resistance during an independently assessed passive movement. Source: ModifiedAshworthScalestandard descriptions. Resistance is not uniquely neural spasticity; no automatic examination, arithmetic averaging or diagnosis. Explicit topic keys: 0, 1, 1+, 2, 3, 4. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
