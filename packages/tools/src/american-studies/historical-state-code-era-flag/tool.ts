import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly code: string;
  readonly codes: readonly string[];
  readonly starts: readonly number[];
  readonly ends: readonly number[];
  readonly coordinate: number;
};
export type Output = {
  readonly knownCode: boolean;
  readonly validAtCoordinate: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", maxLength: 8192 },
    codes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    starts: { type: "array", maxItems: 256, items: { type: "number" } },
    ends: { type: "array", maxItems: 256, items: { type: "number" } },
    coordinate: { type: "number" },
  },
  required: ["code", "codes", "starts", "ends", "coordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knownCode: { type: "boolean" },
    validAtCoordinate: { type: "boolean" },
  },
  required: ["knownCode", "validAtCoordinate"],
} as const;
/** Test a public code against caller-supplied half-open era records; no code history dataset is bundled. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { code, codes, starts, ends, coordinate } = request;
  const compute = (): Output => {
    H.sameLength(codes, starts);
    H.sameLength(codes, ends);
    H.domain(starts.every((x, i) => x <= ends[i]));
    return {
      knownCode: codes.includes(code),
      validAtCoordinate: codes.some(
        (x, i) => x === code && coordinate >= starts[i] && coordinate < ends[i],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    code: "XY",
    codes: ["XY"],
    starts: [1800],
    ends: [1900],
    coordinate: 1850,
  },
  output: { knownCode: true, validAtCoordinate: true },
} satisfies ToolExample<Input, Output>;
export const historicalStateCodeEraFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "american-studies/historical-state-code-era-flag",
    title: "Historical State Code Era Flag Tool",
    description:
      "Test a public code against caller-supplied half-open era records; no code history dataset is bundled.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        code: { type: "string", maxLength: 8192 },
        codes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        starts: { type: "array", maxItems: 256, items: { type: "number" } },
        ends: { type: "array", maxItems: 256, items: { type: "number" } },
        coordinate: { type: "number" },
      },
      required: ["code", "codes", "starts", "ends", "coordinate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        knownCode: { type: "boolean" },
        validAtCoordinate: { type: "boolean" },
      },
      required: ["knownCode", "validAtCoordinate"],
    },
    ports: {
      inputs: [
        {
          id: "code",
          label: "Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codes",
          label: "Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "starts",
          label: "Starts",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "ends",
          label: "Ends",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "knownCode",
          label: "Known Code",
          valueType: { type: "boolean" },
        },
        {
          id: "validAtCoordinate",
          label: "Valid At Coordinate",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicalStateCodeEraFlagTool.execute;
export default historicalStateCodeEraFlagTool;
