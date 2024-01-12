import { afterAll, beforeAll, it, describe, expect } from "vitest";
import { app } from "../../../app";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";



describe("Create Check-in (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});
	
	afterAll(async () => {
		await app.close();
	});

	it("shoud be able to create a check-in",async () => {

		const {token} = await createAndAuthenticateUser(app);

		const gym = await prisma.gym.create({
			data: {
				title: "Js Gym",
				latitude: -4.3750223,
				longitude: -38.8064687
			}}
		);

		const response = await request(app.server)
			.post(`/gyms/${gym.id}/check-ins`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				latitude: -4.3750223,
				longitude: -38.8064687
			});

		expect(response.statusCode).toEqual(201);
		
	});
});

