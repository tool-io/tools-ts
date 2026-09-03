import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  integral,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedLoafSectionsAreaCM2: readonly number[];
  readonly observedSectionPositionsCm: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedSectionIntegratedLoafVolumeCM3: number;
}>;
const inputFields = [
  {
    id: "observedLoafSectionsAreaCM2",
    label: "Observed loaf sections area c m2",
    kind: "numberList",
  },
  {
    id: "observedSectionPositionsCm",
    label: "Observed section positions cm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLoafSectionsAreaCM2.forEach((v) =>
    nonnegative(v, "observedLoafSectionsAreaCM2"),
  );
  return {
    observedSectionIntegratedLoafVolumeCM3: integral(
      input.observedSectionPositionsCm,
      input.observedLoafSectionsAreaCM2,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLoafSectionsAreaCM2: [0, 10, 0],
  observedSectionPositionsCm: [0, 5, 10],
} satisfies Input;
export const exampleOutput = {
  observedSectionIntegratedLoafVolumeCM3: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/bread-loaf-volume",
  title: "Cooking Bread Loaf Volume Calculator",
  description:
    "Measured loaf cross-section piecewise-linear volume integration, not rectangular pan proxy or inferred bread density. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSectionIntegratedLoafVolumeCM3",
      label: "Observed section integrated loaf volume c m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLoafSectionsAreaCM2:
        value.observedLoafSectionsAreaCM2 as readonly number[],
      observedSectionPositionsCm:
        value.observedSectionPositionsCm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
