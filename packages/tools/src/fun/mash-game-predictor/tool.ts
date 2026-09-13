import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  unique,
  sourceFor,
  draw,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly callerHousingChoices: readonly string[];
  readonly callerJobChoices: readonly string[];
  readonly callerLocationChoices: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  {
    id: "callerHousingChoices",
    label: "Caller housing choices",
    kind: "stringList",
  },
  { id: "callerJobChoices", label: "Caller job choices", kind: "stringList" },
  {
    id: "callerLocationChoices",
    label: "Caller location choices",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context);
  [
    input.callerHousingChoices,
    input.callerJobChoices,
    input.callerLocationChoices,
  ].forEach((v) => unique(v, "choices"));
  return {
    fictionalHousing:
      input.callerHousingChoices[
        draw(0, input.callerHousingChoices.length - 1, random)
      ],
    fictionalJob:
      input.callerJobChoices[
        draw(0, input.callerJobChoices.length - 1, random)
      ],
    fictionalLocation:
      input.callerLocationChoices[
        draw(0, input.callerLocationChoices.length - 1, random)
      ],
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
    callerHousingChoices: ["house", "apartment"],
    callerJobChoices: ["artist", "gardener"],
    callerLocationChoices: ["forest", "coast"],
  },
  output: {
    result: {
      fictionalHousing: "house",
      fictionalJob: "artist",
      fictionalLocation: "coast",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/mash-game-predictor",
  title: "MASH Game Predictor",
  description:
    "DeclaredindependentuniformMASH-inspiredthreecategoryfictionalresult,not papereliminationalgorithmor life/financialprediction. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
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
