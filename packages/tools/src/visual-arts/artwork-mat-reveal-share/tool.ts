import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly artWidth: number;
  readonly artHeight: number;
  readonly openingWidth: number;
  readonly openingHeight: number;
};
export type Output = {
  readonly visibleArea: number;
  readonly artworkArea: number;
  readonly revealedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    artWidth: { type: "number", exclusiveMinimum: 0 },
    artHeight: { type: "number", exclusiveMinimum: 0 },
    openingWidth: { type: "number", minimum: 0 },
    openingHeight: { type: "number", minimum: 0 },
  },
  required: ["artWidth", "artHeight", "openingWidth", "openingHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visibleArea: { type: "number" },
    artworkArea: { type: "number" },
    revealedShare: { type: "number" },
  },
  required: ["visibleArea", "artworkArea", "revealedShare"],
} as const;
/** Calculate artwork mat reveal share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { artWidth, artHeight, openingWidth, openingHeight } = request;
  const compute = (): Output => {
    H.positive(artWidth);
    H.positive(artHeight);
    H.domain(
      openingWidth >= 0 &&
        openingHeight >= 0 &&
        openingWidth <= artWidth &&
        openingHeight <= artHeight,
    );
    return {
      visibleArea: openingWidth * openingHeight,
      artworkArea: artWidth * artHeight,
      revealedShare: (openingWidth / artWidth) * (openingHeight / artHeight),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { artWidth: 10, artHeight: 8, openingWidth: 8, openingHeight: 6 },
  output: {
    visibleArea: 48,
    artworkArea: 80,
    revealedShare: 0.6000000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const artworkMatRevealShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/artwork-mat-reveal-share",
    title: "Artwork Mat Reveal Share Tool",
    description:
      "Calculate artwork mat reveal share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        artWidth: { type: "number", exclusiveMinimum: 0 },
        artHeight: { type: "number", exclusiveMinimum: 0 },
        openingWidth: { type: "number", minimum: 0 },
        openingHeight: { type: "number", minimum: 0 },
      },
      required: ["artWidth", "artHeight", "openingWidth", "openingHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visibleArea: { type: "number" },
        artworkArea: { type: "number" },
        revealedShare: { type: "number" },
      },
      required: ["visibleArea", "artworkArea", "revealedShare"],
    },
    ports: {
      inputs: [
        {
          id: "artWidth",
          label: "Art Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "artHeight",
          label: "Art Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openingWidth",
          label: "Opening Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openingHeight",
          label: "Opening Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "visibleArea",
          label: "Visible Area",
          valueType: { type: "number" },
        },
        {
          id: "artworkArea",
          label: "Artwork Area",
          valueType: { type: "number" },
        },
        {
          id: "revealedShare",
          label: "Revealed Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = artworkMatRevealShareTool.execute;
export default artworkMatRevealShareTool;
