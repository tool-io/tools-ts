import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCodePresent: boolean;
  readonly secondCodePresent: boolean;
};
export type Output = { readonly conflict: boolean; readonly neither: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCodePresent: { type: "boolean" },
    secondCodePresent: { type: "boolean" },
  },
  required: ["firstCodePresent", "secondCodePresent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { conflict: { type: "boolean" }, neither: { type: "boolean" } },
  required: ["conflict", "neither"],
} as const;
/** Flag simultaneous explicit presence of two caller-designated mutually exclusive behavior codes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCodePresent, secondCodePresent } = request;
  const compute = (): Output => {
    return {
      conflict: firstCodePresent && secondCodePresent,
      neither: !firstCodePresent && !secondCodePresent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCodePresent: true, secondCodePresent: true },
  output: { conflict: true, neither: false },
} satisfies ToolExample<Input, Output>;
export const behaviorCodeMutuallyExclusivePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["behavioral-science", "behavioral science", "psychology"],
      keywords: ["behavioral science", "psychology"],
    },
    id: "behavioral-science/behavior-code-mutually-exclusive-pair",
    title: "Behavior Code Mutually Exclusive Pair",
    description:
      "Flag simultaneous explicit presence of two caller-designated mutually exclusive behavior codes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCodePresent: { type: "boolean" },
        secondCodePresent: { type: "boolean" },
      },
      required: ["firstCodePresent", "secondCodePresent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conflict: { type: "boolean" },
        neither: { type: "boolean" },
      },
      required: ["conflict", "neither"],
    },
    ports: {
      inputs: [
        {
          id: "firstCodePresent",
          label: "First Code Present",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "secondCodePresent",
          label: "Second Code Present",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "conflict", label: "Conflict", valueType: { type: "boolean" } },
        { id: "neither", label: "Neither", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = behaviorCodeMutuallyExclusivePairTool.execute;
export default behaviorCodeMutuallyExclusivePairTool;
