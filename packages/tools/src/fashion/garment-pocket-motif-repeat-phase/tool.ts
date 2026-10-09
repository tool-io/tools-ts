import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pocketCoordinate: number;
  readonly motifOrigin: number;
  readonly repeatLength: number;
};
export type Output = { readonly repeatPhase: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pocketCoordinate: { type: "number" },
    motifOrigin: { type: "number" },
    repeatLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pocketCoordinate", "motifOrigin", "repeatLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { repeatPhase: { type: "number" } },
  required: ["repeatPhase"],
} as const;
/** Wrap an explicit pocket placement relative to a supplied motif origin into one nonnegative repeat phase. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pocketCoordinate, motifOrigin, repeatLength } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(repeatLength) && repeatLength > 0,
      "repeatLength",
    ),
      repeatLength);
    return {
      repeatPhase: (() => {
        const difference = pocketCoordinate - motifOrigin;
        const r = Number.isFinite(difference)
          ? difference % repeatLength
          : ((pocketCoordinate % repeatLength) - (motifOrigin % repeatLength)) %
            repeatLength;
        return r < 0
          ? r + repeatLength === repeatLength
            ? 0
            : r + repeatLength
          : r;
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pocketCoordinate: 23, motifOrigin: 2, repeatLength: 10 },
  output: { repeatPhase: 1 },
} satisfies ToolExample<Input, Output>;
export const garmentPocketMotifRepeatPhaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["fashion", "arts and design"],
      keywords: ["fashion", "arts and design"],
    },
    id: "fashion/garment-pocket-motif-repeat-phase",
    title: "Garment Pocket Motif Repeat Phase",
    description:
      "Wrap an explicit pocket placement relative to a supplied motif origin into one nonnegative repeat phase.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pocketCoordinate: { type: "number" },
        motifOrigin: { type: "number" },
        repeatLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["pocketCoordinate", "motifOrigin", "repeatLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { repeatPhase: { type: "number" } },
      required: ["repeatPhase"],
    },
    ports: {
      inputs: [
        {
          id: "pocketCoordinate",
          label: "Pocket Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "motifOrigin",
          label: "Motif Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "repeatLength",
          label: "Repeat Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "repeatPhase",
          label: "Repeat Phase",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = garmentPocketMotifRepeatPhaseTool.execute;
export default garmentPocketMotifRepeatPhaseTool;
