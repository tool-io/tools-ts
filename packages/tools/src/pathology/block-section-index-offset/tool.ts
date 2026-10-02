import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly section: number;
  readonly referenceSection: number;
  readonly sectionsPerBlock: number;
};
export type Output = {
  readonly blockOffset: number;
  readonly withinBlock: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    section: { type: "integer", minimum: 0 },
    referenceSection: { type: "integer", minimum: 0 },
    sectionsPerBlock: { type: "integer", minimum: 1 },
  },
  required: ["section", "referenceSection", "sectionsPerBlock"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blockOffset: { type: "integer" },
    withinBlock: { type: "integer" },
  },
  required: ["blockOffset", "withinBlock"],
} as const;
/** Calculate block section index offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { section, referenceSection, sectionsPerBlock } = request;
  const compute = (): Output => {
    H.integer(section, 0);
    H.integer(referenceSection, 0);
    H.integer(sectionsPerBlock, 1);
    return (() => {
      const d = BigInt(section) - BigInt(referenceSection),
        n = BigInt(sectionsPerBlock);
      let q = d / n,
        r = d % n;
      if (r < 0n) {
        q--;
        r += n;
      }
      return { blockOffset: Number(q), withinBlock: Number(r) };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { section: 12, referenceSection: 2, sectionsPerBlock: 4 },
  output: { blockOffset: 2, withinBlock: 2 },
} satisfies ToolExample<Input, Output>;
export const blockSectionIndexOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/block-section-index-offset",
    title: "Block Section Index Offset Tool",
    description:
      "Calculate block section index offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        section: { type: "integer", minimum: 0 },
        referenceSection: { type: "integer", minimum: 0 },
        sectionsPerBlock: { type: "integer", minimum: 1 },
      },
      required: ["section", "referenceSection", "sectionsPerBlock"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blockOffset: { type: "integer" },
        withinBlock: { type: "integer" },
      },
      required: ["blockOffset", "withinBlock"],
    },
    ports: {
      inputs: [
        {
          id: "section",
          label: "Section",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceSection",
          label: "Reference Section",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sectionsPerBlock",
          label: "Sections Per Block",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "blockOffset",
          label: "Block Offset",
          valueType: { type: "integer" },
        },
        {
          id: "withinBlock",
          label: "Within Block",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = blockSectionIndexOffsetTool.execute;
export default blockSectionIndexOffsetTool;
