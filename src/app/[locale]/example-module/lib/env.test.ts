import { afterEach, describe, expect, it, vi } from "vitest";
import { getExampleModuleEnv } from "./env";

// Example of testing env-dependent code: use vi.stubEnv instead of writing to
// process.env, and always restore it so tests stay independent.
describe("getExampleModuleEnv", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("falls back to the bundled sample and the default cache lifetime", () => {
		vi.stubEnv("EXAMPLE_MODULE_SOURCE_URL", "");
		vi.stubEnv("EXAMPLE_MODULE_REVALIDATE_SECONDS", "not-a-number");

		const env = getExampleModuleEnv();
		expect(env.sourceUrl).toBeNull();
		expect(env.revalidateSeconds).toBe(300);
	});

	it("trims the source URL and accepts a positive cache lifetime", () => {
		vi.stubEnv("EXAMPLE_MODULE_SOURCE_URL", "  https://example.org/sample.csv  ");
		vi.stubEnv("EXAMPLE_MODULE_REVALIDATE_SECONDS", "60");

		const env = getExampleModuleEnv();
		expect(env.sourceUrl).toBe("https://example.org/sample.csv");
		expect(env.revalidateSeconds).toBe(60);
	});
});
