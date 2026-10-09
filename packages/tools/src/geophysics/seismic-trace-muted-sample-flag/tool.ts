import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleIndex: number;
  readonly muteStartInclusive: number;
  readonly muteEndExclusive: number;
};
export type Output = { readonly muted: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleIndex: { type: "integer", minimum: 0 },
    muteStartInclusive: { type: "integer", minimum: 0 },
    muteEndExclusive: { type: "integer" },
  },
  required: ["sampleIndex", "muteStartInclusive", "muteEndExclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { muted: { type: "boolean" } },
  required: ["muted"],
} as const;
/** Check one supplied zero-based seismic sample index against an explicit half-open mute span without modifying trace amplitudes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleIndex, muteStartInclusive, muteEndExclusive } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(sampleIndex) &&
        sampleIndex >= 0 &&
        sampleIndex <= Number.MAX_SAFE_INTEGER,
      "sampleIndex",
    ),
      sampleIndex);
    (H.domain(
      Number.isSafeInteger(muteStartInclusive) &&
        muteStartInclusive >= 0 &&
        muteStartInclusive <= Number.MAX_SAFE_INTEGER,
      "muteStartInclusive",
    ),
      muteStartInclusive);
    (H.domain(
      Number.isSafeInteger(muteEndExclusive) &&
        muteEndExclusive >= muteStartInclusive &&
        muteEndExclusive <= Number.MAX_SAFE_INTEGER,
      "muteEndExclusive",
    ),
      muteEndExclusive);
    return {
      muted:
        sampleIndex >= muteStartInclusive && sampleIndex < muteEndExclusive,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleIndex: 5, muteStartInclusive: 3, muteEndExclusive: 8 },
  output: { muted: true },
} satisfies ToolExample<Input, Output>;
export const seismicTraceMutedSampleFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/seismic-trace-muted-sample-flag",
    title: "Seismic Trace Muted Sample Flag Tool",
    description:
      "Check one supplied zero-based seismic sample index against an explicit half-open mute span without modifying trace amplitudes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleIndex: { type: "integer", minimum: 0 },
        muteStartInclusive: { type: "integer", minimum: 0 },
        muteEndExclusive: { type: "integer" },
      },
      required: ["sampleIndex", "muteStartInclusive", "muteEndExclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { muted: { type: "boolean" } },
      required: ["muted"],
    },
    ports: {
      inputs: [
        {
          id: "sampleIndex",
          label: "Sample Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "muteStartInclusive",
          label: "Mute Start Inclusive",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "muteEndExclusive",
          label: "Mute End Exclusive",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "muted", label: "Muted", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = seismicTraceMutedSampleFlagTool.execute;
export default seismicTraceMutedSampleFlagTool;
