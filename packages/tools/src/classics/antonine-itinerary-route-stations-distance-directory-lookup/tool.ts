import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "The Antonine Itinerary lists routes/stations/distances in a compiled textual tradition.",
        reference: "Itinerarium Antonini; Roman route scholarship.",
        limitations:
          "Manuscripts and station identifications vary; not a current routing engine or guaranteed geodesic distances.",
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
      text: "The Antonine Itinerary lists routes/stations/distances in a compiled textual tradition.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/antonine-itinerary-route-stations-distance-directory-lookup",
  title: "Antonine Itinerary Route Stations Distance Directory Lookup",
  description:
    "Bounded offline reference: The Antonine Itinerary lists routes/stations/distances in a compiled textual tradition. Source: Itinerarium Antonini; Roman route scholarship. Manuscripts and station identifications vary; not a current routing engine or guaranteed geodesic distances. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
