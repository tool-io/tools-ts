import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly citedIds: readonly string[];
  readonly firstTarget: string;
  readonly secondTarget: string;
  readonly weight: number;
};
export type Output = {
  readonly coCited: boolean;
  readonly contribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    firstTarget: { type: "string", maxLength: 8192 },
    secondTarget: { type: "string", maxLength: 8192 },
    weight: { type: "number", minimum: 0 },
  },
  required: ["citedIds", "firstTarget", "secondTarget", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coCited: { type: "boolean" },
    contribution: { type: "number" },
  },
  required: ["coCited", "contribution"],
} as const;
/** Calculate cocitation one shared citing record from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { citedIds, firstTarget, secondTarget, weight } = request;
  const compute = (): Output => {
    H.domain(firstTarget !== secondTarget && weight >= 0);
    const coCited =
      citedIds.includes(firstTarget) && citedIds.includes(secondTarget);
    return { coCited, contribution: coCited ? weight : 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    citedIds: ["A", "B", "C"],
    firstTarget: "A",
    secondTarget: "B",
    weight: 1,
  },
  output: { coCited: true, contribution: 1 },
} satisfies ToolExample<Input, Output>;
export const cocitationOneSharedCitingRecordTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/cocitation-one-shared-citing-record",
    title: "Cocitation One Shared Citing Record Tool",
    description:
      "Calculate cocitation one shared citing record from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        citedIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        firstTarget: { type: "string", maxLength: 8192 },
        secondTarget: { type: "string", maxLength: 8192 },
        weight: { type: "number", minimum: 0 },
      },
      required: ["citedIds", "firstTarget", "secondTarget", "weight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coCited: { type: "boolean" },
        contribution: { type: "number" },
      },
      required: ["coCited", "contribution"],
    },
    ports: {
      inputs: [
        {
          id: "citedIds",
          label: "Cited Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "firstTarget",
          label: "First Target",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondTarget",
          label: "Second Target",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "coCited", label: "Co Cited", valueType: { type: "boolean" } },
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cocitationOneSharedCitingRecordTool.execute;
export default cocitationOneSharedCitingRecordTool;
