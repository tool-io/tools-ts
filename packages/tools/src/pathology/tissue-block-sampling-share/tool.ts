import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly blockVolumes: readonly number[];
  readonly selected: readonly boolean[];
  readonly validSource: readonly boolean[];
};
export type Output = {
  readonly totalVolume: number;
  readonly sampledValidVolume: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blockVolumes: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    selected: { type: "array", maxItems: 256, items: { type: "boolean" } },
    validSource: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["blockVolumes", "selected", "validSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalVolume: { type: "number" },
    sampledValidVolume: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["totalVolume", "sampledValidVolume", "share", "defined"],
} as const;
/** Calculate tissue block sampling share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { blockVolumes, selected, validSource } = request;
  const compute = (): Output => {
    H.sameLength(blockVolumes, selected);
    H.sameLength(blockVolumes, validSource);
    H.domain(blockVolumes.every((x) => x >= 0));
    return (() => {
      const totalVolume = blockVolumes.reduce((a, b) => a + b, 0),
        sampledValidVolume = blockVolumes.reduce(
          (s, x, i) => s + (selected[i] && validSource[i] ? x : 0),
          0,
        );
      return {
        totalVolume,
        sampledValidVolume,
        share: totalVolume > 0 ? sampledValidVolume / totalVolume : 0,
        defined: totalVolume > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    blockVolumes: [2, 3, 5],
    selected: [true, true, false],
    validSource: [true, false, true],
  },
  output: { totalVolume: 10, sampledValidVolume: 2, share: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const tissueBlockSamplingShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/tissue-block-sampling-share",
    title: "Tissue Block Sampling Share Tool",
    description:
      "Calculate tissue block sampling share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blockVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        selected: { type: "array", maxItems: 256, items: { type: "boolean" } },
        validSource: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["blockVolumes", "selected", "validSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalVolume: { type: "number" },
        sampledValidVolume: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["totalVolume", "sampledValidVolume", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "blockVolumes",
          label: "Block Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "selected",
          label: "Selected",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "validSource",
          label: "Valid Source",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "totalVolume",
          label: "Total Volume",
          valueType: { type: "number" },
        },
        {
          id: "sampledValidVolume",
          label: "Sampled Valid Volume",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = tissueBlockSamplingShareTool.execute;
export default tissueBlockSamplingShareTool;
