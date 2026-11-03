import { describe, expect, it } from "vitest";
import { getNotificationStore } from "./store";

const payload = (eventId: string) => ({
	eventId,
	type: "dataset.updated",
	occurredAt: "2026-10-27T12:00:00Z",
});

// Example test of API-side code (src/app/api/<slug>/**).
describe("getNotificationStore", () => {
	it("returns the same in-memory store on every call", () => {
		expect(getNotificationStore()).toBe(getNotificationStore());
	});

	it("records notifications newest first and answers idempotency checks", async () => {
		const store = getNotificationStore();
		expect(await store.has("evt-1")).toBe(false);

		const first = await store.save(payload("evt-1"));
		await store.save(payload("evt-2"));

		expect(first.id).toBeTruthy();
		expect(await store.has("evt-1")).toBe(true);
		expect((await store.list(1)).map((entry) => entry.eventId)).toEqual(["evt-2"]);
	});
});
