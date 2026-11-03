import { describe, expect, it } from "vitest";
import { parseSampleCsv } from "./transform";

// Example test of server-only code: vitest.config.ts maps "server-only" to an
// empty module, so files under lib/ can be imported here as usual.
describe("parseSampleCsv", () => {
	it("parses rows, normalises headers and sorts by year then country", () => {
		const csv = [
			"Year,Country,Value",
			'2021,Kenya,"1,200"',
			"2020,Uganda,300",
			"2020,Ghana,50",
		].join("\n");

		expect(parseSampleCsv(csv)).toEqual([
			{ year: 2020, country: "Ghana", value: 50 },
			{ year: 2020, country: "Uganda", value: 300 },
			{ year: 2021, country: "Kenya", value: 1200 },
		]);
	});

	it("drops rows with a missing country or a non-numeric value", () => {
		const csv = ["year,country,value", "2020,,10", "2020,Kenya,n/a", "2021,Kenya,7"].join("\n");

		expect(parseSampleCsv(csv)).toEqual([{ year: 2021, country: "Kenya", value: 7 }]);
	});
});
