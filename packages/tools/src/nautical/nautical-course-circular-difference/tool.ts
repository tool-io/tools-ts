import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCourseDegrees: number;
  readonly secondCourseDegrees: number;
};
export type Output = { readonly signedDifferenceDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCourseDegrees: { type: "number", minimum: 0, exclusiveMaximum: 360 },
    secondCourseDegrees: { type: "number", minimum: 0, exclusiveMaximum: 360 },
  },
  required: ["firstCourseDegrees", "secondCourseDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedDifferenceDegrees: { type: "number" } },
  required: ["signedDifferenceDegrees"],
} as const;
/** Return the shortest signed second-minus-first course difference in [-180,180) degrees; an exact half-turn chooses -180. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCourseDegrees, secondCourseDegrees } = request;
  const compute = (): Output => {
    H.domain(
      firstCourseDegrees >= 0 &&
        firstCourseDegrees < 360 &&
        secondCourseDegrees >= 0 &&
        secondCourseDegrees < 360,
      "firstCourseDegrees",
    );
    const r = (secondCourseDegrees - firstCourseDegrees + 180) % 360;
    return { signedDifferenceDegrees: (r < 0 ? r + 360 : r) - 180 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCourseDegrees: 350, secondCourseDegrees: 10 },
  output: { signedDifferenceDegrees: 20 },
} satisfies ToolExample<Input, Output>;
export const nauticalCourseCircularDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/nautical-course-circular-difference",
    title: "Nautical Course Circular Difference Tool",
    description:
      "Return the shortest signed second-minus-first course difference in [-180,180) degrees; an exact half-turn chooses -180.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCourseDegrees: {
          type: "number",
          minimum: 0,
          exclusiveMaximum: 360,
        },
        secondCourseDegrees: {
          type: "number",
          minimum: 0,
          exclusiveMaximum: 360,
        },
      },
      required: ["firstCourseDegrees", "secondCourseDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedDifferenceDegrees: { type: "number" } },
      required: ["signedDifferenceDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "firstCourseDegrees",
          label: "First Course Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCourseDegrees",
          label: "Second Course Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedDifferenceDegrees",
          label: "Signed Difference Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nauticalCourseCircularDifferenceTool.execute;
export default nauticalCourseCircularDifferenceTool;
