import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly edgePresent: boolean;
  readonly suppliedWeight: number;
  readonly absentUsesZero: boolean;
};
export type Output = {
  readonly entryValue: number;
  readonly weightIsAmbiguous: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edgePresent: { type: "boolean" },
    suppliedWeight: { type: "number" },
    absentUsesZero: { type: "boolean" },
  },
  required: ["edgePresent", "suppliedWeight", "absentUsesZero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryValue: { type: "number" },
    weightIsAmbiguous: { type: "boolean" },
  },
  required: ["entryValue", "weightIsAmbiguous"],
} as const;
/** Represent an explicit adjacency entry with a zero absence sentinel and flag a present zero-weight collision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { edgePresent, suppliedWeight, absentUsesZero } = request;
  const compute = (): Output => {
    return {
      entryValue: edgePresent ? suppliedWeight : 0,
      weightIsAmbiguous: absentUsesZero && edgePresent && suppliedWeight === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { edgePresent: true, suppliedWeight: 0, absentUsesZero: true },
  output: { entryValue: 0, weightIsAmbiguous: true },
} satisfies ToolExample<Input, Output>;
export const adjacencyEntryAbsentZeroCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["graph", "mathematics"],
      keywords: ["graph", "mathematics"],
    },
    id: "graph/adjacency-entry-absent-zero-crosswalk",
    title: "Adjacency Entry Absent Zero Crosswalk",
    description:
      "Represent an explicit adjacency entry with a zero absence sentinel and flag a present zero-weight collision.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edgePresent: { type: "boolean" },
        suppliedWeight: { type: "number" },
        absentUsesZero: { type: "boolean" },
      },
      required: ["edgePresent", "suppliedWeight", "absentUsesZero"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryValue: { type: "number" },
        weightIsAmbiguous: { type: "boolean" },
      },
      required: ["entryValue", "weightIsAmbiguous"],
    },
    ports: {
      inputs: [
        {
          id: "edgePresent",
          label: "Edge Present",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedWeight",
          label: "Supplied Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "absentUsesZero",
          label: "Absent Uses Zero",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "entryValue",
          label: "Entry Value",
          valueType: { type: "number" },
        },
        {
          id: "weightIsAmbiguous",
          label: "Weight Is Ambiguous",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = adjacencyEntryAbsentZeroCrosswalkTool.execute;
export default adjacencyEntryAbsentZeroCrosswalkTool;
