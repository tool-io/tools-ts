import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

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
        redSky:
          "Red sky at night is conditional on local weather direction and atmospheric conditions, not a universal prediction.",
        animals:
          "Animal behavior has multiple causes and is not a calibrated stand-alone storm detector.",
        validation:
          "A prediction needs a predefined event, lead time, local cohort and independently verified paired observations.",
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
  input: { topic: "redSky" },
  output: {
    result: {
      text: "Red sky at night is conditional on local weather direction and atmospheric conditions, not a universal prediction.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/weather-lore-almanac-prediction-catalog-lookup",
  title: "Weather Lore Almanac Prediction Catalog Lookup",
  description:
    "Bounded offline reference: Weather proverbs combine environmental observation with locally transmitted inference. Source: Simpson and Roud, A Dictionary of English Folklore, weather lore. No deterministic forecast or universal accuracy rate. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
