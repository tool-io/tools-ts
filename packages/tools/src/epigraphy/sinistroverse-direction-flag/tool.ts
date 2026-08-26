import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SinistroverseDirectionFlagInput = {
  readonly direction: string;
};

export type SinistroverseDirectionFlagOutput = {
  readonly isSinistroverse: boolean;
  readonly normalized: "sinistroverse" | "dextroverse";
};

const SINISTROVERSE_TOKENS = new Set([
  "sinistroverse",
  "sinistrorse",
  "retrograde",
  "leftward",
  "right-to-left",
  "rtl",
]);
const DEXTROVERSE_TOKENS = new Set([
  "dextroverse",
  "leftward-to-right",
  "left-to-right",
  "rightward",
  "ltr",
]);

export const calculateSinistroverseDirectionFlag = (
  input: SinistroverseDirectionFlagInput,
): SinistroverseDirectionFlagOutput => {
  const token = input.direction.trim().toLowerCase();
  if (!token)
    simpleError(
      "direction",
      "Direction token must not be empty.",
      "empty_direction",
    );
  if (SINISTROVERSE_TOKENS.has(token))
    return { isSinistroverse: true, normalized: "sinistroverse" };
  if (DEXTROVERSE_TOKENS.has(token))
    return { isSinistroverse: false, normalized: "dextroverse" };
  return simpleError(
    "direction",
    `Unknown script direction token: ${input.direction}.`,
    "unknown_direction",
  );
};

export const sinistroverseDirectionFlagExample = {
  input: { direction: "sinistroverse" },
  output: { isSinistroverse: true, normalized: "sinistroverse" },
} satisfies ToolExample<
  SinistroverseDirectionFlagInput,
  SinistroverseDirectionFlagOutput
>;

export const sinistroverseDirectionFlagTool = createSimpleTool({
  id: "epigraphy/sinistroverse-direction-flag",
  title: "Sinistroverse Leftward Script Direction Flag Checker",
  description:
    "Flags whether a script direction token describes leftward (sinistroverse) rather than rightward writing.",
  inputs: [
    {
      id: "direction",
      kind: "string",
      label: "Direction",
      description: "Direction token such as 'sinistroverse', 'rtl' or 'ltr'.",
    },
  ],
  outputs: [
    {
      id: "isSinistroverse",
      kind: "boolean",
      label: "Sinistroverse",
      description: "Whether the direction is leftward.",
    },
    {
      id: "normalized",
      kind: "string",
      enum: ["sinistroverse", "dextroverse"],
      label: "Normalized",
      description: "Canonical direction classification.",
    },
  ],
  calculate: (input) =>
    calculateSinistroverseDirectionFlag(
      input as unknown as SinistroverseDirectionFlagInput,
    ),
});

export const runSinistroverseDirectionFlag =
  sinistroverseDirectionFlagTool.execute;
export default sinistroverseDirectionFlagTool;
