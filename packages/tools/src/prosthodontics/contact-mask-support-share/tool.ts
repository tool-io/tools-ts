import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellAreas: readonly number[];
  readonly contactMask: readonly boolean[];
  readonly sourceValid: readonly boolean[];
};
export type Output = {
  readonly contactArea: number;
  readonly supportedContactArea: number;
  readonly unsupportedContactArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellAreas: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    contactMask: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sourceValid: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["cellAreas", "contactMask", "sourceValid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactArea: { type: "number" },
    supportedContactArea: { type: "number" },
    unsupportedContactArea: { type: "number" },
  },
  required: ["contactArea", "supportedContactArea", "unsupportedContactArea"],
} as const;
/** Calculate contact mask support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellAreas, contactMask, sourceValid } = request;
  const compute = (): Output => {
    H.sameLength(cellAreas, contactMask);
    H.sameLength(cellAreas, sourceValid);
    H.domain(cellAreas.every((x) => x >= 0));
    return (() => {
      const contactArea = cellAreas.reduce(
          (s, x, i) => s + (contactMask[i] ? x : 0),
          0,
        ),
        supportedContactArea = cellAreas.reduce(
          (s, x, i) => s + (contactMask[i] && sourceValid[i] ? x : 0),
          0,
        );
      return {
        contactArea,
        supportedContactArea,
        unsupportedContactArea: contactArea - supportedContactArea,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cellAreas: [2, 3, 5],
    contactMask: [true, true, false],
    sourceValid: [true, false, true],
  },
  output: {
    contactArea: 5,
    supportedContactArea: 2,
    unsupportedContactArea: 3,
  },
} satisfies ToolExample<Input, Output>;
export const contactMaskSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/contact-mask-support-share",
    title: "Contact Mask Support Share Tool",
    description:
      "Calculate contact mask support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        contactMask: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        sourceValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["cellAreas", "contactMask", "sourceValid"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactArea: { type: "number" },
        supportedContactArea: { type: "number" },
        unsupportedContactArea: { type: "number" },
      },
      required: [
        "contactArea",
        "supportedContactArea",
        "unsupportedContactArea",
      ],
    },
    ports: {
      inputs: [
        {
          id: "cellAreas",
          label: "Cell Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "contactMask",
          label: "Contact Mask",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sourceValid",
          label: "Source Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "contactArea",
          label: "Contact Area",
          valueType: { type: "number" },
        },
        {
          id: "supportedContactArea",
          label: "Supported Contact Area",
          valueType: { type: "number" },
        },
        {
          id: "unsupportedContactArea",
          label: "Unsupported Contact Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = contactMaskSupportShareTool.execute;
export default contactMaskSupportShareTool;
