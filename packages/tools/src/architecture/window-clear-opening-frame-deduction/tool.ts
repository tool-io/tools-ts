import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerWidth: number;
  readonly outerHeight: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
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
    outerWidth: { type: "number" },
    outerHeight: { type: "number" },
    left: { type: "number", minimum: 0 },
    right: { type: "number", minimum: 0 },
    top: { type: "number", minimum: 0 },
    bottom: { type: "number", minimum: 0 },
  },
  required: ["outerWidth", "outerHeight", "left", "right", "top", "bottom"],
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
/** Calculate window clear opening frame deduction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerWidth, outerHeight, left, right, top, bottom } = request;
  const compute = (): Output => {
    H.domain(
      left >= 0 &&
        right >= 0 &&
        top >= 0 &&
        bottom >= 0 &&
        outerWidth >= left + right &&
        outerHeight >= top + bottom,
    );
    return {
      clearWidth: outerWidth - left - right,
      clearHeight: outerHeight - top - bottom,
      area: (outerWidth - left - right) * (outerHeight - top - bottom),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outerWidth: 1.5,
    outerHeight: 1.2,
    left: 0.1,
    right: 0.1,
    top: 0.1,
    bottom: 0.1,
  },
  output: {
    clearWidth: 1.2999999999999998,
    clearHeight: 0.9999999999999999,
    area: 1.2999999999999996,
  },
} satisfies ToolExample<Input, Output>;
export const windowClearOpeningFrameDeductionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/window-clear-opening-frame-deduction",
    title: "Window Clear Opening Frame Deduction Tool",
    description:
      "Calculate window clear opening frame deduction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerWidth: { type: "number" },
        outerHeight: { type: "number" },
        left: { type: "number", minimum: 0 },
        right: { type: "number", minimum: 0 },
        top: { type: "number", minimum: 0 },
        bottom: { type: "number", minimum: 0 },
      },
      required: ["outerWidth", "outerHeight", "left", "right", "top", "bottom"],
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
          id: "outerWidth",
          label: "Outer Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outerHeight",
          label: "Outer Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "left",
          label: "Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "top",
          label: "Top",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bottom",
          label: "Bottom",
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
export const run = windowClearOpeningFrameDeductionTool.execute;
export default windowClearOpeningFrameDeductionTool;
