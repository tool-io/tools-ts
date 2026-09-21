import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sliceThicknesses: readonly number[];
  readonly structurePresent: readonly boolean[];
  readonly annotated: readonly boolean[];
};
export type Output = {
  readonly structureDepth: number;
  readonly annotatedDepth: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sliceThicknesses: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    structurePresent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    annotated: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["sliceThicknesses", "structurePresent", "annotated"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    structureDepth: { type: "number" },
    annotatedDepth: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["structureDepth", "annotatedDepth", "share", "defined"],
} as const;
/** Calculate structure slice support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sliceThicknesses, structurePresent, annotated } = request;
  const compute = (): Output => {
    H.sameLength(sliceThicknesses, structurePresent);
    H.sameLength(sliceThicknesses, annotated);
    H.domain(sliceThicknesses.every((x) => x >= 0));
    return (() => {
      const structureDepth = sliceThicknesses.reduce(
          (s, x, i) => s + (structurePresent[i] ? x : 0),
          0,
        ),
        annotatedDepth = sliceThicknesses.reduce(
          (s, x, i) => s + (structurePresent[i] && annotated[i] ? x : 0),
          0,
        );
      return {
        structureDepth,
        annotatedDepth,
        share: structureDepth > 0 ? annotatedDepth / structureDepth : 0,
        defined: structureDepth > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sliceThicknesses: [2, 3, 5],
    structurePresent: [true, true, false],
    annotated: [true, false, true],
  },
  output: { structureDepth: 5, annotatedDepth: 2, share: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const structureSliceSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anatomy/structure-slice-support-share",
    title: "Structure Slice Support Share Tool",
    description:
      "Calculate structure slice support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sliceThicknesses: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        structurePresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        annotated: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["sliceThicknesses", "structurePresent", "annotated"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        structureDepth: { type: "number" },
        annotatedDepth: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["structureDepth", "annotatedDepth", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "sliceThicknesses",
          label: "Slice Thicknesses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "structurePresent",
          label: "Structure Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "annotated",
          label: "Annotated",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "structureDepth",
          label: "Structure Depth",
          valueType: { type: "number" },
        },
        {
          id: "annotatedDepth",
          label: "Annotated Depth",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = structureSliceSupportShareTool.execute;
export default structureSliceSupportShareTool;
