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
          "Blue, Green, White and Red are conventional Roman chariot-racing faction colour names.",
        reference: "Pliny, Natural History; late antique circus accounts.",
        limitations:
          "Faction organisation and prominence vary; colour alone does not date an object.",
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
      text: "Blue, Green, White and Red are conventional Roman chariot-racing faction colour names.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/circus-maximus-chariot-factions-blues-greens-whites-reds",
  title: "Circus Maximus Chariot Factions Blues Greens Whites Reds",
  description:
    "Offline bounded reference card: Blue, Green, White and Red are conventional Roman chariot-racing faction colour names. References Pliny, Natural History; late antique circus accounts. Faction organisation and prominence vary; colour alone does not date an object.",
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
