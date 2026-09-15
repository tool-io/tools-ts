import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, exactLookup } from "../batch53-shared.js";

export type Input = Readonly<{ key: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    reference: exactLookup(i.key, {
      ring: "Early trophozoite ring-stage morphology.",
      trophozoite: "Growing asexual erythrocytic stage.",
      schizont: "Segmenting asexual stage producing merozoites.",
      gametocyte: "Sexual-stage morphology.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "ring" },
  output: { result: { reference: "Early trophozoite ring-stage morphology." } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/thinfilm-stage-key-classifier",
  title:
    "Thin Film Species Morphology Key Stage Classifier (ring/troph/schizont/gametocyte)",
  description:
    "Decode independently identified thin-film malaria stages, not species or transmissibility. Bounded exact-key educational reference only; observations and applicability must be established independently.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
