import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly settingArea: number;
  readonly usableLinenArea: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    settingArea: { type: "number", minimum: 0 },
    usableLinenArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["settingArea", "usableLinenArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate place setting linen area share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { settingArea, usableLinenArea } = request;
  const compute = (): Output => {
    H.positive(usableLinenArea);
    H.domain(settingArea >= 0 && settingArea <= usableLinenArea);
    return { share: settingArea / usableLinenArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { settingArea: 0.2, usableLinenArea: 2 },
  output: { share: 0.1 },
} satisfies ToolExample<Input, Output>;
export const placeSettingLinenAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/place-setting-linen-area-share",
    title: "Place Setting Linen Area Share Tool",
    description:
      "Calculate place setting linen area share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        settingArea: { type: "number", minimum: 0 },
        usableLinenArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["settingArea", "usableLinenArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "settingArea",
          label: "Setting Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "usableLinenArea",
          label: "Usable Linen Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = placeSettingLinenAreaShareTool.execute;
export default placeSettingLinenAreaShareTool;
