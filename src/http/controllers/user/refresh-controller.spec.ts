import { afterAll, beforeAll, it, describe, expect } from "vitest";
import { app } from "../../../app";
import request from "supertest";



describe("Refresh (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});
	
	afterAll(async () => {
		await app.close();
	});

	it("shoud be able to refresh",async () => {

		await request(app.server).post("/users").send({
			name: "fulano",
			email: "fulano@gmail.com",
			password: "123456"
		});


		const authResponse = await request(app.server).post("/sessions").send({
			email: "fulano@gmail.com",
			password: "123456"
		});

		const cookies = authResponse.get("Set-Cookie");

		const response = await request(app.server)
			.patch("/token/refresh")
			.set("Cookie", cookies)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body).toEqual({
			token: expect.any(String),
		});
		expect(response.get("Set-Cookie")).toEqual([
			expect.stringContaining("refreshToken=")
		]);

	});
});

