import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualSignedImageDistance: number;
  readonly actualSignedObjectDistance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSignedImageDistance",
    label: "Actual signed image distance",
    kind: "number",
  },
  {
    id: "actualSignedObjectDistance",
    label: "Actual signed object distance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.actualSignedObjectDistance === 0)
    simpleError("object", "Nonzero signed object distance.");
  return {
    value: -input.actualSignedImageDistance / input.actualSignedObjectDistance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualSignedImageDistance: 1, actualSignedObjectDistance: 2 },
  output: { result: { value: -0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/optical-magnification",
  title: "Optical Magnification Calculator",
  description:
    "Thin lens transverse signed magnification\u2212image/object distance. Not field of view or area magnification. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
