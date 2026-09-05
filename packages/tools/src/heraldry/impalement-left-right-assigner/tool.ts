import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly bearerDexterArmorialId: string;
  readonly bearerSinisterArmorialId: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "bearerDexterArmorialId",
    label: "Bearer dexter armorial id",
    kind: "string",
  },
  {
    id: "bearerSinisterArmorialId",
    label: "Bearer sinister armorial id",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !input.bearerDexterArmorialId.trim() ||
    !input.bearerSinisterArmorialId.trim()
  )
    simpleError("arms", "Explicit armorial IDs.");
  return {
    viewerLeftId: input.bearerDexterArmorialId,
    viewerRightId: input.bearerSinisterArmorialId,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { bearerDexterArmorialId: "a", bearerSinisterArmorialId: "b" },
  output: { result: { viewerLeftId: "a", viewerRightId: "b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/impalement-left-right-assigner",
  title: "Marshalling Impalement Left-Right Assigner",
  description:
    "Assign independently authorized impalement sides: bearer dexter to viewer left; no marriage/gender/entitlement inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
