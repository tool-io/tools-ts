import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualRenderPixelsPerDegree: number;
  readonly callerHorizontalShadingBlockWidthPixels: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRenderPixelsPerDegree",
    label: "Actual render pixels per degree",
    kind: "number",
  },
  {
    id: "callerHorizontalShadingBlockWidthPixels",
    label: "Caller horizontal shading block width pixels",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualRenderPixelsPerDegree, "actualRenderPixelsPerDegree");
  bounded(
    input.callerHorizontalShadingBlockWidthPixels,
    "callerHorizontalShadingBlockWidthPixels",
    1,
    1000000,
  );
  return {
    value:
      input.actualRenderPixelsPerDegree /
      input.callerHorizontalShadingBlockWidthPixels,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRenderPixelsPerDegree: 100,
    callerHorizontalShadingBlockWidthPixels: 2,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/shading-rate-pixels-per-degree",
  title: "Shading Rate Pixels Per Degree Calculator",
  description:
    "Actual effective horizontal shading-samples/degree=renderPPD/integer block width, not physicaldisplayPPDor foveated region area.",
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
