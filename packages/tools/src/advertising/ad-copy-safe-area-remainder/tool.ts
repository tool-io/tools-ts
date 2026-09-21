import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalWidth: number;
  readonly totalHeight: number;
  readonly insetLeft: number;
  readonly insetRight: number;
  readonly insetTop: number;
  readonly insetBottom: number;
};
export type Output = {
  readonly safeWidth: number;
  readonly safeHeight: number;
  readonly safeArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalWidth: { type: "number", minimum: 0 },
    totalHeight: { type: "number", minimum: 0 },
    insetLeft: { type: "number" },
    insetRight: { type: "number" },
    insetTop: { type: "number" },
    insetBottom: { type: "number" },
  },
  required: [
    "totalWidth",
    "totalHeight",
    "insetLeft",
    "insetRight",
    "insetTop",
    "insetBottom",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    safeWidth: { type: "number" },
    safeHeight: { type: "number" },
    safeArea: { type: "number" },
  },
  required: ["safeWidth", "safeHeight", "safeArea"],
} as const;
/** Calculate ad copy safe area remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    totalWidth,
    totalHeight,
    insetLeft,
    insetRight,
    insetTop,
    insetBottom,
  } = request;
  const compute = (): Output => {
    H.domain(
      totalWidth >= 0 &&
        totalHeight >= 0 &&
        [insetLeft, insetRight, insetTop, insetBottom].every((x) => x >= 0) &&
        insetLeft + insetRight <= totalWidth &&
        insetTop + insetBottom <= totalHeight,
    );
    return {
      safeWidth: totalWidth - insetLeft - insetRight,
      safeHeight: totalHeight - insetTop - insetBottom,
      safeArea:
        (totalWidth - insetLeft - insetRight) *
        (totalHeight - insetTop - insetBottom),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalWidth: 100,
    totalHeight: 80,
    insetLeft: 5,
    insetRight: 5,
    insetTop: 10,
    insetBottom: 10,
  },
  output: { safeWidth: 90, safeHeight: 60, safeArea: 5400 },
} satisfies ToolExample<Input, Output>;
export const adCopySafeAreaRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/ad-copy-safe-area-remainder",
    title: "Ad Copy Safe Area Remainder Tool",
    description:
      "Calculate ad copy safe area remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalWidth: { type: "number", minimum: 0 },
        totalHeight: { type: "number", minimum: 0 },
        insetLeft: { type: "number" },
        insetRight: { type: "number" },
        insetTop: { type: "number" },
        insetBottom: { type: "number" },
      },
      required: [
        "totalWidth",
        "totalHeight",
        "insetLeft",
        "insetRight",
        "insetTop",
        "insetBottom",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        safeWidth: { type: "number" },
        safeHeight: { type: "number" },
        safeArea: { type: "number" },
      },
      required: ["safeWidth", "safeHeight", "safeArea"],
    },
    ports: {
      inputs: [
        {
          id: "totalWidth",
          label: "Total Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalHeight",
          label: "Total Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "insetLeft",
          label: "Inset Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "insetRight",
          label: "Inset Right",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "insetTop",
          label: "Inset Top",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "insetBottom",
          label: "Inset Bottom",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "safeWidth", label: "Safe Width", valueType: { type: "number" } },
        {
          id: "safeHeight",
          label: "Safe Height",
          valueType: { type: "number" },
        },
        { id: "safeArea", label: "Safe Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = adCopySafeAreaRemainderTool.execute;
export default adCopySafeAreaRemainderTool;
