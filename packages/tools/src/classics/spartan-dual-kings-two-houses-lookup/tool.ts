import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch43-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Spartan dual kingship was associated with the Agiad and Eurypontid dynastic houses.",
        reference: "Herodotus 6.51\u201360.",
        limitations:
          "Succession, powers and disputed rulers require chronology-specific sources.",
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
  input: { topic: "summary" },
  output: {
    result: {
      text: "Spartan dual kingship was associated with the Agiad and Eurypontid dynastic houses.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/spartan-dual-kings-two-houses-lookup",
  title: "Spartan Dual Kings Two Houses Lookup",
  description:
    "Offline bounded reference card: Spartan dual kingship was associated with the Agiad and Eurypontid dynastic houses. References Herodotus 6.51\u201360. Succession, powers and disputed rulers require chronology-specific sources.",
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
