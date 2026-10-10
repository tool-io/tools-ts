import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly crateInternalLength: number;
  readonly displayObjectLength: number;
  readonly suppliedPaddingEachEnd: number;
};
export type Output = { readonly remainingLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crateInternalLength: { type: "number", minimum: 0 },
    displayObjectLength: { type: "number", minimum: 0 },
    suppliedPaddingEachEnd: { type: "number", minimum: 0 },
  },
  required: [
    "crateInternalLength",
    "displayObjectLength",
    "suppliedPaddingEachEnd",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingLength: { type: "number" } },
  required: ["remainingLength"],
} as const;
/** Compare explicit museum-display crate length with object and padding lengths without transport or conservation certification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { crateInternalLength, displayObjectLength, suppliedPaddingEachEnd } =
    request;
  const compute = (): Output => {
    H.domain(
      crateInternalLength >= 0 &&
        displayObjectLength >= 0 &&
        suppliedPaddingEachEnd >= 0,
      "crateInternalLength",
    );
    return {
      remainingLength:
        crateInternalLength - displayObjectLength - 2 * suppliedPaddingEachEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    crateInternalLength: 120,
    displayObjectLength: 100,
    suppliedPaddingEachEnd: 5,
  },
  output: { remainingLength: 10 },
} satisfies ToolExample<Input, Output>;
export const museumEquipmentDisplayCrateClearanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["military-science", "military science", "social sciences"],
        keywords: ["military science", "social sciences"],
      },
      id: "military-science/museum-equipment-display-crate-clearance",
      title: "Museum Equipment Display Crate Clearance",
      description:
        "Compare explicit museum-display crate length with object and padding lengths without transport or conservation certification.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          crateInternalLength: { type: "number", minimum: 0 },
          displayObjectLength: { type: "number", minimum: 0 },
          suppliedPaddingEachEnd: { type: "number", minimum: 0 },
        },
        required: [
          "crateInternalLength",
          "displayObjectLength",
          "suppliedPaddingEachEnd",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { remainingLength: { type: "number" } },
        required: ["remainingLength"],
      },
      ports: {
        inputs: [
          {
            id: "crateInternalLength",
            label: "Crate Internal Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "displayObjectLength",
            label: "Display Object Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedPaddingEachEnd",
            label: "Supplied Padding Each End",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remainingLength",
            label: "Remaining Length",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = museumEquipmentDisplayCrateClearanceTool.execute;
export default museumEquipmentDisplayCrateClearanceTool;
