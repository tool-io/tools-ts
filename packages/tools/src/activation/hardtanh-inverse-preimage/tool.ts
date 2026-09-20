import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ y: number; lower: number; upper: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "y", label: "Y", kind: "number" },
  { id: "lower", label: "Lower", kind: "number" },
  { id: "upper", label: "Upper", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.lower < i.upper);
  return H.finish({
    hasPreimage: i.y >= i.lower && i.y <= i.upper,
    kind:
      i.y < i.lower || i.y > i.upper
        ? "empty"
        : i.y === i.lower
          ? "lower-ray"
          : i.y === i.upper
            ? "upper-ray"
            : "singleton",
    boundary: i.y,
  });
};
export const example = {
  input: { y: -1, lower: -1, upper: 1 },
  output: { result: { hasPreimage: true, kind: "lower-ray", boundary: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/hardtanh-inverse-preimage",
  title: "Activation: HardTanh Inverse Preimage Tool",
  description:
    "Describe the preimage of hardtanh/clamp: lower/upper rays include their endpoint, interior is singleton and outside is empty; infinite rays are represented symbolically.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          boundary: { type: "number" },
          hasPreimage: { type: "boolean" },
          kind: { type: "string" },
        },
        required: ["boundary", "hasPreimage", "kind"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
