import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly artistName: string; readonly qualifier: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    artistName: { type: "string", maxLength: 8192 },
    qualifier: {
      type: "string",
      maxLength: 8192,
      enum: [
        "by",
        "attributed to",
        "workshop of",
        "circle of",
        "follower of",
        "after",
      ],
    },
  },
  required: ["artistName", "qualifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an explicit catalogue attribution qualifier and artist display name; this records a supplied claim rather than evaluating attribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { artistName, qualifier } = request;
  const compute = (): Output => {
    H.domain(artistName.trim().length > 0, "artistName");
    H.domain(
      [
        "by",
        "attributed to",
        "workshop of",
        "circle of",
        "follower of",
        "after",
      ].includes(qualifier),
      "qualifier",
    );
    return { label: qualifier + " " + artistName };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { artistName: "Ada Example", qualifier: "attributed to" },
  output: { label: "attributed to Ada Example" },
} satisfies ToolExample<Input, Output>;
export const artworkAttributionQualifierTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/artwork-attribution-qualifier-token",
    title: "Artwork Attribution Qualifier Token Tool",
    description:
      "Format an explicit catalogue attribution qualifier and artist display name; this records a supplied claim rather than evaluating attribution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        artistName: { type: "string", maxLength: 8192 },
        qualifier: {
          type: "string",
          maxLength: 8192,
          enum: [
            "by",
            "attributed to",
            "workshop of",
            "circle of",
            "follower of",
            "after",
          ],
        },
      },
      required: ["artistName", "qualifier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "artistName",
          label: "Artist Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "qualifier",
          label: "Qualifier",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = artworkAttributionQualifierTokenTool.execute;
export default artworkAttributionQualifierTokenTool;
