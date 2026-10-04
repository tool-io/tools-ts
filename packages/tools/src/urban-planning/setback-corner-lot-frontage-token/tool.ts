import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frontageNames: readonly string[];
  readonly selectedFrontages: readonly string[];
};
export type Output = {
  readonly matched: readonly string[];
  readonly unknown: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frontageNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    selectedFrontages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["frontageNames", "selectedFrontages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matched: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unknown: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["matched", "unknown"],
} as const;
/** Resolve supplied corner-lot frontage names without deciding a statutory front-yard designation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frontageNames, selectedFrontages } = request;
  const compute = (): Output => {
    H.domain(new Set(frontageNames).size === frontageNames.length);
    const chosen = [...new Set(selectedFrontages)];
    return {
      matched: chosen.filter((x) => frontageNames.includes(x)),
      unknown: chosen.filter((x) => !frontageNames.includes(x)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    frontageNames: ["north", "east"],
    selectedFrontages: ["east", "south"],
  },
  output: { matched: ["east"], unknown: ["south"] },
} satisfies ToolExample<Input, Output>;
export const setbackCornerLotFrontageTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/setback-corner-lot-frontage-token",
    title: "Setback Corner Lot Frontage Token Tool",
    description:
      "Resolve supplied corner-lot frontage names without deciding a statutory front-yard designation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frontageNames: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        selectedFrontages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["frontageNames", "selectedFrontages"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matched: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        unknown: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["matched", "unknown"],
    },
    ports: {
      inputs: [
        {
          id: "frontageNames",
          label: "Frontage Names",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "selectedFrontages",
          label: "Selected Frontages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "matched",
          label: "Matched",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "unknown",
          label: "Unknown",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = setbackCornerLotFrontageTokenTool.execute;
export default setbackCornerLotFrontageTokenTool;
