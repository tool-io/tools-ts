import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sounding: number;
  readonly transducerBelowSurface: number;
  readonly draft: number;
};
export type Output = {
  readonly waterDepth: number;
  readonly underKeel: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sounding: { type: "number", minimum: 0 },
    transducerBelowSurface: { type: "number", minimum: 0 },
    draft: { type: "number", minimum: 0 },
  },
  required: ["sounding", "transducerBelowSurface", "draft"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { waterDepth: { type: "number" }, underKeel: { type: "number" } },
  required: ["waterDepth", "underKeel"],
} as const;
/** Calculate nautical sounding keel datum shift from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sounding, transducerBelowSurface, draft } = request;
  const compute = (): Output => {
    H.domain(sounding >= 0 && transducerBelowSurface >= 0 && draft >= 0);
    const waterDepth = sounding + transducerBelowSurface;
    return { waterDepth, underKeel: waterDepth - draft };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sounding: 10, transducerBelowSurface: 2, draft: 5 },
  output: { waterDepth: 12, underKeel: 7 },
} satisfies ToolExample<Input, Output>;
export const nauticalSoundingKeelDatumShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/nautical-sounding-keel-datum-shift",
    title: "Nautical Sounding Keel Datum Shift Tool",
    description:
      "Calculate nautical sounding keel datum shift from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sounding: { type: "number", minimum: 0 },
        transducerBelowSurface: { type: "number", minimum: 0 },
        draft: { type: "number", minimum: 0 },
      },
      required: ["sounding", "transducerBelowSurface", "draft"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterDepth: { type: "number" },
        underKeel: { type: "number" },
      },
      required: ["waterDepth", "underKeel"],
    },
    ports: {
      inputs: [
        {
          id: "sounding",
          label: "Sounding",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transducerBelowSurface",
          label: "Transducer Below Surface",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "draft",
          label: "Draft",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "waterDepth",
          label: "Water Depth",
          valueType: { type: "number" },
        },
        { id: "underKeel", label: "Under Keel", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = nauticalSoundingKeelDatumShiftTool.execute;
export default nauticalSoundingKeelDatumShiftTool;
