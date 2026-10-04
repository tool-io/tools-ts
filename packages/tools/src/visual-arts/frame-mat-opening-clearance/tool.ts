import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingWidth: number;
  readonly openingHeight: number;
  readonly artworkWidth: number;
  readonly artworkHeight: number;
};
export type Output = { readonly horizontal: number; readonly vertical: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingWidth: { type: "number" },
    openingHeight: { type: "number" },
    artworkWidth: { type: "number" },
    artworkHeight: { type: "number" },
  },
  required: ["openingWidth", "openingHeight", "artworkWidth", "artworkHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { horizontal: { type: "number" }, vertical: { type: "number" } },
  required: ["horizontal", "vertical"],
} as const;
/** Return equal-side opening clearances; negative values indicate deliberate overlap. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingWidth, openingHeight, artworkWidth, artworkHeight } = request;
  const compute = (): Output => {
    H.domain(
      [openingWidth, openingHeight, artworkWidth, artworkHeight].every(
        (x) => x >= 0,
      ),
    );
    return {
      horizontal: (openingWidth - artworkWidth) / 2,
      vertical: (openingHeight - artworkHeight) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingWidth: 20,
    openingHeight: 30,
    artworkWidth: 18,
    artworkHeight: 28,
  },
  output: { horizontal: 1, vertical: 1 },
} satisfies ToolExample<Input, Output>;
export const frameMatOpeningClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/frame-mat-opening-clearance",
    title: "Frame Mat Opening Clearance Tool",
    description:
      "Return equal-side opening clearances; negative values indicate deliberate overlap.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingWidth: { type: "number" },
        openingHeight: { type: "number" },
        artworkWidth: { type: "number" },
        artworkHeight: { type: "number" },
      },
      required: [
        "openingWidth",
        "openingHeight",
        "artworkWidth",
        "artworkHeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontal: { type: "number" },
        vertical: { type: "number" },
      },
      required: ["horizontal", "vertical"],
    },
    ports: {
      inputs: [
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
        {
          id: "artworkWidth",
          label: "Artwork Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "artworkHeight",
          label: "Artwork Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "horizontal",
          label: "Horizontal",
          valueType: { type: "number" },
        },
        { id: "vertical", label: "Vertical", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = frameMatOpeningClearanceTool.execute;
export default frameMatOpeningClearanceTool;
