import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sourceFor,
  draw,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly gridWidth: number;
  readonly gridHeight: number;
  readonly coordinateCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "gridWidth", label: "Grid width", kind: "number" },
  { id: "gridHeight", label: "Grid height", kind: "number" },
  { id: "coordinateCount", label: "Coordinate count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context);
  bounded(input.gridWidth, "width", 1, 128);
  bounded(input.gridHeight, "height", 1, 128);
  bounded(input.coordinateCount, "count", 1, 64);
  return {
    coordinates: Array.from({ length: input.coordinateCount }, () => [
      draw(0, input.gridWidth - 1, random),
      draw(0, input.gridHeight - 1, random),
    ]),
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
  input: { seed: "batch51", gridWidth: 4, gridHeight: 3, coordinateCount: 2 },
  output: {
    result: {
      coordinates: [
        [1, 1],
        [2, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/treasure-hunt-coordinates",
  title: "Treasure Hunt Map Coordinate Roller",
  description:
    "Toyrectangulargridtreasurecoordinateswithreplacement,no geolocation/trespass or realtreasure prediction. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
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
