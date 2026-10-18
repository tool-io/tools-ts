import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, positive } from "../batch53-shared.js";

export type Input = Readonly<{ parasitesCounted: number; wbcCounted: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "parasitesCounted", label: "Parasites counted", kind: "number" },
  { id: "wbcCounted", label: "Wbc counted", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  bounded(i.parasitesCounted, "parasites", 0, 1e9);
  positive(i.wbcCounted, "wbc");
  return {
    standardizedParasitesPer200Wbc: (200 * i.parasitesCounted) / i.wbcCounted,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { parasitesCounted: 10, wbcCounted: 100 },
  output: { result: { standardizedParasitesPer200Wbc: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/malaria-thickfilm-per200wbc-standardizer",
  title: "Malaria Thick Film Parasite Count per 200 WBC Field Standardizer",
  description:
    "Standardize observed thick-film counts to 200 counted WBC; does not assume a blood WBC concentration.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { standardizedParasitesPer200Wbc: { type: "number" } },
        required: ["standardizedParasitesPer200Wbc"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
