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
      "corax",
      "nymphus",
      "miles",
      "leo",
      "perses",
      "heliodromus",
      "pater",
    ],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        corax: "Corax:raven, in the transmitted seven-grade list.",
        nymphus:
          "Nymphus:commonly rendered bridegroom in the transmitted seven-grade list; interpretation requires context.",
        miles: "Miles:soldier, in the transmitted seven-grade list.",
        leo: "Leo:lion, in the transmitted seven-grade list.",
        perses: "Perses:Persian, in the transmitted seven-grade list.",
        heliodromus:
          "Heliodromus:sun-runner, in the transmitted seven-grade list.",
        pater: "Pater:father, in the transmitted seven-grade list.",
        summary:
          "Mithraic tauroctony imagery depicts Mithras in a bull-slaying scene; seven initiation grades are attested in particular sources/contexts.",
        reference: "Roman Mithraic archaeology; Jerome, Letter 107.2.",
        limitations:
          "Interpretation and grade prevalence vary; no complete secret-rite reconstruction or universal cult membership test.",
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
      text: "Mithraic tauroctony imagery depicts Mithras in a bull-slaying scene; seven initiation grades are attested in particular sources/contexts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/mithraeum-tauroctony-iconography-seven-initiation-grades",
  title: "Mithraeum Tauroctony Iconography Seven Initiation Grades",
  description:
    "Bounded offline reference: Mithraic tauroctony imagery depicts Mithras in a bull-slaying scene; seven initiation grades are attested in particular sources/contexts. Source: Roman Mithraic archaeology; Jerome, Letter 107.2. Interpretation and grade prevalence vary; no complete secret-rite reconstruction or universal cult membership test. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
