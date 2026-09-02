import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly behrensmeyerStage: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "behrensmeyerStage", label: "Behrensmeyer stage", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.behrensmeyerStage,
      {
        "0": "no cracking or flaking; may retain soft tissue",
        "1": "longitudinal cracking; mosaic cracking on articular surfaces",
        "2": "outer surface flaking associated with cracking",
        "3": "fibrous rough surface with penetrating cracks",
        "4": "coarsely fibrous surface, cracks and loose splinters",
        "5": "bone disintegrating into large splinters",
      },
      "behrensmeyerStage",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { behrensmeyerStage: "2" } satisfies Input;
export const exampleOutput = {
  meaning: "outer surface flaking associated with cracking",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/bone-weathering-behrensmyer-stage",
  title: "Behrensmeyer Bone Weathering Stage Lookup",
  description:
    "Named Behrensmeyer 1978 observed bone weathering stage descriptors, not fixed time-since-death or environment-independent duration. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ behrensmeyerStage: value.behrensmeyerStage as string }),
});
export const run = tool.execute;
export default tool;
