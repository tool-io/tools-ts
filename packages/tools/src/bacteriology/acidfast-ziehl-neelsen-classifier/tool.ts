import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly observedStainPattern: string;
  readonly controlsValid: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedStainPattern",
    label: "Observed stain pattern",
    kind: "string",
  },
  { id: "controlsValid", label: "Controls valid", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  pick(
    i.observedStainPattern,
    { "red-fuchsia": 0, other: 1, unknown: 2 },
    "pattern",
  );
  return {
    observationClass:
      !i.controlsValid || i.observedStainPattern === "unknown"
        ? "uninterpretable"
        : i.observedStainPattern === "red-fuchsia"
          ? "acid-fast retention pattern"
          : "target pattern not observed",
    speciesIdentified: false,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { observedStainPattern: "red-fuchsia", controlsValid: true },
  output: {
    result: {
      observationClass: "acid-fast retention pattern",
      speciesIdentified: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/acidfast-ziehl-neelsen-classifier",
  title: "Acid-Fast Ziehl-Neelsen Retention Result Classifier",
  description:
    "Decode actual caller red-fuchsia stain-pattern observation with explicit valid controls; not image detection, cell-wall assay, organism identity or clinical diagnosis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
