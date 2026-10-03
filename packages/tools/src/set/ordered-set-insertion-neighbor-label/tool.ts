import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly members: readonly string[];
  readonly element: string;
};
export type Output = {
  readonly index: number;
  readonly predecessor: string;
  readonly successor: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    members: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    element: { type: "string", maxLength: 8192 },
  },
  required: ["members", "element"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer" },
    predecessor: { type: "string", maxLength: 8192 },
    successor: { type: "string", maxLength: 8192 },
  },
  required: ["index", "predecessor", "successor"],
} as const;
/** Compute ordered set insertion neighbor label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { members, element } = input;
  const compute = (): Output => {
    domain(members.every((x, i) => i === 0 || members[i - 1] < x));
    const index = members.findIndex((x) => x >= element),
      k = index < 0 ? members.length : index;
    domain(!members.includes(element));
    return {
      index: k,
      predecessor: k ? members[k - 1] : "",
      successor: k < members.length ? members[k] : "",
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { members: ["a", "c"], element: "b" },
  output: { index: 1, predecessor: "a", successor: "c" },
} satisfies ToolExample<Input, Output>;
export const orderedSetInsertionNeighborLabelTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/ordered-set-insertion-neighbor-label",
  title: "Ordered Set Insertion Neighbor Label Tool",
  description:
    "Compute ordered set insertion neighbor label from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "members",
        label: "Members",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
      {
        id: "element",
        label: "Element",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "index", label: "Index", valueType: { type: "integer" } },
      {
        id: "predecessor",
        label: "Predecessor",
        valueType: { type: "string" },
      },
      { id: "successor", label: "Successor", valueType: { type: "string" } },
    ],
  },
});
export const run = orderedSetInsertionNeighborLabelTool.execute;
export default orderedSetInsertionNeighborLabelTool;
