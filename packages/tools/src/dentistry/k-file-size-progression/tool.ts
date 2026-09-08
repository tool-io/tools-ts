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
    enum: ["06", "08", "10", "15", "20", "25", "30", "35", "40"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        "06": "Nominal0.06mm tip; verify actual instrument specification.",
        "08": "Nominal0.08mm tip.",
        "10": "Nominal0.10mm tip.",
        "15": "Nominal0.15mm tip.",
        "20": "Nominal0.20mm tip.",
        "25": "Nominal0.25mm tip.",
        "30": "Nominal0.30mm tip.",
        "35": "Nominal0.35mm tip.",
        "40": "Nominal0.40mm tip.",
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
  input: { topic: "06" },
  output: {
    result: {
      text: "Nominal0.06mm tip; verify actual instrument specification.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/k-file-size-progression",
  title: "K-File Size Progression Lookup",
  description:
    "Bounded offline reference: ISO-style nominal hand-file tip sizes are hundredths of a millimeter; size is not an automatically recommended progression. Source: Endodontic instrument nominal ISO size convention. Actual instrument manufacturer, standard edition, taper and clinical selection must be verified. Explicit topic keys: 06, 08, 10, 15, 20, 25, 30, 35, 40. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
