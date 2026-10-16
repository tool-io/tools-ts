import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly lengthM: number;
  readonly widthM: number;
  readonly sideDropM: number;
  readonly overlapM: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "lengthM", label: "Length m", kind: "number" },
  { id: "widthM", label: "Width m", kind: "number" },
  { id: "sideDropM", label: "Side drop m", kind: "number" },
  { id: "overlapM", label: "Overlap m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  [i.lengthM, i.widthM].forEach((v) => positive(v, "dimension"));
  [i.sideDropM, i.overlapM].forEach((v) => nonnegative(v, "allowance"));
  return {
    blankAreaM2:
      (i.lengthM + 2 * i.sideDropM + 2 * i.overlapM) *
      (i.widthM + 2 * i.sideDropM + 2 * i.overlapM),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { lengthM: 10, widthM: 2, sideDropM: 1, overlapM: 0.5 },
  output: { result: { blankAreaM2: 65 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/blackout-cloth-install-area",
  title: "Blackout Cloth Install Area Calculator",
  description:
    "Rectangular blackout cloth blank with measured side drops and edge overlaps; excludes seams and support design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { blankAreaM2: { type: "number" } },
        required: ["blankAreaM2"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
