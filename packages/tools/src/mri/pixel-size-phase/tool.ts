import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualEncodedFieldOfViewMm: number;
  readonly actualAcquiredEncodingMatrixCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualEncodedFieldOfViewMm",
    label: "Actual encoded field of view mm",
    kind: "number",
  },
  {
    id: "actualAcquiredEncodingMatrixCount",
    label: "Actual acquired encoding matrix count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualEncodedFieldOfViewMm, "actualEncodedFieldOfViewMm");
  bounded(
    input.actualAcquiredEncodingMatrixCount,
    "actualAcquiredEncodingMatrixCount",
    1,
    1000000,
  );
  return {
    value:
      input.actualEncodedFieldOfViewMm /
      input.actualAcquiredEncodingMatrixCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualEncodedFieldOfViewMm: 200,
    actualAcquiredEncodingMatrixCount: 100,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/pixel-size-phase",
  title: "Phase Pixel Size Calculator",
  description:
    "Actual phase acquiredpixelmm=encodedFOV/acquired matrix count, not interpolation reconstructed matrix or slice geometry.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
