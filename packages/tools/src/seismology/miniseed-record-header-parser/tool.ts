import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const miniseedRecordHeaderParserExample = {
  input: { network: "IU", station: "ANMO", location: "00", channel: "BHZ" },
  output: {
    sourceId: "IU.ANMO.00.BHZ",
    bandAndInstrument: "BH",
    codesValid: true,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

const codeIsPrintable = (code: string) => /^[A-Z0-9]+$/.test(code);
const locationIsPrintable = (code: string) => /^[A-Z0-9]*$/.test(code);

export const miniseedRecordHeaderParserTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    ((raw: Record<string, unknown>) => {
      const network = raw.network as string;
      const station = raw.station as string;
      const location = (raw.location as string) ?? "";
      const channel = raw.channel as string;
      const codesValid =
        network.length >= 1 &&
        network.length <= 2 &&
        codeIsPrintable(network) &&
        station.length >= 1 &&
        station.length <= 5 &&
        codeIsPrintable(station) &&
        location.length <= 2 &&
        locationIsPrintable(location) &&
        channel.length === 3 &&
        codeIsPrintable(channel);
      return {
        sourceId: [network, station, location || "--", channel].join("."),
        bandAndInstrument: channel.slice(0, 2).toUpperCase(),
        codesValid,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Validate miniSEED/FDSN channel identifier rules — NSLC code lengths, printable characters, and the '--' placeholder for an empty location — and assemble NET.STA.LOC.CHA; this is not a binary SEED record parser.",
  id: "seismology/miniseed-record-header-parser",
  inputs: [
    {
      description: "Network code (1-2 chars).",
      id: "network",
      kind: "string",
      label: "NET",
    },
    {
      description: "Station code (1-5 chars).",
      id: "station",
      kind: "string",
      label: "STA",
    },
    {
      description: "Location code (0-2 chars; empty allowed).",
      id: "location",
      kind: "string",
      label: "LOC",
    },
    {
      description: "Channel code (3 chars).",
      id: "channel",
      kind: "string",
      label: "CHA",
    },
  ],
  outputs: [
    {
      description: "FDSN source identifier NET.STA.LOC.CHA.",
      id: "sourceId",
      kind: "string",
      label: "SID",
    },
    {
      description: "Band and instrument codes parsed from the channel.",
      id: "bandAndInstrument",
      kind: "string",
      label: "B/I",
    },
    {
      description:
        "Whether all NSLC codes satisfy SEED length and printable-character rules.",
      id: "codesValid",
      kind: "boolean",
      label: "Valid",
    },
  ],
  title: "MiniSEED Channel Identifier Validator",
});
export const runMiniseedRecordHeaderParser =
  miniseedRecordHeaderParserTool.execute;
export { miniseedRecordHeaderParserExample as example };
export default miniseedRecordHeaderParserTool;
