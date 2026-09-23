import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPosition: number;
  readonly lastPosition: number;
  readonly coordinatesAreInclusive: boolean;
};
export type Output = { readonly span: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPosition: { type: "integer", minimum: 0 },
    lastPosition: { type: "integer" },
    coordinatesAreInclusive: { type: "boolean" },
  },
  required: ["firstPosition", "lastPosition", "coordinatesAreInclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { span: { type: "integer" } },
  required: ["span"],
} as const;
/** Count supplied genomic coordinate span under an explicit endpoint convention, without inferring phase. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPosition, lastPosition, coordinatesAreInclusive } = request;
  const compute = (): Output => {
    H.integer(firstPosition, 0);
    H.integer(lastPosition, firstPosition);
    return {
      span: lastPosition - firstPosition + (coordinatesAreInclusive ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstPosition: 100,
    lastPosition: 150,
    coordinatesAreInclusive: true,
  },
  output: { span: 51 },
} satisfies ToolExample<Input, Output>;
export const phasingBlockSpanTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "bioinformatics/phasing-block-span",
    title: "Phasing Block Span Tool",
    description:
      "Count supplied genomic coordinate span under an explicit endpoint convention, without inferring phase.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPosition: { type: "integer", minimum: 0 },
        lastPosition: { type: "integer" },
        coordinatesAreInclusive: { type: "boolean" },
      },
      required: ["firstPosition", "lastPosition", "coordinatesAreInclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { span: { type: "integer" } },
      required: ["span"],
    },
    ports: {
      inputs: [
        {
          id: "firstPosition",
          label: "First Position",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastPosition",
          label: "Last Position",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "coordinatesAreInclusive",
          label: "Coordinates Are Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "span", label: "Span", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = phasingBlockSpanTool.execute;
export default phasingBlockSpanTool;
