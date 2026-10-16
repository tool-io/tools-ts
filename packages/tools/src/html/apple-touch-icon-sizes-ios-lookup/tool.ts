import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly profile: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "profile", label: "Profile", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    reference: pick(
      i.profile,
      {
        "common-modern-hint": [180, 180],
        "historical-iphone-retina-hint": [120, 120],
        "historical-ipad-retina-hint": [152, 152],
      },
      "profile",
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { profile: "common-modern-hint" },
  output: { result: { reference: [180, 180] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/apple-touch-icon-sizes-ios-lookup",
  title: "apple-touch-icon iOS Sizes Lookup",
  description:
    "Bounded common square pixel icon hints; actual device/browser recommendations vary and no complete current iOS table asserted.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "array", items: { type: "number" } } },
        required: ["reference"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
