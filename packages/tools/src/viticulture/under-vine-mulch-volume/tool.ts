import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly rows: number;
  readonly rowLengthM: number;
  readonly stripWidthM: number;
  readonly settledDepthM: number;
  readonly looseToSettledFactor: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "rows", label: "Rows", kind: "number" },
  { id: "rowLengthM", label: "Row length m", kind: "number" },
  { id: "stripWidthM", label: "Strip width m", kind: "number" },
  { id: "settledDepthM", label: "Settled depth m", kind: "number" },
  {
    id: "looseToSettledFactor",
    label: "Loose to settled factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  bounded(i.rows, "rows", 0, 1000000);
  [i.rowLengthM, i.stripWidthM, i.settledDepthM].forEach((v) =>
    nonnegative(v, "dimension"),
  );
  positive(i.looseToSettledFactor, "factor");
  return {
    looseVolumeM3:
      i.rows *
      i.rowLengthM *
      i.stripWidthM *
      i.settledDepthM *
      i.looseToSettledFactor,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    rows: 10,
    rowLengthM: 100,
    stripWidthM: 0.5,
    settledDepthM: 0.1,
    looseToSettledFactor: 1.2,
  },
  output: { result: { looseVolumeM3: 60 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/under-vine-mulch-volume",
  title: "Under Vine Mulch Volume Calculator",
  description:
    "Under-vine strip mulch procurement volume with caller measured loose-to-settled factor.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { looseVolumeM3: { type: "number" } },
        required: ["looseVolumeM3"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
