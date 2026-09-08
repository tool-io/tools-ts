import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  canvas,
  unitPoints,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly hoist: number;
  readonly fly: number;
  readonly callerVerifiedStarIds: readonly string[];
  readonly callerVerifiedNormalizedPoints: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "hoist", label: "Hoist", kind: "number" },
  { id: "fly", label: "Fly", kind: "number" },
  {
    id: "callerVerifiedStarIds",
    label: "Caller verified star ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedNormalizedPoints",
    label: "Caller verified normalized points",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  canvas(input.fly, input.hoist);
  unique(input.callerVerifiedStarIds, "stars");
  aligned(
    input.callerVerifiedStarIds,
    input.callerVerifiedNormalizedPoints,
    "starpositions",
  );
  unitPoints(input.callerVerifiedNormalizedPoints);
  return {
    starIds: [...input.callerVerifiedStarIds],
    starCenters: input.callerVerifiedNormalizedPoints.map(([x, y]) => [
      x * input.fly,
      y * input.hoist,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    hoist: 100,
    fly: 200,
    callerVerifiedStarIds: ["alpha", "beta"],
    callerVerifiedNormalizedPoints: [
      [0.5, 0.25],
      [0.75, 0.6],
    ],
  },
  output: {
    result: {
      starIds: ["alpha", "beta"],
      starCenters: [
        [100, 25],
        [150, 60],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/southern-cross-coordinates",
  title: "Southern Cross Star Placement Coordinate Generator",
  description:
    "Generate Southern Cross centers from an independently verified named flag specification, normalized top-left coordinates. Country-specific star inventories/angles are not fabricated or replaced by an astronomical projection.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
