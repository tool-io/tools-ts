import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bedWidth: number;
  readonly reachFromEachSide: number;
  readonly accessibleSideCount: number;
};
export type Output = { readonly reachMargin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bedWidth: { type: "number", minimum: 0 },
    reachFromEachSide: { type: "number", minimum: 0 },
    accessibleSideCount: { type: "integer", minimum: 1, maximum: 2 },
  },
  required: ["bedWidth", "reachFromEachSide", "accessibleSideCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reachMargin: { type: "number" } },
  required: ["reachMargin"],
} as const;
/** Compare explicit bed width with supplied one-sided or two-sided reach without establishing accessibility standards. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bedWidth, reachFromEachSide, accessibleSideCount } = request;
  const compute = (): Output => {
    H.domain(bedWidth >= 0 && reachFromEachSide >= 0, "bedWidth");
    (H.domain(
      Number.isSafeInteger(accessibleSideCount) &&
        accessibleSideCount >= 1 &&
        accessibleSideCount <= 2,
      "accessibleSideCount",
    ),
      accessibleSideCount);
    return { reachMargin: reachFromEachSide * accessibleSideCount - bedWidth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bedWidth: 120, reachFromEachSide: 70, accessibleSideCount: 2 },
  output: { reachMargin: 20 },
} satisfies ToolExample<Input, Output>;
export const urbanBedReachWidthMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["urban-agriculture", "urban agriculture", "agriculture"],
      keywords: ["urban agriculture", "agriculture"],
    },
    id: "urban-agriculture/urban-bed-reach-width-margin",
    title: "Urban BED Reach Width Margin",
    description:
      "Compare explicit bed width with supplied one-sided or two-sided reach without establishing accessibility standards.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bedWidth: { type: "number", minimum: 0 },
        reachFromEachSide: { type: "number", minimum: 0 },
        accessibleSideCount: { type: "integer", minimum: 1, maximum: 2 },
      },
      required: ["bedWidth", "reachFromEachSide", "accessibleSideCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reachMargin: { type: "number" } },
      required: ["reachMargin"],
    },
    ports: {
      inputs: [
        {
          id: "bedWidth",
          label: "Bed Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reachFromEachSide",
          label: "Reach From Each Side",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "accessibleSideCount",
          label: "Accessible Side Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "reachMargin",
          label: "Reach Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = urbanBedReachWidthMarginTool.execute;
export default urbanBedReachWidthMarginTool;
