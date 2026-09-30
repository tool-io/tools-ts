import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseWidth: number;
  readonly topWidth: number;
  readonly height: number;
  readonly length: number;
};
export type Output = {
  readonly sectionArea: number;
  readonly envelopeVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseWidth: { type: "number", minimum: 0 },
    topWidth: { type: "number", minimum: 0 },
    height: { type: "number", minimum: 0 },
    length: { type: "number", minimum: 0 },
  },
  required: ["baseWidth", "topWidth", "height", "length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectionArea: { type: "number" },
    envelopeVolume: { type: "number" },
  },
  required: ["sectionArea", "envelopeVolume"],
} as const;
/** Calculate hedge trapezoid canopy area term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseWidth, topWidth, height, length } = request;
  const compute = (): Output => {
    H.domain(baseWidth >= 0 && topWidth >= 0 && height >= 0 && length >= 0);
    return {
      sectionArea: ((baseWidth + topWidth) * height) / 2,
      envelopeVolume: ((baseWidth + topWidth) * height * length) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseWidth: 2, topWidth: 1, height: 3, length: 10 },
  output: { sectionArea: 4.5, envelopeVolume: 45 },
} satisfies ToolExample<Input, Output>;
export const hedgeTrapezoidCanopyAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/hedge-trapezoid-canopy-area-term",
    title: "Hedge Trapezoid Canopy Area Term Tool",
    description:
      "Calculate hedge trapezoid canopy area term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseWidth: { type: "number", minimum: 0 },
        topWidth: { type: "number", minimum: 0 },
        height: { type: "number", minimum: 0 },
        length: { type: "number", minimum: 0 },
      },
      required: ["baseWidth", "topWidth", "height", "length"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sectionArea: { type: "number" },
        envelopeVolume: { type: "number" },
      },
      required: ["sectionArea", "envelopeVolume"],
    },
    ports: {
      inputs: [
        {
          id: "baseWidth",
          label: "Base Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "topWidth",
          label: "Top Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sectionArea",
          label: "Section Area",
          valueType: { type: "number" },
        },
        {
          id: "envelopeVolume",
          label: "Envelope Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hedgeTrapezoidCanopyAreaTermTool.execute;
export default hedgeTrapezoidCanopyAreaTermTool;
