import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedUsableGalleryAreaSquareMeters: number;
  readonly callerApplicableAreaPerPersonSquareMeters: number;
  readonly callerSeparatelyAuthorizedEgressOccupancyCap: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedUsableGalleryAreaSquareMeters",
    label: "Caller verified usable gallery area square meters",
    kind: "number",
  },
  {
    id: "callerApplicableAreaPerPersonSquareMeters",
    label: "Caller applicable area per person square meters",
    kind: "number",
  },
  {
    id: "callerSeparatelyAuthorizedEgressOccupancyCap",
    label: "Caller separately authorized egress occupancy cap",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerVerifiedUsableGalleryAreaSquareMeters, "area");
  positive(input.callerApplicableAreaPerPersonSquareMeters, "factor");
  bounded(
    input.callerSeparatelyAuthorizedEgressOccupancyCap,
    "cap",
    0,
    1000000,
  );
  const a = Math.floor(
    input.callerVerifiedUsableGalleryAreaSquareMeters /
      input.callerApplicableAreaPerPersonSquareMeters,
  );
  return {
    conditionalAreaOnlyWholeOccupancy: a,
    conditionalCombinedScreenCap: Math.min(
      a,
      input.callerSeparatelyAuthorizedEgressOccupancyCap,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedUsableGalleryAreaSquareMeters: 100,
    callerApplicableAreaPerPersonSquareMeters: 2,
    callerSeparatelyAuthorizedEgressOccupancyCap: 40,
  },
  output: {
    result: {
      conditionalAreaOnlyWholeOccupancy: 50,
      conditionalCombinedScreenCap: 40,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/gallery-capacity-area-rule",
  title: "Gallery Visitor Capacity Fire Code Area Rule Calculator",
  description:
    "Restricted floor-area rule and independently separately authorized egress cap arithmetic. Not infer fire-code occupancy, permit crowding, resolve accessibility/obstructions or certify emergency egress.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
