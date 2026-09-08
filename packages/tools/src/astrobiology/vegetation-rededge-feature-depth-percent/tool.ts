import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredShortSideReflectance: number;
  readonly independentlyMeasuredLongSideReflectance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredShortSideReflectance",
    label: "Independently measured short side reflectance",
    kind: "number",
  },
  {
    id: "independentlyMeasuredLongSideReflectance",
    label: "Independently measured long side reflectance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.independentlyMeasuredShortSideReflectance, "short");
  fraction(input.independentlyMeasuredLongSideReflectance, "long");
  positive(input.independentlyMeasuredLongSideReflectance, "long");
  return {
    observedLongRelativeEdgeContrastPercent:
      (100 *
        (input.independentlyMeasuredLongSideReflectance -
          input.independentlyMeasuredShortSideReflectance)) /
      input.independentlyMeasuredLongSideReflectance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredShortSideReflectance: 0.2,
    independentlyMeasuredLongSideReflectance: 0.4,
  },
  output: { result: { observedLongRelativeEdgeContrastPercent: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/vegetation-rededge-feature-depth-percent",
  title: "Vegetation Red Edge Spectral Feature Depth Percent Calculator",
  description:
    "Actual red-edge two-band reflectance contrast normalized by explicitly chosen long-side band. Signed inverted edge retained; not universal feature-depth convention, vegetation identity or detection of life.",
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
