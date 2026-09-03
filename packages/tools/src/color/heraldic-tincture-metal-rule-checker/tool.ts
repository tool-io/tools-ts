import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly fieldTinctureClass: string;
  readonly chargeTinctureClass: string;
  readonly callerVerifiedException: boolean;
}>;
export type Output = Readonly<{ readonly ordinaryContrastRuleReview: boolean }>;
const inputFields = [
  { id: "fieldTinctureClass", label: "Field tincture class", kind: "string" },
  { id: "chargeTinctureClass", label: "Charge tincture class", kind: "string" },
  {
    id: "callerVerifiedException",
    label: "Caller verified exception",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  pick(input.fieldTinctureClass, { metal: 0, colour: 1, fur: 2 }, "field");
  pick(input.chargeTinctureClass, { metal: 0, colour: 1, fur: 2 }, "charge");
  return {
    ordinaryContrastRuleReview:
      !input.callerVerifiedException &&
      input.fieldTinctureClass === input.chargeTinctureClass &&
      input.fieldTinctureClass !== "fur",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fieldTinctureClass: "metal",
  chargeTinctureClass: "metal",
  callerVerifiedException: false,
} satisfies Input;
export const exampleOutput = {
  ordinaryContrastRuleReview: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/heraldic-tincture-metal-rule-checker",
  title: "Heraldic Tincture Metal Rule Check",
  description:
    "Basic conventional heraldic tincture same-metal/same-colour screen with independently verified exceptions and fur distinct; not heraldic validity or visual contrast. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "ordinaryContrastRuleReview",
      label: "Ordinary contrast rule review",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      fieldTinctureClass: value.fieldTinctureClass as string,
      chargeTinctureClass: value.chargeTinctureClass as string,
      callerVerifiedException: value.callerVerifiedException as boolean,
    }),
});
export const run = tool.execute;
export default tool;
