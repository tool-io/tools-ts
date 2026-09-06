import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly denomination: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "denomination", label: "Denomination", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    diameterMillimeters: Number(
      pick(
        input.denomination,
        {
          "1cent": "16.25",
          "2cent": "18.75",
          "5cent": "21.25",
          "10cent": "19.75",
          "20cent": "22.25",
          "50cent": "24.25",
          "1euro": "23.25",
          "2euro": "25.75",
        },
        "denomination",
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { denomination: "2euro" },
  output: { result: { diameterMillimeters: 25.75 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/euro-denomination-diameter-lookup",
  title: "Euro Denomination Diameter Lookup",
  description:
    "Bounded nominal euro circulation coin diameter reference in millimeters for the eight denominations. ECB, technical specifications. Not measured tolerances, commemorative precious-metal issues or authenticity.",
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
