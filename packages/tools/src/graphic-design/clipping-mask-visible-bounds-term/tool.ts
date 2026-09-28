import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly maskLeft: number;
  readonly maskTop: number;
  readonly maskRight: number;
  readonly maskBottom: number;
};
export type Output = {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
  readonly hasArea: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number" },
    top: { type: "number" },
    right: { type: "number" },
    bottom: { type: "number" },
    maskLeft: { type: "number" },
    maskTop: { type: "number" },
    maskRight: { type: "number" },
    maskBottom: { type: "number" },
  },
  required: [
    "left",
    "top",
    "right",
    "bottom",
    "maskLeft",
    "maskTop",
    "maskRight",
    "maskBottom",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number" },
    top: { type: "number" },
    right: { type: "number" },
    bottom: { type: "number" },
    width: { type: "number" },
    height: { type: "number" },
    hasArea: { type: "boolean" },
  },
  required: ["left", "top", "right", "bottom", "width", "height", "hasArea"],
} as const;
/** Axis-aligned rectangle bounds intersection, collapsing a disjoint result at the maximum lower corner; not a curved clipping-path intersection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { left, top, right, bottom, maskLeft, maskTop, maskRight, maskBottom } =
    request;
  const compute = (): Output => {
    H.domain(
      right >= left &&
        bottom >= top &&
        maskRight >= maskLeft &&
        maskBottom >= maskTop,
    );
    return {
      left: Math.max(left, maskLeft),
      top: Math.max(top, maskTop),
      right: Math.max(Math.max(left, maskLeft), Math.min(right, maskRight)),
      bottom: Math.max(Math.max(top, maskTop), Math.min(bottom, maskBottom)),
      width: Math.max(0, Math.min(right, maskRight) - Math.max(left, maskLeft)),
      height: Math.max(
        0,
        Math.min(bottom, maskBottom) - Math.max(top, maskTop),
      ),
      hasArea:
        Math.min(right, maskRight) > Math.max(left, maskLeft) &&
        Math.min(bottom, maskBottom) > Math.max(top, maskTop),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    left: 0,
    top: 0,
    right: 10,
    bottom: 10,
    maskLeft: 4,
    maskTop: 2,
    maskRight: 12,
    maskBottom: 8,
  },
  output: {
    left: 4,
    top: 2,
    right: 10,
    bottom: 8,
    width: 6,
    height: 6,
    hasArea: true,
  },
} satisfies ToolExample<Input, Output>;
export const clippingMaskVisibleBoundsTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/clipping-mask-visible-bounds-term",
    title: "Clipping Mask Visible Bounds Term Tool",
    description:
      "Axis-aligned rectangle bounds intersection, collapsing a disjoint result at the maximum lower corner; not a curved clipping-path intersection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        left: { type: "number" },
        top: { type: "number" },
        right: { type: "number" },
        bottom: { type: "number" },
        maskLeft: { type: "number" },
        maskTop: { type: "number" },
        maskRight: { type: "number" },
        maskBottom: { type: "number" },
      },
      required: [
        "left",
        "top",
        "right",
        "bottom",
        "maskLeft",
        "maskTop",
        "maskRight",
        "maskBottom",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        left: { type: "number" },
        top: { type: "number" },
        right: { type: "number" },
        bottom: { type: "number" },
        width: { type: "number" },
        height: { type: "number" },
        hasArea: { type: "boolean" },
      },
      required: [
        "left",
        "top",
        "right",
        "bottom",
        "width",
        "height",
        "hasArea",
      ],
    },
    ports: {
      inputs: [
        {
          id: "left",
          label: "Left",
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
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bottom",
          label: "Bottom",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maskLeft",
          label: "Mask Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maskTop",
          label: "Mask Top",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maskRight",
          label: "Mask Right",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maskBottom",
          label: "Mask Bottom",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "left", label: "Left", valueType: { type: "number" } },
        { id: "top", label: "Top", valueType: { type: "number" } },
        { id: "right", label: "Right", valueType: { type: "number" } },
        { id: "bottom", label: "Bottom", valueType: { type: "number" } },
        { id: "width", label: "Width", valueType: { type: "number" } },
        { id: "height", label: "Height", valueType: { type: "number" } },
        { id: "hasArea", label: "Has Area", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = clippingMaskVisibleBoundsTermTool.execute;
export default clippingMaskVisibleBoundsTermTool;
