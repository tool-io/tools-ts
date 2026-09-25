import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly octet: number;
  readonly container: string;
  readonly indefinite: boolean;
  readonly expectingMapValue: boolean;
};
export type Output = { readonly isBreak: boolean; readonly permitted: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    octet: { type: "integer", minimum: 0, maximum: 255 },
    container: {
      type: "string",
      maxLength: 8192,
      enum: ["array", "map", "bytes", "text", "none"],
    },
    indefinite: { type: "boolean" },
    expectingMapValue: { type: "boolean" },
  },
  required: ["octet", "container", "indefinite", "expectingMapValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { isBreak: { type: "boolean" }, permitted: { type: "boolean" } },
  required: ["isBreak", "permitted"],
} as const;
/** Check a break octet against the supplied immediate CBOR container state. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { octet, container, indefinite, expectingMapValue } = request;
  const compute = (): Output => {
    H.integer(octet, 0, 255);
    H.domain(["array", "map", "bytes", "text", "none"].includes(container));
    const isBreak = octet === 255;
    return {
      isBreak,
      permitted:
        isBreak &&
        indefinite &&
        container !== "none" &&
        !(container === "map" && expectingMapValue),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    octet: 255,
    container: "map",
    indefinite: true,
    expectingMapValue: false,
  },
  output: { isBreak: true, permitted: true },
} satisfies ToolExample<Input, Output>;
export const cborBreakContextTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/cbor-break-context-token",
    title: "CBOR Break Context Token Tool",
    description:
      "Check a break octet against the supplied immediate CBOR container state.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        octet: { type: "integer", minimum: 0, maximum: 255 },
        container: {
          type: "string",
          maxLength: 8192,
          enum: ["array", "map", "bytes", "text", "none"],
        },
        indefinite: { type: "boolean" },
        expectingMapValue: { type: "boolean" },
      },
      required: ["octet", "container", "indefinite", "expectingMapValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        isBreak: { type: "boolean" },
        permitted: { type: "boolean" },
      },
      required: ["isBreak", "permitted"],
    },
    ports: {
      inputs: [
        {
          id: "octet",
          label: "Octet",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "container",
          label: "Container",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "indefinite",
          label: "Indefinite",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "expectingMapValue",
          label: "Expecting Map Value",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "isBreak", label: "Is Break", valueType: { type: "boolean" } },
        { id: "permitted", label: "Permitted", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = cborBreakContextTokenTool.execute;
export default cborBreakContextTokenTool;
