import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExpandingSquareLegLengthInput = {
  readonly searchRadiusNm: number;
};

export type ExpandingSquareLegLengthOutput = {
  readonly firstLegLengthNm: number;
};

const LEGS_FROM_CENTER_TO_EDGE = 2;

export const calculateExpandingSquareLegLength = (
  input: ExpandingSquareLegLengthInput,
): ExpandingSquareLegLengthOutput | null =>
  Number.isFinite(input.searchRadiusNm) && input.searchRadiusNm > 0
    ? { firstLegLengthNm: input.searchRadiusNm / LEGS_FROM_CENTER_TO_EDGE }
    : null;

export const expandingSquareLegLengthExample = {
  input: { searchRadiusNm: 4 },
  output: { firstLegLengthNm: 2 },
} satisfies ToolExample<
  ExpandingSquareLegLengthInput,
  ExpandingSquareLegLengthOutput
>;

export const expandingSquareLegLengthTool = createSimpleTool({
  id: "sailing/expanding-square-leg-length",
  title: "Expanding Square Leg Length",
  description:
    "Determine the first leg length of an expanding square search pattern so the squared spiral reaches the requested search radius after two legs from the datum.",
  inputs: [
    {
      description: "Radius of the area to sweep around the datum.",
      id: "searchRadiusNm",
      kind: "number",
      label: "Search radius",
      unit: "NM",
    },
  ],
  outputs: [
    {
      description: "Length of the first leg leaving the datum.",
      format: "length-nm",
      id: "firstLegLengthNm",
      kind: "number",
      label: "First leg length",
      unit: "NM",
    },
  ],
  calculate: (input) => {
    const firstLegLengthNm = calculateExpandingSquareLegLength(
      input as unknown as ExpandingSquareLegLengthInput,
    );
    if (firstLegLengthNm === null)
      simpleError(
        "searchRadiusNm",
        "The search radius must be finite and greater than zero.",
        "invalid_radius",
      );
    return firstLegLengthNm;
  },
});

export const runExpandingSquareLegLength = expandingSquareLegLengthTool.execute;
export default expandingSquareLegLengthTool;
