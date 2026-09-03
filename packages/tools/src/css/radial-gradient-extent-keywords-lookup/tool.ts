import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, pick } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly boxWidthPx: number;
  readonly boxHeightPx: number;
  readonly centerX: number;
  readonly centerY: number;
  readonly extent: string;
}>;
export type Output = Readonly<{ readonly circleExtentRadiusPx: number }>;
const inputFields = [
  { id: "boxWidthPx", label: "Box width px", kind: "number" },
  { id: "boxHeightPx", label: "Box height px", kind: "number" },
  { id: "centerX", label: "Center x", kind: "number" },
  { id: "centerY", label: "Center y", kind: "number" },
  { id: "extent", label: "Extent", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.boxWidthPx, "boxWidthPx");
  nonnegative(input.boxHeightPx, "boxHeightPx");
  if (
    input.centerX < 0 ||
    input.centerX > input.boxWidthPx ||
    input.centerY < 0 ||
    input.centerY > input.boxHeightPx
  )
    simpleError("center", "This bounded model supports center inside box.");
  const side = [
      input.centerX,
      input.boxWidthPx - input.centerX,
      input.centerY,
      input.boxHeightPx - input.centerY,
    ],
    corners = [
      Math.hypot(side[0], side[2]),
      Math.hypot(side[0], side[3]),
      Math.hypot(side[1], side[2]),
      Math.hypot(side[1], side[3]),
    ];
  return {
    circleExtentRadiusPx: pick(
      input.extent,
      {
        "closest-side": Math.min(...side),
        "farthest-side": Math.max(...side),
        "closest-corner": Math.min(...corners),
        "farthest-corner": Math.max(...corners),
      },
      "extent",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  boxWidthPx: 100,
  boxHeightPx: 80,
  centerX: 20,
  centerY: 30,
  extent: "farthest-corner",
} satisfies Input;
export const exampleOutput = {
  circleExtentRadiusPx: 94.33981132056604,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/radial-gradient-extent-keywords-lookup",
  title: "Radial-Gradient Extent Keywords Lookup",
  description:
    "Compute circle radial-gradient extent radius from actual inside-box center and edge/corner distances; elliptical gradient keyword geometry excluded. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "circleExtentRadiusPx",
      label: "Circle extent radius px",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      boxWidthPx: value.boxWidthPx as number,
      boxHeightPx: value.boxHeightPx as number,
      centerX: value.centerX as number,
      centerY: value.centerY as number,
      extent: value.extent as string,
    }),
});
export const run = tool.execute;
export default tool;
