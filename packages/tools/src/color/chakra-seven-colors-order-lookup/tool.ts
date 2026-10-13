import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly position: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "position", label: "Position", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    reference: pick(
      i.position,
      {
        "1": "root: red",
        "2": "sacral: orange",
        "3": "solar plexus: yellow",
        "4": "heart: green",
        "5": "throat: blue",
        "6": "third eye: indigo",
        "7": "crown: violet",
      },
      "position",
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { position: "1" },
  output: { result: { reference: "root: red" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/chakra-seven-colors-order-lookup",
  title: "Seven Chakras Color Order Lookup",
  description:
    "Common modern seven-chakra rainbow associations only; not a universal historical tradition or physiological claim.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "string" } },
        required: ["reference"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
