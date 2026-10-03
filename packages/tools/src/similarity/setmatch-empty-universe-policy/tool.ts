import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  probability,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly left: readonly string[];
  readonly right: readonly string[];
  readonly universe: readonly string[];
  readonly emptyScore: number;
};
export type Output = { readonly defined: boolean; readonly agreement: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    right: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    universe: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    emptyScore: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["left", "right", "universe", "emptyScore"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { defined: { type: "boolean" }, agreement: { type: "number" } },
  required: ["defined", "agreement"],
} as const;
/** Compute setmatch empty universe policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right, universe, emptyScore } = input;
  const compute = (): Output => {
    const u = new Set(universe),
      a = new Set(left),
      b = new Set(right);
    domain([...a, ...b].every((x) => u.has(x)));
    probability(emptyScore);
    const count = [...u].filter((x) => a.has(x) === b.has(x)).length;
    return {
      defined: u.size > 0,
      agreement: u.size ? count / u.size : emptyScore,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: [], right: [], universe: [], emptyScore: 1 },
  output: { defined: false, agreement: 1 },
} satisfies ToolExample<Input, Output>;
export const setmatchEmptyUniversePolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "similarity/setmatch-empty-universe-policy",
  title: "Setmatch Empty Universe Policy Tool",
  description:
    "Compute setmatch empty universe policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
      {
        id: "universe",
        label: "Universe",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
      {
        id: "emptyScore",
        label: "Empty Score",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      { id: "agreement", label: "Agreement", valueType: { type: "number" } },
    ],
  },
});
export const run = setmatchEmptyUniversePolicyTool.execute;
export default setmatchEmptyUniversePolicyTool;
