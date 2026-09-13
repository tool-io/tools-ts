import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  sourceFor,
  draw,
  shuffle,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly callerActualSixFaceCubeStrings: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  {
    id: "callerActualSixFaceCubeStrings",
    label: "Caller actual six face cube strings",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context);
  if (
    input.callerActualSixFaceCubeStrings.length !== 16 ||
    input.callerActualSixFaceCubeStrings.some((v) => !/^[A-Z]{6}$/.test(v))
  )
    simpleError("cubes", "Actual16six-faceASCIIlettercubes.");
  const a = shuffle(input.callerActualSixFaceCubeStrings, random).map(
    (c) => c[draw(0, 5, random)],
  );
  return {
    letterGrid: Array.from({ length: 4 }, (_, r) => a.slice(4 * r, 4 * r + 4)),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    seed: "batch51",
    callerActualSixFaceCubeStrings: [
      "ABCDEF",
      "ABCDEF",
      "ABCDEF",
      "ABCDEF",
      "ABCDEF",
      "ABCDEF",
      "ABCDEF",
      "ABCDEF",
      "ABCDEF",
      "ABCDEF",
      "ABCDEF",
      "ABCDEF",
      "ABCDEF",
      "ABCDEF",
      "ABCDEF",
      "ABCDEF",
    ],
  },
  output: {
    result: {
      letterGrid: [
        ["C", "D", "E", "C"],
        ["B", "D", "D", "F"],
        ["D", "A", "A", "E"],
        ["F", "E", "A", "C"],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/boggle-grid",
  title: "Boggle Grid Generator",
  description:
    "Boggle-style4\u00d74actualcubeshuffleandface draw,cubewordsactualcaller edition,Q-to-Qu external;no publisheddiceinvented. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
