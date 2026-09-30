import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAyah: number;
  readonly lastAyah: number;
  readonly sourceEdition: string;
  readonly includeEnd: boolean;
};
export type Output = { readonly count: number; readonly sourceKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAyah: { type: "integer", minimum: 1 },
    lastAyah: { type: "integer" },
    sourceEdition: { type: "string", maxLength: 8192 },
    includeEnd: { type: "boolean" },
  },
  required: ["firstAyah", "lastAyah", "sourceEdition", "includeEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer" },
    sourceKey: { type: "string", maxLength: 8192 },
  },
  required: ["count", "sourceKey"],
} as const;
/** Count supplied integer ayah indices in one public manuscript edition/chapter without resolving textual variants. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAyah, lastAyah, sourceEdition, includeEnd } = request;
  const compute = (): Output => {
    H.integer(firstAyah, 1);
    H.integer(lastAyah, firstAyah);
    return {
      count: lastAyah - firstAyah + (includeEnd ? 1 : 0),
      sourceKey: JSON.stringify([sourceEdition, firstAyah, lastAyah]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstAyah: 3,
    lastAyah: 8,
    sourceEdition: "edition-A",
    includeEnd: true,
  },
  output: { count: 6, sourceKey: '["edition-A",3,8]' },
} satisfies ToolExample<Input, Output>;
export const publicManuscriptAyahRangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/public-manuscript-ayah-range",
    title: "Public Manuscript Ayah Range Tool",
    description:
      "Count supplied integer ayah indices in one public manuscript edition/chapter without resolving textual variants.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAyah: { type: "integer", minimum: 1 },
        lastAyah: { type: "integer" },
        sourceEdition: { type: "string", maxLength: 8192 },
        includeEnd: { type: "boolean" },
      },
      required: ["firstAyah", "lastAyah", "sourceEdition", "includeEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer" },
        sourceKey: { type: "string", maxLength: 8192 },
      },
      required: ["count", "sourceKey"],
    },
    ports: {
      inputs: [
        {
          id: "firstAyah",
          label: "First Ayah",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastAyah",
          label: "Last Ayah",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sourceEdition",
          label: "Source Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "includeEnd",
          label: "Include End",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "count", label: "Count", valueType: { type: "integer" } },
        { id: "sourceKey", label: "Source Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = publicManuscriptAyahRangeTool.execute;
export default publicManuscriptAyahRangeTool;
