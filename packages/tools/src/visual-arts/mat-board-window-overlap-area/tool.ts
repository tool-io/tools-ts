import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly artWidth: number;
  readonly artHeight: number;
  readonly overlap: number;
};
export type Output = {
  readonly windowWidth: number;
  readonly windowHeight: number;
  readonly hiddenArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    artWidth: { type: "number" },
    artHeight: { type: "number" },
    overlap: { type: "number", minimum: 0 },
  },
  required: ["artWidth", "artHeight", "overlap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windowWidth: { type: "number" },
    windowHeight: { type: "number" },
    hiddenArea: { type: "number" },
  },
  required: ["windowWidth", "windowHeight", "hiddenArea"],
} as const;
/** Calculate mat board window overlap area from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { artWidth, artHeight, overlap } = request;
  const compute = (): Output => {
    H.domain(
      overlap >= 0 && artWidth >= 2 * overlap && artHeight >= 2 * overlap,
    );
    return {
      windowWidth: artWidth - 2 * overlap,
      windowHeight: artHeight - 2 * overlap,
      hiddenArea:
        artWidth * artHeight -
        (artWidth - 2 * overlap) * (artHeight - 2 * overlap),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { artWidth: 40, artHeight: 50, overlap: 1 },
  output: { windowWidth: 38, windowHeight: 48, hiddenArea: 176 },
} satisfies ToolExample<Input, Output>;
export const matBoardWindowOverlapAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/mat-board-window-overlap-area",
    title: "Mat Board Window Overlap Area Tool",
    description:
      "Calculate mat board window overlap area from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        artWidth: { type: "number" },
        artHeight: { type: "number" },
        overlap: { type: "number", minimum: 0 },
      },
      required: ["artWidth", "artHeight", "overlap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windowWidth: { type: "number" },
        windowHeight: { type: "number" },
        hiddenArea: { type: "number" },
      },
      required: ["windowWidth", "windowHeight", "hiddenArea"],
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
          id: "overlap",
          label: "Overlap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "windowWidth",
          label: "Window Width",
          valueType: { type: "number" },
        },
        {
          id: "windowHeight",
          label: "Window Height",
          valueType: { type: "number" },
        },
        {
          id: "hiddenArea",
          label: "Hidden Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = matBoardWindowOverlapAreaTool.execute;
export default matBoardWindowOverlapAreaTool;
