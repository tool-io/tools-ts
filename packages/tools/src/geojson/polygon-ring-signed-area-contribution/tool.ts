import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly number[];
  readonly second: readonly number[];
};
export type Output = { readonly twiceAreaTerm: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    second: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { twiceAreaTerm: { type: "number" } },
  required: ["twiceAreaTerm"],
} as const;
/** Return one planar shoelace edge term in supplied coordinate units; not ellipsoidal geodesic area. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second } = input;
  const compute = (): Output => {
    H.domain(first.length >= 2 && second.length >= 2);
    return { twiceAreaTerm: first[0] * second[1] - second[0] * first[1] };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: [2, 0], second: [0, 3] },
  output: { twiceAreaTerm: 6 },
} satisfies ToolExample<Input, Output>;
export const polygonRingSignedAreaContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/polygon-ring-signed-area-contribution",
    title: "Polygon Ring Signed Area Contribution Tool",
    description:
      "Return one planar shoelace edge term in supplied coordinate units; not ellipsoidal geodesic area.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "array", maxItems: 256, items: { type: "number" } },
        second: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { twiceAreaTerm: { type: "number" } },
      required: ["twiceAreaTerm"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "twiceAreaTerm",
          label: "Twice Area Term",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = polygonRingSignedAreaContributionTool.execute;
export default polygonRingSignedAreaContributionTool;
