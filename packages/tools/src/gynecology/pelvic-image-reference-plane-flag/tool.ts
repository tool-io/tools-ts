import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly normal: readonly number[];
  readonly reference: readonly number[];
  readonly allowOpposite: boolean;
};
export type Output = {
  readonly parallel: boolean;
  readonly sameDirection: boolean;
  readonly accepted: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normal: { type: "array", maxItems: 256, items: { type: "number" } },
    reference: { type: "array", maxItems: 256, items: { type: "number" } },
    allowOpposite: { type: "boolean" },
  },
  required: ["normal", "reference", "allowOpposite"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parallel: { type: "boolean" },
    sameDirection: { type: "boolean" },
    accepted: { type: "boolean" },
  },
  required: ["parallel", "sameDirection", "accepted"],
} as const;
/** Compare supplied exact plane-normal vectors without assigning anatomy or claiming tolerance-based image registration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { normal, reference, allowOpposite } = request;
  const compute = (): Output => {
    H.domain(
      normal.length === 3 &&
        reference.length === 3 &&
        normal.some((x) => x !== 0) &&
        reference.some((x) => x !== 0),
    );
    const cross = [
      normal[1] * reference[2] - normal[2] * reference[1],
      normal[2] * reference[0] - normal[0] * reference[2],
      normal[0] * reference[1] - normal[1] * reference[0],
    ];
    cross.forEach(H.finite);
    const parallel = cross.every((x) => x === 0),
      sameDirection = H.dot(normal, reference) > 0;
    return {
      parallel,
      sameDirection,
      accepted: parallel && (sameDirection || allowOpposite),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { normal: [0, 0, 1], reference: [0, 0, -1], allowOpposite: true },
  output: { parallel: true, sameDirection: false, accepted: true },
} satisfies ToolExample<Input, Output>;
export const pelvicImageReferencePlaneFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gynecology/pelvic-image-reference-plane-flag",
    title: "Pelvic Image Reference Plane Flag Tool",
    description:
      "Compare supplied exact plane-normal vectors without assigning anatomy or claiming tolerance-based image registration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normal: { type: "array", maxItems: 256, items: { type: "number" } },
        reference: { type: "array", maxItems: 256, items: { type: "number" } },
        allowOpposite: { type: "boolean" },
      },
      required: ["normal", "reference", "allowOpposite"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parallel: { type: "boolean" },
        sameDirection: { type: "boolean" },
        accepted: { type: "boolean" },
      },
      required: ["parallel", "sameDirection", "accepted"],
    },
    ports: {
      inputs: [
        {
          id: "normal",
          label: "Normal",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "allowOpposite",
          label: "Allow Opposite",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "parallel", label: "Parallel", valueType: { type: "boolean" } },
        {
          id: "sameDirection",
          label: "Same Direction",
          valueType: { type: "boolean" },
        },
        { id: "accepted", label: "Accepted", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = pelvicImageReferencePlaneFlagTool.execute;
export default pelvicImageReferencePlaneFlagTool;
