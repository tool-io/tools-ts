import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly postBayLengthsM: readonly number[];
  readonly declaredUniformTransverseLoadNPerM: number;
  readonly declaredAllowablePostReactionN: number;
}>;
export type Output = Readonly<{
  readonly interiorPostModelReactionsN: readonly number[];
  readonly aboveCallerReactionLimitFlags: readonly number[];
}>;
const inputFields = [
  { id: "postBayLengthsM", label: "Post bay lengths m", kind: "numberList" },
  {
    id: "declaredUniformTransverseLoadNPerM",
    label: "Declared uniform transverse load n per m",
    kind: "number",
  },
  {
    id: "declaredAllowablePostReactionN",
    label: "Declared allowable post reaction n",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.postBayLengthsM.forEach((v) => positive(v, "postBayLengthsM"));
  positive(
    input.declaredAllowablePostReactionN,
    "declaredAllowablePostReactionN",
  );
  nonnegative(
    input.declaredUniformTransverseLoadNPerM,
    "declaredUniformTransverseLoadNPerM",
  );
  if (input.postBayLengthsM.length < 2)
    simpleError(
      "bays",
      "Two or more adjacent bays required for interior-post tributary reaction.",
    );
  const interiorPostModelReactionsN = input.postBayLengthsM
    .slice(1)
    .map(
      (l, i) =>
        (input.declaredUniformTransverseLoadNPerM *
          (l + input.postBayLengthsM[i])) /
        2,
    );
  return {
    interiorPostModelReactionsN,
    aboveCallerReactionLimitFlags: interiorPostModelReactionsN.map((v) =>
      v > input.declaredAllowablePostReactionN ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  postBayLengthsM: [2, 3],
  declaredUniformTransverseLoadNPerM: 10,
  declaredAllowablePostReactionN: 20,
} satisfies Input;
export const exampleOutput = {
  interiorPostModelReactionsN: [25],
  aboveCallerReactionLimitFlags: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/trellis-post-spacing-load",
  title: "Trellis Post Spacing Load",
  description:
    "Screen interior post tributary reactions from caller uniform transverse line load and unequal adjacent bay lengths; simplified statics excludes wire dynamics, soils/wind/design factors and does not approve trellis spacing/safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "interiorPostModelReactionsN",
      label: "Interior post model reactions n",
      kind: "numberList",
    },
    {
      id: "aboveCallerReactionLimitFlags",
      label: "Above caller reaction limit flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      postBayLengthsM: value.postBayLengthsM as readonly number[],
      declaredUniformTransverseLoadNPerM:
        value.declaredUniformTransverseLoadNPerM as number,
      declaredAllowablePostReactionN:
        value.declaredAllowablePostReactionN as number,
    }),
});
export const run = tool.execute;
export default tool;
