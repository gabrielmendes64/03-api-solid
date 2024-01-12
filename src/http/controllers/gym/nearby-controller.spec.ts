import { afterAll, beforeAll, it, describe, expect } from "vitest";
import { app } from "@/app";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";



describe("Nearby Gyms (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});
	
	afterAll(async () => {
		await app.close();
	});

	it("should be able list nearby gyms",async () => {

		const {token} = await createAndAuthenticateUser(app, true);

		await request(app.server)
			.get("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Js Gym",
				description: "Some description",
				phone: "8599999999",
				latitude: -4.3298377,
				longitude: -38.8807741
			});

		await request(app.server)
			.get("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Ts Gym",
				description: "Some description",
				phone: "8599999999",
				latitude: -4.9694664,
				longitude: -39.0162098  
			});

		const response = await request(app.server)
			.get("/gyms/nearby")
			.query({				
				latitude: -4.3298377,
				longitude: -38.8807741
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

