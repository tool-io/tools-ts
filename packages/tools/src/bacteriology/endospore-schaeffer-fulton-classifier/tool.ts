import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly observedStainPattern: string;
  readonly controlsValid: boolean;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "observedStainPattern",
    label: "Observed stain pattern",
    kind: "string",
  },
  { id: "controlsValid", label: "Controls valid", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  pick(
    i.observedStainPattern,
    { "green-spore": 0, other: 1, unknown: 2 },
    "pattern",
  );
  return {
    observationClass:
      !i.controlsValid || i.observedStainPattern === "unknown"
        ? "uninterpretable"
        : i.observedStainPattern === "green-spore"
          ? "endospore staining pattern"
          : "target pattern not observed",
    speciesIdentified: false,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { observedStainPattern: "green-spore", controlsValid: true },
  output: {
    result: {
      observationClass: "endospore staining pattern",
      speciesIdentified: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/endospore-schaeffer-fulton-classifier",
  title: "Endospore Schaeffer-Fulton Green Stain Result Classifier",
  description:
    "Decode actual caller green-spore stain-pattern observation with explicit valid controls; not image detection, cell-wall assay, organism identity or clinical diagnosis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observationClass: { type: "string" },
          speciesIdentified: { type: "boolean" },
        },
        required: ["observationClass", "speciesIdentified"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
