import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualVergenceDistanceMeters: number;
  readonly actualAccommodationDistanceMeters: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualVergenceDistanceMeters",
    label: "Actual vergence distance meters",
    kind: "number",
  },
  {
    id: "actualAccommodationDistanceMeters",
    label: "Actual accommodation distance meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.actualVergenceDistanceMeters, "actualVergenceDistanceMeters");
  positive(
    input.actualAccommodationDistanceMeters,
    "actualAccommodationDistanceMeters",
  );
  return {
    value:
      1 / input.actualVergenceDistanceMeters -
      1 / input.actualAccommodationDistanceMeters,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualVergenceDistanceMeters: 1,
    actualAccommodationDistanceMeters: 2,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/vergence-accommodation-conflict",
  title: "Vergence Accommodation Conflict Calculator",
  description:
    "Signed vergence-minus-accommodation diopter conflict1/Dv\u22121/Da, actual established both distances; not infer eye strain or safe exposure.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
