import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ fromPhase: string; toPhase: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fromPhase", label: "From phase", kind: "string" },
  { id: "toPhase", label: "To phase", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const phases = ["wood", "fire", "earth", "metal", "water"];
  H.choice(i.fromPhase, phases);
  H.choice(i.toPhase, phases);
  const delta = H.mod(
    phases.indexOf(i.toPhase) - phases.indexOf(i.fromPhase),
    5,
  );
  return H.finish({
    relation: [
      "same",
      "generating",
      "controlling",
      "controlled-by",
      "generated-by",
    ][delta],
  });
};
export const example = {
  input: { fromPhase: "wood", toPhase: "water" },
  output: { result: { relation: "generated-by" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "wuxing/full-pair-relation",
  title: "Wuxing Five-Way Pair Relationship Classifier",
  description:
    "Classify one ordered Wuxing pair under the five conventional symbolic relations; named phases use the wood/fire/earth/metal/water order.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { relation: { type: "string" } },
        required: ["relation"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
