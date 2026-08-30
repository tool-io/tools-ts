import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly isoplanaticAngleArcseconds: number;
  readonly requestedFieldRadiusArcseconds: number;
}>;
export type Output = Readonly<{
  readonly angularMarginArcseconds: number;
  readonly fieldToIsoplanaticRatio: number;
  readonly withinIsoplanaticField: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.isoplanaticAngleArcseconds <= 0)
    simpleError(
      "isoplanaticAngleArcseconds",
      "Isoplanatic angle must be positive.",
      "invalid_angle",
    );
  return {
    angularMarginArcseconds:
      input.isoplanaticAngleArcseconds - input.requestedFieldRadiusArcseconds,
    fieldToIsoplanaticRatio:
      input.requestedFieldRadiusArcseconds / input.isoplanaticAngleArcseconds,
    withinIsoplanaticField:
      input.requestedFieldRadiusArcseconds <= input.isoplanaticAngleArcseconds,
  };
};

export const exampleInput = {
  isoplanaticAngleArcseconds: 10,
  requestedFieldRadiusArcseconds: 8,
} satisfies Input;
export const exampleOutput = {
  angularMarginArcseconds: 2,
  fieldToIsoplanaticRatio: 0.8,
  withinIsoplanaticField: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      isoplanaticAngleArcseconds: input.isoplanaticAngleArcseconds as number,
      requestedFieldRadiusArcseconds:
        input.requestedFieldRadiusArcseconds as number,
    }),
  description:
    "Compare a requested correction field with the measured isoplanatic angle.",
  id: "laser/isoplanatic-field-margin",
  inputs: [
    {
      id: "isoplanaticAngleArcseconds",
      label: "Isoplanatic angle",
      kind: "number",
      minimum: 0,
      unit: "arcsec",
    },
    {
      id: "requestedFieldRadiusArcseconds",
      label: "Requested field radius",
      kind: "number",
      minimum: 0,
      unit: "arcsec",
    },
  ],
  outputs: [
    {
      id: "angularMarginArcseconds",
      label: "Angular correction margin",
      kind: "number",
      unit: "arcsec",
    },
    {
      id: "fieldToIsoplanaticRatio",
      label: "Field-to-isoplanatic ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "withinIsoplanaticField",
      label: "Within isoplanatic field",
      kind: "boolean",
    },
  ],
  title: "Isoplanatic Field Margin",
});

export const run = tool.execute;
export default tool;
