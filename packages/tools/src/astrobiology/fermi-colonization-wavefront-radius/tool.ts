import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly wavefrontFractionOfC: number;
  readonly elapsedYears: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "wavefrontFractionOfC",
    label: "Wavefront fraction of c",
    kind: "number",
  },
  { id: "elapsedYears", label: "Elapsed years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  fraction(i.wavefrontFractionOfC, "speed fraction");
  nonnegative(i.elapsedYears, "time");
  return { idealRadiusLightyears: i.wavefrontFractionOfC * i.elapsedYears };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { wavefrontFractionOfC: 0.01, elapsedYears: 100000 },
  output: { result: { idealRadiusLightyears: 1000 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/fermi-colonization-wavefront-radius",
  title: "Fermi Paradox Colonization Wavefront Radius Estimator",
  description:
    "Ideal radial colonization-front radius in lightyears from caller effective front speed, no replication/delay/Galactic simulation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { idealRadiusLightyears: { type: "number" } },
        required: ["idealRadiusLightyears"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
