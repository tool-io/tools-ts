import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  rotationGroupSize: number;
  stabilizerSize: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rotationGroupSize", label: "Rotation group size", kind: "integer" },
  { id: "stabilizerSize", label: "Stabilizer size", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.rotationGroupSize, 1, 1000000);
  H.int(i.stabilizerSize, 1, i.rotationGroupSize);
  H.check(i.rotationGroupSize % i.stabilizerSize === 0);
  return H.finish({ orbitSize: i.rotationGroupSize / i.stabilizerSize });
};
export const example = {
  input: { rotationGroupSize: 12, stabilizerSize: 3 },
  output: { result: { orbitSize: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/necklace-rotation-stabilizer-quotient",
  title: "Combinatorics: Necklace Rotation Stabilizer Quotient Tool",
  description:
    "Apply orbit-stabilizer to a caller-established rotation action with an exactly dividing stabilizer size; does not enumerate necklaces.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { orbitSize: { type: "number" } },
        required: ["orbitSize"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
