import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: [
      "summary",
      "reference",
      "limitations",
      "shringara",
      "hasya",
      "karuna",
      "raudra",
      "vira",
      "bhayanaka",
      "bibhatsa",
      "adbhuta",
      "shanta",
    ],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        shringara:
          "Śṛṅgāra:commonly glossed as the erotic or love-related rasa.",
        hasya: "Hāsya:commonly glossed as the comic or laughter-related rasa.",
        karuna:
          "Karuṇa:commonly glossed as the pathetic or compassion/sorrow-related rasa.",
        raudra: "Raudra:commonly glossed as the furious or anger-related rasa.",
        vira: "Vīra:commonly glossed as the heroic or valor-related rasa.",
        bhayanaka:
          "Bhayānaka:commonly glossed as the terrible or fear-related rasa.",
        bibhatsa:
          "Bībhatsa:commonly glossed as the odious or disgust-related rasa.",
        adbhuta:
          "Adbhuta:commonly glossed as the marvelous or wonder-related rasa.",
        shanta:
          "Śānta:commonly glossed as the tranquil rasa, whose place depends on text/commentary tradition.",
        summary:
          "The familiar nine-rasa scheme adds \u015b\u0101nta to the eight extensively described in the N\u0101\u1e6dya\u015b\u0101stra tradition.",
        reference:
          "N\u0101\u1e6dya\u015b\u0101stra, chapter6; Abhinavagupta commentary tradition.",
        limitations:
          "Counting and translations depend on text/commentary; no universal emotional taxonomy.",
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
      text: "The familiar nine-rasa scheme adds \u015b\u0101nta to the eight extensively described in the N\u0101\u1e6dya\u015b\u0101stra tradition.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/nine-rasas-natya-shastra-catalog-lookup",
  title: "Nine Rasas Natya Shastra Catalog Lookup",
  description:
    "Bounded offline reference: The familiar nine-rasa scheme adds \u015b\u0101nta to the eight extensively described in the N\u0101\u1e6dya\u015b\u0101stra tradition. Source: N\u0101\u1e6dya\u015b\u0101stra, chapter6; Abhinavagupta commentary tradition. Counting and translations depend on text/commentary; no universal emotional taxonomy. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
