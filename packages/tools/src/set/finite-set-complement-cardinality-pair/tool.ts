import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly universe: readonly string[];
  readonly members: readonly string[];
};
export type Output = {
  readonly complement: readonly string[];
  readonly memberCount: number;
  readonly complementCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    universe: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    members: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["universe", "members"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    complement: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    memberCount: { type: "integer" },
    complementCount: { type: "integer" },
  },
  required: ["complement", "memberCount", "complementCount"],
} as const;
/** Compute finite set complement cardinality pair from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { universe, members } = input;
  const compute = (): Output => {
    const u = new Set(universe),
      s = new Set(members);
    domain([...s].every((x) => u.has(x)));
    const complement = [...u].filter((x) => !s.has(x));
    return {
      complement,
      memberCount: s.size,
      complementCount: complement.length,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { universe: ["a", "b", "c"], members: ["a"] },
  output: { complement: ["b", "c"], memberCount: 1, complementCount: 2 },
} satisfies ToolExample<Input, Output>;
export const finiteSetComplementCardinalityPairTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/finite-set-complement-cardinality-pair",
  title: "Finite Set Complement Cardinality Pair Tool",
  description:
    "Compute finite set complement cardinality pair from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "universe",
        label: "Universe",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
      {
        id: "members",
        label: "Members",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
    ],
    outputs: [
      {
        id: "complement",
        label: "Complement",
        valueType: { type: "list", items: { type: "string" } },
      },
      {
        id: "memberCount",
        label: "Member Count",
        valueType: { type: "integer" },
      },
      {
        id: "complementCount",
        label: "Complement Count",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = finiteSetComplementCardinalityPairTool.execute;
export default finiteSetComplementCardinalityPairTool;
