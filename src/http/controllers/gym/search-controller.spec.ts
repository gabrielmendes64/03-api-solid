import { afterAll, beforeAll, it, describe, expect } from "vitest";
import { app } from "../../../app";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";



describe("Search Gyms (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});
	
	afterAll(async () => {
		await app.close();
	});

	it("shoud be able to search gyms by title",async () => {

		const {token} = await createAndAuthenticateUser(app, true);

		await request(app.server)
			.get("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Js Gym",
				description: "Some description",
				phone: "8599999999",
				latitude: -4.3750223,
				longitude: -38.8064687
			});

		await request(app.server)
			.get("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Ts Gym",
				description: "Some description",
				phone: "8599999999",
				latitude: -4.3750223,
				longitude: -38.8064687
			});

		const response = await request(app.server)
			.get("/gyms/search")
			.query({
				q: "Js",
			})
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: "Js Gym"
			})
		]);
		
	});
});

