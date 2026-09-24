import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourcePage: number;
  readonly sourceAnchor: number;
  readonly targetAnchor: number;
};
export type Output = { readonly targetPage: number; readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourcePage: { type: "integer", minimum: 1 },
    sourceAnchor: { type: "integer", minimum: 1 },
    targetAnchor: { type: "integer", minimum: 1 },
  },
  required: ["sourcePage", "sourceAnchor", "targetAnchor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetPage: { type: "integer" }, offset: { type: "integer" } },
  required: ["targetPage", "offset"],
} as const;
/** Apply a caller-established constant pagination offset within one gathering, without inferring edition alignment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourcePage, sourceAnchor, targetAnchor } = request;
  const compute = (): Output => {
    H.integer(sourcePage, 1);
    H.integer(sourceAnchor, 1);
    H.integer(targetAnchor, 1);
    H.domain(sourcePage - sourceAnchor + targetAnchor >= 1);
    return {
      targetPage: sourcePage - sourceAnchor + targetAnchor,
      offset: targetAnchor - sourceAnchor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourcePage: 120, sourceAnchor: 100, targetAnchor: 108 },
  output: { targetPage: 128, offset: 8 },
} satisfies ToolExample<Input, Output>;
export const editionPaginationOffsetOneGatheringTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "comparative-literature/edition-pagination-offset-one-gathering",
      title: "Edition Pagination Offset One Gathering Tool",
      description:
        "Apply a caller-established constant pagination offset within one gathering, without inferring edition alignment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourcePage: { type: "integer", minimum: 1 },
          sourceAnchor: { type: "integer", minimum: 1 },
          targetAnchor: { type: "integer", minimum: 1 },
        },
        required: ["sourcePage", "sourceAnchor", "targetAnchor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          targetPage: { type: "integer" },
          offset: { type: "integer" },
        },
        required: ["targetPage", "offset"],
      },
      ports: {
        inputs: [
          {
            id: "sourcePage",
            label: "Source Page",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "sourceAnchor",
            label: "Source Anchor",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "targetAnchor",
            label: "Target Anchor",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "targetPage",
            label: "Target Page",
            valueType: { type: "integer" },
          },
          { id: "offset", label: "Offset", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = editionPaginationOffsetOneGatheringTool.execute;
export default editionPaginationOffsetOneGatheringTool;
