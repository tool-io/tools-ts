import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trimWidth: number;
  readonly trimHeight: number;
  readonly bleed: number;
  readonly safeInset: number;
  readonly elementX: number;
  readonly elementY: number;
};
export type Output = {
  readonly bleedWidth: number;
  readonly bleedHeight: number;
  readonly safeMargin: number;
  readonly insideSafe: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trimWidth: { type: "number", exclusiveMinimum: 0 },
    trimHeight: { type: "number", exclusiveMinimum: 0 },
    bleed: { type: "number", minimum: 0 },
    safeInset: { type: "number", minimum: 0 },
    elementX: { type: "number" },
    elementY: { type: "number" },
  },
  required: [
    "trimWidth",
    "trimHeight",
    "bleed",
    "safeInset",
    "elementX",
    "elementY",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bleedWidth: { type: "number" },
    bleedHeight: { type: "number" },
    safeMargin: { type: "number" },
    insideSafe: { type: "boolean" },
  },
  required: ["bleedWidth", "bleedHeight", "safeMargin", "insideSafe"],
} as const;
/** Rectangular print and inset geometry in matching units; no printer bleed or binding specification is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trimWidth, trimHeight, bleed, safeInset, elementX, elementY } =
    request;
  const compute = (): Output => {
    H.positive(trimWidth);
    H.positive(trimHeight);
    H.domain(
      bleed >= 0 &&
        safeInset >= 0 &&
        2 * safeInset <= Math.min(trimWidth, trimHeight),
    );
    return {
      bleedWidth: trimWidth + 2 * bleed,
      bleedHeight: trimHeight + 2 * bleed,
      safeMargin: Math.min(
        elementX - safeInset,
        trimWidth - safeInset - elementX,
        elementY - safeInset,
        trimHeight - safeInset - elementY,
      ),
      insideSafe:
        elementX >= safeInset &&
        elementX <= trimWidth - safeInset &&
        elementY >= safeInset &&
        elementY <= trimHeight - safeInset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    trimWidth: 100,
    trimHeight: 150,
    bleed: 3,
    safeInset: 5,
    elementX: 10,
    elementY: 20,
  },
  output: {
    bleedWidth: 106,
    bleedHeight: 156,
    safeMargin: 5,
    insideSafe: true,
  },
} satisfies ToolExample<Input, Output>;
export const printBleedCornerSafeZoneGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/print-bleed-corner-safe-zone-gap",
    title: "Print Bleed Corner Safe Zone Gap Tool",
    description:
      "Rectangular print and inset geometry in matching units; no printer bleed or binding specification is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trimWidth: { type: "number", exclusiveMinimum: 0 },
        trimHeight: { type: "number", exclusiveMinimum: 0 },
        bleed: { type: "number", minimum: 0 },
        safeInset: { type: "number", minimum: 0 },
        elementX: { type: "number" },
        elementY: { type: "number" },
      },
      required: [
        "trimWidth",
        "trimHeight",
        "bleed",
        "safeInset",
        "elementX",
        "elementY",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bleedWidth: { type: "number" },
        bleedHeight: { type: "number" },
        safeMargin: { type: "number" },
        insideSafe: { type: "boolean" },
      },
      required: ["bleedWidth", "bleedHeight", "safeMargin", "insideSafe"],
    },
    ports: {
      inputs: [
        {
          id: "trimWidth",
          label: "Trim Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trimHeight",
          label: "Trim Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bleed",
          label: "Bleed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "safeInset",
          label: "Safe Inset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elementX",
          label: "Element X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elementY",
          label: "Element Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bleedWidth",
          label: "Bleed Width",
          valueType: { type: "number" },
        },
        {
          id: "bleedHeight",
          label: "Bleed Height",
          valueType: { type: "number" },
        },
        {
          id: "safeMargin",
          label: "Safe Margin",
          valueType: { type: "number" },
        },
        {
          id: "insideSafe",
          label: "Inside Safe",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = printBleedCornerSafeZoneGapTool.execute;
export default printBleedCornerSafeZoneGapTool;
