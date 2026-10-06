import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly crateInternalDimensions: readonly number[];
  readonly objectDimensions: readonly number[];
  readonly paddingEachSide: readonly number[];
};
export type Output = {
  readonly clearances: readonly number[];
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crateInternalDimensions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    objectDimensions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    paddingEachSide: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["crateInternalDimensions", "objectDimensions", "paddingEachSide"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clearances: { type: "array", maxItems: 256, items: { type: "number" } },
    fits: { type: "boolean" },
  },
  required: ["clearances", "fits"],
} as const;
/** Compare aligned crate and object dimensions after explicit padding on both sides of each axis; no transport-protection recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { crateInternalDimensions, objectDimensions, paddingEachSide } =
    request;
  const compute = (): Output => {
    H.domain(
      crateInternalDimensions.length === objectDimensions.length,
      "objectDimensions",
    );
    H.domain(
      objectDimensions.length === paddingEachSide.length,
      "paddingEachSide",
    );
    H.domain(objectDimensions.length > 0, "objectDimensions");
    crateInternalDimensions.forEach((v) =>
      H.domain(v >= 0, "crateInternalDimensions"),
    );
    objectDimensions.forEach((v) => H.domain(v >= 0, "objectDimensions"));
    paddingEachSide.forEach((v) => H.domain(v >= 0, "paddingEachSide"));
    const clearances = crateInternalDimensions.map(
      (v, i) => v - objectDimensions[i] - 2 * paddingEachSide[i],
    );
    return { clearances, fits: clearances.every((v) => v >= 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    crateInternalDimensions: [100, 80, 60],
    objectDimensions: [80, 50, 40],
    paddingEachSide: [5, 10, 5],
  },
  output: { clearances: [10, 10, 10], fits: true },
} satisfies ToolExample<Input, Output>;
export const objectCrateClearanceMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-conservation", "art conservation", "arts and design"],
      keywords: ["art conservation", "arts and design"],
    },
    id: "art-conservation/object-crate-clearance-margin",
    title: "Object Crate Clearance Margin",
    description:
      "Compare aligned crate and object dimensions after explicit padding on both sides of each axis; no transport-protection recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        crateInternalDimensions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        objectDimensions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        paddingEachSide: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: [
        "crateInternalDimensions",
        "objectDimensions",
        "paddingEachSide",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clearances: { type: "array", maxItems: 256, items: { type: "number" } },
        fits: { type: "boolean" },
      },
      required: ["clearances", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "crateInternalDimensions",
          label: "Crate Internal Dimensions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "objectDimensions",
          label: "Object Dimensions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "paddingEachSide",
          label: "Padding Each Side",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "clearances",
          label: "Clearances",
          valueType: { type: "list", items: { type: "number" } },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = objectCrateClearanceMarginTool.execute;
export default objectCrateClearanceMarginTool;
