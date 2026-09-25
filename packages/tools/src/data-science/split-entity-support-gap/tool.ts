import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entityIds: readonly string[];
  readonly splits: readonly string[];
  readonly selectedSplit: string;
  readonly referenceSplit: string;
};
export type Output = {
  readonly selectedEntities: number;
  readonly referenceEntities: number;
  readonly sharedEntities: number;
  readonly selectedOnly: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entityIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    splits: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    selectedSplit: { type: "string", maxLength: 8192 },
    referenceSplit: { type: "string", maxLength: 8192 },
  },
  required: ["entityIds", "splits", "selectedSplit", "referenceSplit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectedEntities: { type: "integer" },
    referenceEntities: { type: "integer" },
    sharedEntities: { type: "integer" },
    selectedOnly: { type: "integer" },
  },
  required: [
    "selectedEntities",
    "referenceEntities",
    "sharedEntities",
    "selectedOnly",
  ],
} as const;
/** Calculate split entity support gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entityIds, splits, selectedSplit, referenceSplit } = request;
  const compute = (): Output => {
    H.sameLength(entityIds, splits);
    H.domain(selectedSplit !== referenceSplit);
    return (() => {
      const a = new Set(
          entityIds.filter((x, i) => splits[i] === selectedSplit),
        ),
        b = new Set(entityIds.filter((x, i) => splits[i] === referenceSplit)),
        sharedEntities = [...a].filter((x) => b.has(x)).length;
      return {
        selectedEntities: a.size,
        referenceEntities: b.size,
        sharedEntities,
        selectedOnly: a.size - sharedEntities,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    entityIds: ["a", "b", "a"],
    splits: ["train", "train", "test"],
    selectedSplit: "train",
    referenceSplit: "test",
  },
  output: {
    selectedEntities: 2,
    referenceEntities: 1,
    sharedEntities: 1,
    selectedOnly: 1,
  },
} satisfies ToolExample<Input, Output>;
export const splitEntitySupportGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/split-entity-support-gap",
    title: "Split Entity Support Gap Tool",
    description:
      "Calculate split entity support gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entityIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        splits: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        selectedSplit: { type: "string", maxLength: 8192 },
        referenceSplit: { type: "string", maxLength: 8192 },
      },
      required: ["entityIds", "splits", "selectedSplit", "referenceSplit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selectedEntities: { type: "integer" },
        referenceEntities: { type: "integer" },
        sharedEntities: { type: "integer" },
        selectedOnly: { type: "integer" },
      },
      required: [
        "selectedEntities",
        "referenceEntities",
        "sharedEntities",
        "selectedOnly",
      ],
    },
    ports: {
      inputs: [
        {
          id: "entityIds",
          label: "Entity Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "splits",
          label: "Splits",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "selectedSplit",
          label: "Selected Split",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceSplit",
          label: "Reference Split",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "selectedEntities",
          label: "Selected Entities",
          valueType: { type: "integer" },
        },
        {
          id: "referenceEntities",
          label: "Reference Entities",
          valueType: { type: "integer" },
        },
        {
          id: "sharedEntities",
          label: "Shared Entities",
          valueType: { type: "integer" },
        },
        {
          id: "selectedOnly",
          label: "Selected Only",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = splitEntitySupportGapTool.execute;
export default splitEntitySupportGapTool;
