import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  countFraction,
} from "../batch53-shared.js";

export type Input = Readonly<{
  methylatedReads: number;
  unmethylatedReads: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "methylatedReads", label: "Methylated reads", kind: "number" },
  { id: "unmethylatedReads", label: "Unmethylated reads", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  const beta = countFraction(
    i.methylatedReads,
    i.methylatedReads + i.unmethylatedReads,
  );
  bounded(i.unmethylatedReads, "unmethylated", 0, 1e12);
  return { readCountBeta: beta };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { methylatedReads: 3, unmethylatedReads: 1 },
  output: { result: { readCountBeta: 0.75 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "epigenetics/beta-value-ct-ratio-calculator",
  title: "Methylation Beta Value C/(C+T) Ratio Calculator",
  description:
    "Compute bisulfite read-count beta C/(C+T); not an Illumina array beta with offsets or an m-value transform.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { readCountBeta: { type: "number" } },
        required: ["readCountBeta"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
