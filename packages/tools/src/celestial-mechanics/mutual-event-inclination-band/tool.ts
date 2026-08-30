import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative, deg } from "../shared.js";

export type Input = Readonly<{
  readonly firstRadius: number;
  readonly secondRadius: number;
  readonly separation: number;
  readonly viewingOffsetDegrees: number;
}>;
export type Output = Readonly<{
  readonly maximumOffsetDegrees: number;
  readonly eventGeometryPossible: boolean;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.firstRadius, "firstRadius");
  nonnegative(input.secondRadius, "secondRadius");
  positive(input.separation, "separation");
  if (
    input.firstRadius + input.secondRadius > input.separation ||
    Math.abs(input.viewingOffsetDegrees) > 90
  )
    simpleError(
      "separation",
      "Nonoverlapping spherical bodies and a viewing offset within ±90 degrees required.",
    );
  const maximumOffsetDegrees = deg(
    Math.asin((input.firstRadius + input.secondRadius) / input.separation),
  );
  return {
    maximumOffsetDegrees,
    eventGeometryPossible:
      Math.abs(input.viewingOffsetDegrees) <= maximumOffsetDegrees,
  };
};
export const exampleInput = {
  firstRadius: 1,
  secondRadius: 1,
  separation: 10,
  viewingOffsetDegrees: 10,
} satisfies Input;
export const exampleOutput = {
  maximumOffsetDegrees: 11.536959032815489,
  eventGeometryPossible: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/mutual-event-inclination-band",
  title: "Mutual Event Inclination Band",
  description:
    "Screen circular mutual-event geometry against the sum-of-radii projected inclination band; orbital phase is not inferred.",
  inputs: [
    { id: "firstRadius", label: "First radius", kind: "number" },
    { id: "secondRadius", label: "Second radius", kind: "number" },
    { id: "separation", label: "Separation", kind: "number" },
    {
      id: "viewingOffsetDegrees",
      label: "Viewing offset degrees",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "maximumOffsetDegrees",
      label: "Maximum offset degrees",
      kind: "number",
    },
    {
      id: "eventGeometryPossible",
      label: "Event geometry possible",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      firstRadius: value.firstRadius as number,
      secondRadius: value.secondRadius as number,
      separation: value.separation as number,
      viewingOffsetDegrees: value.viewingOffsetDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
