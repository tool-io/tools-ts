import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frameWidth: number;
  readonly frameHeight: number;
  readonly border: number;
};
export type Output = {
  readonly clearWidth: number;
  readonly clearHeight: number;
  readonly area: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameWidth: { type: "number" },
    frameHeight: { type: "number" },
    border: { type: "number", minimum: 0 },
  },
  required: ["frameWidth", "frameHeight", "border"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clearWidth: { type: "number" },
    clearHeight: { type: "number" },
    area: { type: "number" },
  },
  required: ["clearWidth", "clearHeight", "area"],
} as const;
/** Calculate theatrical gel frame clear aperture from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frameWidth, frameHeight, border } = request;
  const compute = (): Output => {
    H.domain(
      border >= 0 && frameWidth >= 2 * border && frameHeight >= 2 * border,
    );
    return {
      clearWidth: frameWidth - 2 * border,
      clearHeight: frameHeight - 2 * border,
      area: (frameWidth - 2 * border) * (frameHeight - 2 * border),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frameWidth: 20, frameHeight: 20, border: 2 },
  output: { clearWidth: 16, clearHeight: 16, area: 256 },
} satisfies ToolExample<Input, Output>;
export const theatricalGelFrameClearApertureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/theatrical-gel-frame-clear-aperture",
    title: "Theatrical Gel Frame Clear Aperture Tool",
    description:
      "Calculate theatrical gel frame clear aperture from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameWidth: { type: "number" },
        frameHeight: { type: "number" },
        border: { type: "number", minimum: 0 },
      },
      required: ["frameWidth", "frameHeight", "border"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clearWidth: { type: "number" },
        clearHeight: { type: "number" },
        area: { type: "number" },
      },
      required: ["clearWidth", "clearHeight", "area"],
    },
    ports: {
      inputs: [
        {
          id: "frameWidth",
          label: "Frame Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "frameHeight",
          label: "Frame Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "border",
          label: "Border",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "clearWidth",
          label: "Clear Width",
          valueType: { type: "number" },
        },
        {
          id: "clearHeight",
          label: "Clear Height",
          valueType: { type: "number" },
        },
        { id: "area", label: "Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = theatricalGelFrameClearApertureTool.execute;
export default theatricalGelFrameClearApertureTool;
