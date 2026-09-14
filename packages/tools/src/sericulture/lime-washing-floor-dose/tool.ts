import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly floorAreaM2: number;
  readonly callerAuthorizedGramsPerM2: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "floorAreaM2", label: "Floor area m2", kind: "number" },
  {
    id: "callerAuthorizedGramsPerM2",
    label: "Caller authorized grams per m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.floorAreaM2, "area");
  nonnegative(i.callerAuthorizedGramsPerM2, "rate");
  return { conditionalLimeGrams: i.floorAreaM2 * i.callerAuthorizedGramsPerM2 };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { floorAreaM2: 20, callerAuthorizedGramsPerM2: 30 },
  output: { result: { conditionalLimeGrams: 600 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/lime-washing-floor-dose",
  title: "Lime Washing Floor Dose Calculator",
  description:
    "Lime inventory from independently authorized application rate; not disinfection efficacy or worker-safe handling.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
