import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly ability: number; readonly difficulty: number };
export type Output = { readonly logit: number; readonly probability: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ability: { type: "number" }, difficulty: { type: "number" } },
  required: ["ability", "difficulty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logit: { type: "number" }, probability: { type: "number" } },
  required: ["logit", "probability"],
} as const;
/** Dichotomous Rasch model with unit discrimination and no guessing or lapse asymptote. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ability, difficulty } = request;
  const compute = (): Output => {
    return {
      logit: ability - difficulty,
      probability:
        ability >= difficulty
          ? 1 / (1 + Math.exp(difficulty - ability))
          : Math.exp(ability - difficulty) /
            (1 + Math.exp(ability - difficulty)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ability: 1.5, difficulty: 0.5 },
  output: { logit: 1, probability: 0.7310585786300049 },
} satisfies ToolExample<Input, Output>;
export const itemResponseRaschLogitOnePointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/item-response-rasch-logit-one-point",
    title: "Item Response Rasch Logit One Point Tool",
    description:
      "Dichotomous Rasch model with unit discrimination and no guessing or lapse asymptote.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ability: { type: "number" },
        difficulty: { type: "number" },
      },
      required: ["ability", "difficulty"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logit: { type: "number" },
        probability: { type: "number" },
      },
      required: ["logit", "probability"],
    },
    ports: {
      inputs: [
        {
          id: "ability",
          label: "Ability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "difficulty",
          label: "Difficulty",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "logit", label: "Logit", valueType: { type: "number" } },
        {
          id: "probability",
          label: "Probability",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = itemResponseRaschLogitOnePointTool.execute;
export default itemResponseRaschLogitOnePointTool;
