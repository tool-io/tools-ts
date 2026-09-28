import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly first: readonly number[];
  readonly last: readonly number[];
};
export type Output = {
  readonly xyClosed: boolean;
  readonly fullyClosed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    last: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["first", "last"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    xyClosed: { type: "boolean" },
    fullyClosed: { type: "boolean" },
  },
  required: ["xyClosed", "fullyClosed"],
} as const;
/** Compute polygon ring closure ordinate consistency from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { first, last } = input;
  const compute = (): Output => {
    domain(first.length >= 2 && last.length >= 2);
    return {
      xyClosed: first[0] === last[0] && first[1] === last[1],
      fullyClosed:
        first.length === last.length && first.every((x, i) => x === last[i]),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: [1, 2, 3], last: [1, 2, 4] },
  output: { xyClosed: true, fullyClosed: false },
} satisfies ToolExample<Input, Output>;
export const polygonRingClosureOrdinateConsistencyTool =
  defineSchemaCalculation<Input, Output>({
    id: "geojson/polygon-ring-closure-ordinate-consistency",
    title: "Polygon Ring Closure Ordinate Consistency Tool",
    description:
      "Compute polygon ring closure ordinate consistency from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "last",
          label: "Last",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "xyClosed", label: "Xy Closed", valueType: { type: "boolean" } },
        {
          id: "fullyClosed",
          label: "Fully Closed",
          valueType: { type: "boolean" },
        },
      ],
    },
  });
export const run = polygonRingClosureOrdinateConsistencyTool.execute;
export default polygonRingClosureOrdinateConsistencyTool;
