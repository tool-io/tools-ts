import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trimWidth: number;
  readonly trimHeight: number;
  readonly bleedLeft: number;
  readonly bleedRight: number;
  readonly bleedTop: number;
  readonly bleedBottom: number;
};
export type Output = {
  readonly bleedWidth: number;
  readonly bleedHeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trimWidth: { type: "number", minimum: 0 },
    trimHeight: { type: "number", minimum: 0 },
    bleedLeft: { type: "number", minimum: 0 },
    bleedRight: { type: "number", minimum: 0 },
    bleedTop: { type: "number", minimum: 0 },
    bleedBottom: { type: "number", minimum: 0 },
  },
  required: [
    "trimWidth",
    "trimHeight",
    "bleedLeft",
    "bleedRight",
    "bleedTop",
    "bleedBottom",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bleedWidth: { type: "number" },
    bleedHeight: { type: "number" },
  },
  required: ["bleedWidth", "bleedHeight"],
} as const;
/** Expand an explicit trim rectangle by independently supplied bleed margins without selecting a printer specification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    trimWidth,
    trimHeight,
    bleedLeft,
    bleedRight,
    bleedTop,
    bleedBottom,
  } = request;
  const compute = (): Output => {
    H.domain(
      trimWidth >= 0 &&
        trimHeight >= 0 &&
        bleedLeft >= 0 &&
        bleedRight >= 0 &&
        bleedTop >= 0 &&
        bleedBottom >= 0,
      "trimWidth",
    );
    return {
      bleedWidth: trimWidth + bleedLeft + bleedRight,
      bleedHeight: trimHeight + bleedTop + bleedBottom,
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
    bleedLeft: 3,
    bleedRight: 3,
    bleedTop: 3,
    bleedBottom: 3,
  },
  output: { bleedWidth: 106, bleedHeight: 156 },
} satisfies ToolExample<Input, Output>;
export const printBleedCropBoxDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["graphic-design", "graphic design", "arts and design"],
      keywords: ["graphic design", "arts and design"],
    },
    id: "graphic-design/print-bleed-crop-box-delta",
    title: "Print Bleed Crop Box Delta",
    description:
      "Expand an explicit trim rectangle by independently supplied bleed margins without selecting a printer specification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trimWidth: { type: "number", minimum: 0 },
        trimHeight: { type: "number", minimum: 0 },
        bleedLeft: { type: "number", minimum: 0 },
        bleedRight: { type: "number", minimum: 0 },
        bleedTop: { type: "number", minimum: 0 },
        bleedBottom: { type: "number", minimum: 0 },
      },
      required: [
        "trimWidth",
        "trimHeight",
        "bleedLeft",
        "bleedRight",
        "bleedTop",
        "bleedBottom",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bleedWidth: { type: "number" },
        bleedHeight: { type: "number" },
      },
      required: ["bleedWidth", "bleedHeight"],
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
          id: "bleedLeft",
          label: "Bleed Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bleedRight",
          label: "Bleed Right",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bleedTop",
          label: "Bleed Top",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bleedBottom",
          label: "Bleed Bottom",
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
      ],
    },
  },
  calculate,
});
export const run = printBleedCropBoxDeltaTool.execute;
export default printBleedCropBoxDeltaTool;
