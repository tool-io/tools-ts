import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pixelAreas: readonly number[];
  readonly retinalMask: readonly boolean[];
  readonly validImage: readonly boolean[];
  readonly annotated: readonly boolean[];
};
export type Output = {
  readonly maskedArea: number;
  readonly supportedArea: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pixelAreas: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    retinalMask: { type: "array", maxItems: 256, items: { type: "boolean" } },
    validImage: { type: "array", maxItems: 256, items: { type: "boolean" } },
    annotated: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["pixelAreas", "retinalMask", "validImage", "annotated"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maskedArea: { type: "number" },
    supportedArea: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["maskedArea", "supportedArea", "share", "defined"],
} as const;
/** Account for explicit research mask areas and support flags without retinal image interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pixelAreas, retinalMask, validImage, annotated } = request;
  const compute = (): Output => {
    H.sameLength(pixelAreas, retinalMask);
    H.sameLength(pixelAreas, validImage);
    H.sameLength(pixelAreas, annotated);
    H.domain(pixelAreas.every((x) => x >= 0));
    return (() => {
      const maskedArea = pixelAreas.reduce(
          (s, x, i) => s + (retinalMask[i] ? x : 0),
          0,
        ),
        supportedArea = pixelAreas.reduce(
          (s, x, i) =>
            s + (retinalMask[i] && validImage[i] && annotated[i] ? x : 0),
          0,
        );
      return {
        maskedArea,
        supportedArea,
        share: maskedArea > 0 ? supportedArea / maskedArea : 0,
        defined: maskedArea > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pixelAreas: [2, 3, 5],
    retinalMask: [true, true, false],
    validImage: [true, true, true],
    annotated: [true, false, true],
  },
  output: { maskedArea: 5, supportedArea: 2, share: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const retinalMaskSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ophthalmology/retinal-mask-support-share",
    title: "Retinal Mask Support Share Tool",
    description:
      "Account for explicit research mask areas and support flags without retinal image interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pixelAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        retinalMask: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        validImage: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        annotated: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["pixelAreas", "retinalMask", "validImage", "annotated"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        maskedArea: { type: "number" },
        supportedArea: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["maskedArea", "supportedArea", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "pixelAreas",
          label: "Pixel Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "retinalMask",
          label: "Retinal Mask",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "validImage",
          label: "Valid Image",
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
          id: "maskedArea",
          label: "Masked Area",
          valueType: { type: "number" },
        },
        {
          id: "supportedArea",
          label: "Supported Area",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = retinalMaskSupportShareTool.execute;
export default retinalMaskSupportShareTool;
