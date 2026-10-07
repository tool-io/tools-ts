import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bedStart: number;
  readonly bedEndExclusive: number;
};
export type Output = {
  readonly oneBasedStart: number;
  readonly oneBasedEndInclusive: number;
  readonly length: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bedStart: { type: "integer", minimum: 0 },
    bedEndExclusive: { type: "integer" },
  },
  required: ["bedStart", "bedEndExclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oneBasedStart: { type: "integer" },
    oneBasedEndInclusive: { type: "integer" },
    length: { type: "integer" },
  },
  required: ["oneBasedStart", "oneBasedEndInclusive", "length"],
} as const;
/** Convert one nonempty zero-based half-open BED interval to one-based inclusive coordinates; empty intervals are outside this conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bedStart, bedEndExclusive } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(bedStart) &&
        bedStart >= 0 &&
        bedStart <= Number.MAX_SAFE_INTEGER,
      "bedStart",
    ),
      bedStart);
    (H.domain(
      Number.isSafeInteger(bedEndExclusive) &&
        bedEndExclusive >= bedStart + 1 &&
        bedEndExclusive <= Number.MAX_SAFE_INTEGER,
      "bedEndExclusive",
    ),
      bedEndExclusive);
    return {
      oneBasedStart: bedStart + 1,
      oneBasedEndInclusive: bedEndExclusive,
      length: bedEndExclusive - bedStart,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bedStart: 99, bedEndExclusive: 120 },
  output: { oneBasedStart: 100, oneBasedEndInclusive: 120, length: 21 },
} satisfies ToolExample<Input, Output>;
export const bedZeroToStartTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioinformatics", "biology"],
      keywords: ["bioinformatics", "biology"],
    },
    id: "bioinformatics/bed-zero-to-start",
    title: "BED Zero To Start",
    description:
      "Convert one nonempty zero-based half-open BED interval to one-based inclusive coordinates; empty intervals are outside this conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bedStart: { type: "integer", minimum: 0 },
        bedEndExclusive: { type: "integer" },
      },
      required: ["bedStart", "bedEndExclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oneBasedStart: { type: "integer" },
        oneBasedEndInclusive: { type: "integer" },
        length: { type: "integer" },
      },
      required: ["oneBasedStart", "oneBasedEndInclusive", "length"],
    },
    ports: {
      inputs: [
        {
          id: "bedStart",
          label: "Bed Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bedEndExclusive",
          label: "Bed End Exclusive",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "oneBasedStart",
          label: "One Based Start",
          valueType: { type: "integer" },
        },
        {
          id: "oneBasedEndInclusive",
          label: "One Based End Inclusive",
          valueType: { type: "integer" },
        },
        { id: "length", label: "Length", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = bedZeroToStartTool.execute;
export default bedZeroToStartTool;
