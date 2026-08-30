import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly positionsM: readonly number[];
  readonly maximumSubsidenceM: number;
  readonly troughScaleM: number;
  readonly horizontalDisplacementCoefficientM: number;
}>;
export type Output = Readonly<{
  readonly horizontalStrains: readonly number[];
}>;
const inputFields = [
  { id: "positionsM", label: "Positions m", kind: "numberList" },
  { id: "maximumSubsidenceM", label: "Maximum subsidence m", kind: "number" },
  { id: "troughScaleM", label: "Trough scale m", kind: "number" },
  {
    id: "horizontalDisplacementCoefficientM",
    label: "Horizontal displacement coefficient m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.troughScaleM, "troughScaleM");
  nonnegative(input.maximumSubsidenceM, "maximumSubsidenceM");
  nonnegative(
    input.horizontalDisplacementCoefficientM,
    "horizontalDisplacementCoefficientM",
  );
  if (!input.positionsM.length)
    simpleError("positionsM", "Nonempty positions required.");
  return {
    horizontalStrains: input.positionsM.map((x) => {
      const z = x / input.troughScaleM;
      return (
        (input.horizontalDisplacementCoefficientM *
          input.maximumSubsidenceM *
          Math.exp((-z * z) / 2) *
          (z * z - 1)) /
        input.troughScaleM ** 2
      );
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  positionsM: [-10, 0, 10],
  maximumSubsidenceM: 1,
  troughScaleM: 10,
  horizontalDisplacementCoefficientM: 2,
} satisfies Input;
export const exampleOutput = {
  horizontalStrains: [0, -0.02, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/subsidence-strain",
  title: "Subsidence Strain",
  description:
    "Differentiate u(x)=c·s′(x) for caller downward-positive Gaussian subsidence; positive tensile/negative compressive strain depends on supplied c.",
  inputs: inputFields,
  outputs: [
    {
      id: "horizontalStrains",
      label: "Horizontal strains",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      positionsM: value.positionsM as readonly number[],
      maximumSubsidenceM: value.maximumSubsidenceM as number,
      troughScaleM: value.troughScaleM as number,
      horizontalDisplacementCoefficientM:
        value.horizontalDisplacementCoefficientM as number,
    }),
});
export const run = tool.execute;
export default tool;
