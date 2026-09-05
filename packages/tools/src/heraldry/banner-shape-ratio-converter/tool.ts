import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly shieldEnvelopeWidth: number;
  readonly shieldEnvelopeHeight: number;
  readonly bannerHeight: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "shieldEnvelopeWidth", label: "Shield envelope width", kind: "number" },
  {
    id: "shieldEnvelopeHeight",
    label: "Shield envelope height",
    kind: "number",
  },
  { id: "bannerHeight", label: "Banner height", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.shieldEnvelopeWidth, "shieldEnvelopeWidth");
  positive(input.shieldEnvelopeHeight, "shieldEnvelopeHeight");
  positive(input.bannerHeight, "bannerHeight");
  return {
    envelopeAspect: input.shieldEnvelopeWidth / input.shieldEnvelopeHeight,
    bannerWidth:
      (input.bannerHeight * input.shieldEnvelopeWidth) /
      input.shieldEnvelopeHeight,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    shieldEnvelopeWidth: 100,
    shieldEnvelopeHeight: 120,
    bannerHeight: 60,
  },
  output: { result: { envelopeAspect: 0.8333333333333334, bannerWidth: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/banner-shape-ratio-converter",
  title: "Banner Shape Ratio to Shield Converter",
  description:
    "Transfer explicitly chosen shield-envelope aspect to a banner, not historic/legal banner proportion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
