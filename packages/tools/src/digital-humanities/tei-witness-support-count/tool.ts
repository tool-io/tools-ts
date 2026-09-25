import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly witnessIds: readonly string[];
  readonly readingIds: readonly string[];
  readonly selectedReading: string;
  readonly omittedWitnesses: readonly string[];
};
export type Output = {
  readonly eligibleWitnesses: number;
  readonly supportingWitnesses: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    witnessIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    readingIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    selectedReading: { type: "string", maxLength: 8192 },
    omittedWitnesses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["witnessIds", "readingIds", "selectedReading", "omittedWitnesses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleWitnesses: { type: "integer" },
    supportingWitnesses: { type: "integer" },
  },
  required: ["eligibleWitnesses", "supportingWitnesses"],
} as const;
/** Count supplied TEI-style witness/reading incidences after explicit omissions; no XML parsing or textual reconstruction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { witnessIds, readingIds, selectedReading, omittedWitnesses } = request;
  const compute = (): Output => {
    H.sameLength(witnessIds, readingIds);
    return (() => {
      const eligible = new Set(
          witnessIds.filter((x) => !omittedWitnesses.includes(x)),
        ),
        support = new Set(
          witnessIds.filter(
            (x, i) =>
              !omittedWitnesses.includes(x) &&
              readingIds[i] === selectedReading,
          ),
        );
      return {
        eligibleWitnesses: eligible.size,
        supportingWitnesses: support.size,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    witnessIds: ["w1", "w1", "w2"],
    readingIds: ["a", "b", "a"],
    selectedReading: "a",
    omittedWitnesses: ["w2"],
  },
  output: { eligibleWitnesses: 1, supportingWitnesses: 1 },
} satisfies ToolExample<Input, Output>;
export const teiWitnessSupportCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/tei-witness-support-count",
    title: "TEI Witness Support Count Tool",
    description:
      "Count supplied TEI-style witness/reading incidences after explicit omissions; no XML parsing or textual reconstruction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        witnessIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        readingIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        selectedReading: { type: "string", maxLength: 8192 },
        omittedWitnesses: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "witnessIds",
        "readingIds",
        "selectedReading",
        "omittedWitnesses",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleWitnesses: { type: "integer" },
        supportingWitnesses: { type: "integer" },
      },
      required: ["eligibleWitnesses", "supportingWitnesses"],
    },
    ports: {
      inputs: [
        {
          id: "witnessIds",
          label: "Witness Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "readingIds",
          label: "Reading Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "selectedReading",
          label: "Selected Reading",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "omittedWitnesses",
          label: "Omitted Witnesses",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "eligibleWitnesses",
          label: "Eligible Witnesses",
          valueType: { type: "integer" },
        },
        {
          id: "supportingWitnesses",
          label: "Supporting Witnesses",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = teiWitnessSupportCountTool.execute;
export default teiWitnessSupportCountTool;
