import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedBladeLengthMm: number;
  readonly observedBladeWidthMm: number;
}>;
export type Output = Readonly<{ readonly observedLengthWidthRatio: number }>;
const inputFields = [
  {
    id: "observedBladeLengthMm",
    label: "Observed blade length mm",
    kind: "number",
  },
  {
    id: "observedBladeWidthMm",
    label: "Observed blade width mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedBladeLengthMm, "observedBladeLengthMm");
  positive(input.observedBladeWidthMm, "observedBladeWidthMm");
  return {
    observedLengthWidthRatio:
      input.observedBladeLengthMm / input.observedBladeWidthMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBladeLengthMm: 30,
  observedBladeWidthMm: 10,
} satisfies Input;
export const exampleOutput = { observedLengthWidthRatio: 3 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/prismatic-blade-length-width-ratio",
  title: "Prismatic Blade Length Width Ratio",
  description:
    "Measured prismatic blade linear dimension ratio only, no microblade type or manufacture technique identity. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedLengthWidthRatio",
      label: "Observed length width ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBladeLengthMm: value.observedBladeLengthMm as number,
      observedBladeWidthMm: value.observedBladeWidthMm as number,
    }),
});
export const run = tool.execute;
export default tool;
