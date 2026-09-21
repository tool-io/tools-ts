import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cropGroups: readonly string[];
  readonly cropWeights: readonly number[];
  readonly requestedGroup: string;
};
export type Output = {
  readonly groupWeight: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cropGroups: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    cropWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    requestedGroup: { type: "string", maxLength: 8192 },
  },
  required: ["cropGroups", "cropWeights", "requestedGroup"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupWeight: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["groupWeight", "share", "defined"],
} as const;
/** Calculate crop functional group share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cropGroups, cropWeights, requestedGroup } = request;
  const compute = (): Output => {
    H.sameLength(cropGroups, cropWeights);
    H.domain(cropWeights.every((x) => x >= 0));
    return {
      groupWeight: cropWeights.reduce(
        (s, x, i) => s + (cropGroups[i] === requestedGroup ? x : 0),
        0,
      ),
      share: cropWeights.some((x) => x > 0)
        ? cropWeights.reduce(
            (s, x, i) => s + (cropGroups[i] === requestedGroup ? x : 0),
            0,
          ) / cropWeights.reduce((a, b) => a + b, 0)
        : 0,
      defined: cropWeights.some((x) => x > 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cropGroups: ["legume", "cereal", "legume"],
    cropWeights: [2, 6, 2],
    requestedGroup: "legume",
  },
  output: { groupWeight: 4, share: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const cropFunctionalGroupShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/crop-functional-group-share",
    title: "Crop Functional Group Share Tool",
    description:
      "Calculate crop functional group share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cropGroups: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        cropWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        requestedGroup: { type: "string", maxLength: 8192 },
      },
      required: ["cropGroups", "cropWeights", "requestedGroup"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupWeight: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["groupWeight", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "cropGroups",
          label: "Crop Groups",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "cropWeights",
          label: "Crop Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "requestedGroup",
          label: "Requested Group",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "groupWeight",
          label: "Group Weight",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = cropFunctionalGroupShareTool.execute;
export default cropFunctionalGroupShareTool;
