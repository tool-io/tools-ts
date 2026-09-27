import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  valueText: string;
  unitText: string;
  spacing: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "valueText", label: "Value text", kind: "string" },
  { id: "unitText", label: "Unit text", kind: "string" },
  {
    id: "spacing",
    label: "Spacing",
    kind: "string",
    enum: ["thin", "narrow-nobreak", "space", "none"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.spacing, ["thin", "narrow-nobreak", "space", "none"]);
  H.check(
    i.valueText.length > 0 &&
      i.unitText.length > 0 &&
      !/[\r\n]/.test(i.valueText + i.unitText),
  );
  return H.finish({
    label:
      i.valueText +
      (
        {
          thin: "\u2009",
          "narrow-nobreak": "\u202f",
          space: " ",
          none: "",
        } as Record<string, string>
      )[i.spacing] +
      i.unitText,
  });
};
export const example = {
  input: { valueText: "12", unitText: "m", spacing: "thin" },
  output: { result: { label: "12\u2009m" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "format/thin-space-unit-join-policy",
  title: "Formatting: Thin Space Unit Join Policy Tool",
  description:
    "Join nonempty one-line value and unit text under an explicit thin/narrow-no-break/space/none spacing policy; no unit conversion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string" } },
        required: ["label"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
