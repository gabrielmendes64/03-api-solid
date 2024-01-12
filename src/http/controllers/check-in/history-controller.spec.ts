import { afterAll, beforeAll, it, describe, expect } from "vitest";
import { app } from "../../../app";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";



describe("History Check-in (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});
	
	afterAll(async () => {
		await app.close();
	});

	it("shoud be able to list th history of check-in",async () => {

		const {token} = await createAndAuthenticateUser(app);
        
		const user = await prisma.user.findFirstOrThrow();

		const gym = await prisma.gym.create({
			data: {
				title: "Js Gym",
				latitude: -4.3750223,
				longitude: -38.8064687
			}}
		);

		await prisma.checkIn.createMany({
			data: [
				{
					gym_id: gym.id,
					user_id: user.id
				},
				{
					gym_id: gym.id,
					user_id: user.id
				},
			]
		});

		const response = await request(app.server)
			.get("/check-ins/history")
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.checkIns).toEqual([
			expect.objectContaining({
				gym_id: gym.id,
				user_id: user.id
			}),
			expect.objectContaining({
				gym_id: gym.id,
				user_id: user.id
			}),
		]);
		
	});
});

