import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { rad } from "../shared.js";

export type Input = Readonly<{
  readonly nodeLongitudeDegrees: number;
  readonly sunMeanLongitudeDegrees: number;
  readonly moonMeanLongitudeDegrees: number;
}>;
export type Output = Readonly<{
  readonly longitudeNutationArcseconds: number;
  readonly obliquityNutationArcseconds: number;
}>;
export const calculate = (input: Input): Output => {
  const O = rad(input.nodeLongitudeDegrees),
    L = rad(input.sunMeanLongitudeDegrees),
    l = rad(input.moonMeanLongitudeDegrees);
  return {
    longitudeNutationArcseconds:
      -17.2 * Math.sin(O) -
      1.32 * Math.sin(2 * L) -
      0.23 * Math.sin(2 * l) +
      0.21 * Math.sin(2 * O),
    obliquityNutationArcseconds:
      9.2 * Math.cos(O) +
      0.57 * Math.cos(2 * L) +
      0.1 * Math.cos(2 * l) -
      0.09 * Math.cos(2 * O),
  };
};
export const exampleInput = {
  nodeLongitudeDegrees: 90,
  sunMeanLongitudeDegrees: 0,
  moonMeanLongitudeDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  longitudeNutationArcseconds: -17.2,
  obliquityNutationArcseconds: 0.76,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/four-term-nutation-components",
  title: "Four Term Nutation Components",
  description:
    "Evaluate a four-term low-precision nutation approximation from supplied mean angles; not an IAU 2000/2006 implementation.",
  inputs: [
    {
      id: "nodeLongitudeDegrees",
      label: "Node longitude degrees",
      kind: "number",
    },
    {
      id: "sunMeanLongitudeDegrees",
      label: "Sun mean longitude degrees",
      kind: "number",
    },
    {
      id: "moonMeanLongitudeDegrees",
      label: "Moon mean longitude degrees",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "longitudeNutationArcseconds",
      label: "Longitude nutation arcseconds",
      kind: "number",
    },
    {
      id: "obliquityNutationArcseconds",
      label: "Obliquity nutation arcseconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      nodeLongitudeDegrees: value.nodeLongitudeDegrees as number,
      sunMeanLongitudeDegrees: value.sunMeanLongitudeDegrees as number,
      moonMeanLongitudeDegrees: value.moonMeanLongitudeDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
