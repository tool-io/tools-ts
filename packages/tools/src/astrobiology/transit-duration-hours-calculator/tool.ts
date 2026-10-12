import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly periodHours: number;
  readonly starRadiusOverSemimajor: number;
  readonly planetToStarRadius: number;
  readonly impactParameter: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "periodHours", label: "Period hours", kind: "number" },
  {
    id: "starRadiusOverSemimajor",
    label: "Star radius over semimajor",
    kind: "number",
  },
  { id: "planetToStarRadius", label: "Planet to star radius", kind: "number" },
  { id: "impactParameter", label: "Impact parameter", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  positive(i.periodHours, "period");
  positive(i.starRadiusOverSemimajor, "scale");
  fraction(i.planetToStarRadius, "radius ratio");
  nonnegative(i.impactParameter, "impact");
  if (
    i.starRadiusOverSemimajor * (1 + i.planetToStarRadius) >= 1 ||
    i.impactParameter >= 1 + i.planetToStarRadius
  )
    simpleError(
      "geometry",
      "Detached orbit and actual positive-chord transit.",
    );
  return {
    circularTransitHours:
      (i.periodHours / Math.PI) *
      Math.asin(
        (i.starRadiusOverSemimajor *
          Math.sqrt((1 + i.planetToStarRadius) ** 2 - i.impactParameter ** 2)) /
          Math.sqrt(1 - (i.impactParameter * i.starRadiusOverSemimajor) ** 2),
      ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    periodHours: 314.1592653589793,
    starRadiusOverSemimajor: 0.09090909090909091,
    planetToStarRadius: 0.1,
    impactParameter: 0,
  },
  output: { result: { circularTransitHours: 10.01674211615598 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/transit-duration-hours-calculator",
  title: "Transit Duration Hours from Period and Impact Parameter Calculator",
  description:
    "Circular first-to-fourth-contact transit duration; b measured in stellar radii, finite geometric chord and inclination, no eccentricity/limb darkening.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { circularTransitHours: { type: "number" } },
        required: ["circularTransitHours"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
