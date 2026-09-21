import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly chosen: number; readonly offered: number };
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chosen: { type: "integer", minimum: 0 },
    offered: { type: "integer", minimum: 0 },
  },
  required: ["chosen", "offered"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Calculate learner choice count share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chosen, offered } = request;
  const compute = (): Output => {
    H.integer(offered, 0);
    H.integer(chosen, 0, offered);
    return { share: offered > 0 ? chosen / offered : 0, defined: offered > 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { chosen: 3, offered: 4 },
  output: { share: 0.75, defined: true },
} satisfies ToolExample<Input, Output>;
export const learnerChoiceCountShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "andragogy/learner-choice-count-share",
    title: "Learner Choice Count Share Tool",
    description:
      "Calculate learner choice count share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chosen: { type: "integer", minimum: 0 },
        offered: { type: "integer", minimum: 0 },
      },
      required: ["chosen", "offered"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "chosen",
          label: "Chosen",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "offered",
          label: "Offered",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = learnerChoiceCountShareTool.execute;
export default learnerChoiceCountShareTool;
