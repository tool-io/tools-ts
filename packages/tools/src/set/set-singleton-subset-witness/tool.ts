import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly element: string;
  readonly members: readonly string[];
};
export type Output = {
  readonly subset: boolean;
  readonly missing: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    element: { type: "string", maxLength: 8192 },
    members: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["element", "members"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subset: { type: "boolean" },
    missing: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["subset", "missing"],
} as const;
/** Compute set singleton subset witness from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { element, members } = input;
  const compute = (): Output => {
    const subset = members.includes(element);
    return { subset, missing: subset ? [] : [element] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { element: "b", members: ["a"] },
  output: { subset: false, missing: ["b"] },
} satisfies ToolExample<Input, Output>;
export const setSingletonSubsetWitnessTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/set-singleton-subset-witness",
  title: "Set Singleton Subset Witness Tool",
  description:
    "Compute set singleton subset witness from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "element",
        label: "Element",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "members",
        label: "Members",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
    ],
    outputs: [
      { id: "subset", label: "Subset", valueType: { type: "boolean" } },
      {
        id: "missing",
        label: "Missing",
        valueType: { type: "list", items: { type: "string" } },
      },
    ],
  },
});
export const run = setSingletonSubsetWitnessTool.execute;
export default setSingletonSubsetWitnessTool;
