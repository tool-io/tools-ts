import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: string; readonly second: string };
export type Output = {
  readonly first: string;
  readonly second: string;
  readonly swapped: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "string", maxLength: 8192 },
    second: { type: "string", maxLength: 8192 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "string", maxLength: 8192 },
    second: { type: "string", maxLength: 8192 },
    swapped: { type: "boolean" },
  },
  required: ["first", "second", "swapped"],
} as const;
/** Order simple star alleles numerically while preserving suballele spellings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    const parse = (x: string) => {
      const match = /^\*([1-9]\d*)(?:\.(\d+))?(?![\s\S])/.exec(x);
      H.domain(match, "first");
      return [
        BigInt(match[1]),
        match[2] === undefined ? -1n : BigInt(match[2]),
      ] as const;
    };
    const a = parse(first),
      b = parse(second),
      swapped = a[0] > b[0] || (a[0] === b[0] && a[1] > b[1]);
    return {
      first: swapped ? second : first,
      second: swapped ? first : second,
      swapped,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: "*10", second: "*2" },
  output: { first: "*2", second: "*10", swapped: true },
} satisfies ToolExample<Input, Output>;
export const pharmacogeneDiplotypeOrderCanonicalizerTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacogenomics/pharmacogene-diplotype-order-canonicalizer",
      title: "Pharmacogene Diplotype Order Canonicalizer Tool",
      description:
        "Order simple star alleles numerically while preserving suballele spellings.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "string", maxLength: 8192 },
          second: { type: "string", maxLength: 8192 },
        },
        required: ["first", "second"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "string", maxLength: 8192 },
          second: { type: "string", maxLength: 8192 },
          swapped: { type: "boolean" },
        },
        required: ["first", "second", "swapped"],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "first", label: "First", valueType: { type: "string" } },
          { id: "second", label: "Second", valueType: { type: "string" } },
          { id: "swapped", label: "Swapped", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = pharmacogeneDiplotypeOrderCanonicalizerTool.execute;
export default pharmacogeneDiplotypeOrderCanonicalizerTool;
