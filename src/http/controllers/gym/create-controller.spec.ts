import { afterAll, beforeAll, it, describe, expect } from "vitest";
import { app } from "../../../app";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";



describe("Create Gym (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});
	
	afterAll(async () => {
		await app.close();
	});

	it("shoud be able to create a gym",async () => {

		const {token} = await createAndAuthenticateUser(app, true);

		const response = await request(app.server)
			.get("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Js Gym",
				description: "Some description",
				phone: "8599999999",
				latitude: -4.3750223,
				longitude: -38.8064687
			});

		expect(response.statusCode).toEqual(201);
		
	});
});

