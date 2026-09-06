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
    enum: [
      "Poor",
      "Good",
      "Fine",
      "VeryFine",
      "ExtremelyFine",
      "AboutUncirculated",
      "MintState",
    ],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        Poor: "Barely identifiable design with very extensive wear.",
        Good: "Heavily worn major devices generally discernible; issue-specific detail varies.",
        Fine: "Moderate-to-considerable wear with principal design details remaining.",
        VeryFine: "Moderate wear with appreciable design detail.",
        ExtremelyFine: "Light wear on high points with much detail remaining.",
        AboutUncirculated:
          "Very slight wear on limited high points; not an unworn Mint State piece.",
        MintState:
          "No circulation wear; strike, luster, marks and eye appeal still affect the numeric grade.",
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
  input: { topic: "Poor" },
  output: {
    result: { text: "Barely identifiable design with very extensive wear." },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/grade-description-lookup",
  title: "Grade Description Lookup",
  description:
    "Bounded offline reference: Bounded adjectival grade descriptions concern observable wear, not a universal service grading guarantee. Source: ANA grading guide; grading-service educational guides. Issue, manufacture, damage, strike and service edition matter; no grade inferred from text or photographs. Supported topic keys: Poor, Good, Fine, VeryFine, ExtremelyFine, AboutUncirculated, MintState. No complete external corpus or live policy implied.",
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
