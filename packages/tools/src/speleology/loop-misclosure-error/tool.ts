import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, loopSurvey } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualDistanceAzimuthInclinationShots: readonly (readonly number[])[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualDistanceAzimuthInclinationShots",
    label: "Actual distance azimuth inclination shots",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return loopSurvey(input.actualDistanceAzimuthInclinationShots);
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDistanceAzimuthInclinationShots: [
      [1, 0, 0],
      [1, 180, 0],
    ],
  },
  output: {
    result: {
      signedClosureMeters: [0, 0, 0],
      observedClosureMagnitudeMeters: 0,
      observedSurveyedLengthMeters: 2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/loop-misclosure-error",
  title: "Survey Loop Misclosure Error Calculator",
  description:
    "Actual cave loop raw3Dvector closure from distance/azimuth/inclination shots, xEastyNorthzup. Independently matched angular/datum calibration required; closed-loop identity external, not adjusted survey quality or error attribution.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedClosureMeters: { type: "array", items: { type: "number" } },
          observedClosureMagnitudeMeters: { type: "number" },
          observedSurveyedLengthMeters: { type: "number" },
        },
        required: [
          "signedClosureMeters",
          "observedClosureMagnitudeMeters",
          "observedSurveyedLengthMeters",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
